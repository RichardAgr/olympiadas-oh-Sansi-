<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class OcrSpaceService
{
    protected $apiKey;
    protected $apiUrl = 'https://api.ocr.space/parse/image';
    protected $timeout = 30;

    public function __construct()
    {
        $this->apiKey = env('OCR_SPACE_API_KEY');
        
        if (empty($this->apiKey)) {
            throw new \RuntimeException('OCR_SPACE_API_KEY no está configurado en el entorno');
        }
    }

    public function processReceipt($imagePath)
    {
        try {
            // Validación del archivo
            if (!file_exists($imagePath)) {
                throw new \InvalidArgumentException('El archivo no existe en la ruta proporcionada');
            }

            $fileSize = filesize($imagePath);
            if ($fileSize > 10485760) { // 10MB
                throw new \InvalidArgumentException('El archivo excede el tamaño máximo de 10MB');
            }

            $mimeType = mime_content_type($imagePath);
            if (!in_array($mimeType, ['image/jpeg', 'image/png', 'image/webp'])) {
                throw new \InvalidArgumentException('Formato de imagen no soportado. Use JPEG, PNG o WEBP');
            }

            // Leer y codificar la imagen
            $imageData = file_get_contents($imagePath);
            if ($imageData === false) {
                throw new \RuntimeException('No se pudo leer el contenido del archivo');
            }

            $base64Image = base64_encode($imageData);

            // Configuración de la solicitud
            $payload = [
                'apikey' => $this->apiKey,
                'base64Image' => 'data:'.$mimeType.';base64,'.$base64Image,
                'language' => 'spa',
                'isTable' => 'true',
                'detectOrientation' => 'true',
                'scale' => 'true',
                'OCREngine' => 1, // Cambiado a engine 2 para mejor reconocimiento de tablas
                'filetype' => strtoupper(pathinfo($imagePath, PATHINFO_EXTENSION)),
                'isCreateSearchablePdf' => 'false',
                'isSearchablePdfHideTextLayer' => 'false',
            ];

            Log::debug('Enviando solicitud a OCR.space', ['payload_size' => strlen($base64Image)]);

            // Envío de la solicitud
            $response = Http::timeout(90)
                ->retry(3, 500)
                ->asForm()
                ->post($this->apiUrl, $payload);

            if ($response->failed()) {
                throw new \RuntimeException('Error en la API OCR: '.$response->status());
            }

            $result = $response->json();

            if (!isset($result['ParsedResults'])) {
                throw new \RuntimeException('Respuesta inesperada de la API OCR');
            }

            if ($result['IsErroredOnProcessing']) {
                $errorMessage = $result['ErrorMessage'][0] ?? 'Error desconocido en el procesamiento OCR';
                throw new \RuntimeException('Error en OCR.space: '.$errorMessage);
            }

            $extractedText = $result['ParsedResults'][0]['ParsedText'] ?? '';
            
            if (empty($extractedText)) {
                throw new \RuntimeException('No se pudo extraer texto de la imagen');
            }

            // Guardar log del texto extraído
            $this->logExtractedText($extractedText);

            return $this->extractReceiptData($extractedText);

        } catch (\Exception $e) {
            Log::error('Error en OcrSpaceService: '.$e->getMessage(), [
                'file' => $imagePath,
                'trace' => $e->getTraceAsString()
            ]);
            
            return [
                'success' => false,
                'error' => $e->getMessage(),
                'error_details' => 'Error al procesar la imagen con OCR'
            ];
        }
    }

    protected function extractReceiptData($text)
    {
        $data = [
            'success' => true,
            'numero_comprobante' => '',
            'nombre_pagador' => '',
            'monto_total' => '',
            'fecha_pago' => '',
            'confianza' => $this->calculateConfidence($text),
            'texto_resumen' => $text
        ];

        // Limpiar el texto para mejor procesamiento
        $cleanText = $this->cleanOcrText($text);
        
        // Número de comprobante - Patrones específicos para UMSS
        $numeroPatterns = [
            '/N\s*rcx\s*(\d{7,10})/i',
            '/N(?:ro|°|umero)?[\s:\.]*(\d{5,10})/i',
            '/RECIBO[\s\r\n]+.*?(\d{7,10})/is',
        ];
        
        foreach ($numeroPatterns as $pattern) {
            if (preg_match($pattern, $cleanText, $matches)) {
                $data['numero_comprobante'] = trim($matches[1]);
                break;
            }
        }

        // Nombre del pagador
        $nombrePatterns = [
            '/N\s*ombre[\s\t]*([a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+)(?=[\r\n\t]|Cajero)/i',
            '/Nombre[\s:]*([a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+)(?=[\r\n\t])/i',
            '/(?:Estudiante|Cliente)[\s:]*([a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+)(?=[\r\n\t])/i',
        ];
        
        foreach ($nombrePatterns as $pattern) {
            if (preg_match($pattern, $cleanText, $matches)) {
                $nombre = trim($matches[1]);
                $nombre = preg_replace('/[^\p{L}\s]/u', '', $nombre);
                $nombre = preg_replace('/\s+/', ' ', $nombre);
                if (strlen($nombre) > 3) {
                    $data['nombre_pagador'] = ucwords(strtolower($nombre));
                    break;
                }
            }
        }

        // Fecha de pago
        $fechaPatterns = [
            '/Fecha\s*de\s*pago:\s*(\d{4}-\d{2}-\d{2})/i',
            '/Fecha\s*de\s*pago:\s*(\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4})/i',
            '/(\d{4}-\d{2}-\d{2})(?=\s*(?:$|\r|\n|Periodo))/i',
            '/(\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4})(?=\s*(?:$|\r|\n|Periodo|Área))/i',
        ];
        
        foreach ($fechaPatterns as $pattern) {
            if (preg_match($pattern, $cleanText, $matches)) {
                $data['fecha_pago'] = $this->normalizeDate($matches[1]);
                break;
            }
        }

        // MONTO TOTAL - PATRONES ESPECÍFICOS MEJORADOS
        $data['monto_total'] = $this->extractMontoTotal($text);

        return $data;
    }

    protected function extractMontoTotal($text)
    {
        // Primero intentar extraer de texto en palabras (más confiable)
        $montoFromWords = $this->extractMontoFromWords($text);
        if (!empty($montoFromWords)) {
            return $this->cleanMontoFormat($montoFromWords);
        }
        
        // Patrones numéricos específicos para recibos UMSS
        $montoPatterns = [
            // Buscar número después de TOTAL en la misma línea o línea siguiente
            '/TOTAL[\s\t\r\n]*(\d+(?:\s*[.,]\s*\d{2})?)/i',
            
            // Buscar en estructura de tabla: MONTO seguido de número
            '/MONTO[\s\t\r\n]+.*?(\d+(?:\s*[.,]\s*\d{2})?)/is',
            
            // Número seguido de Bs o bolivianos (con posibles espacios)
            '/(\d+(?:\s*[.,]\s*\d{2})?)[\s]*(?:Bs|bolivianos?)/i',
            
            // Buscar números que parecen montos (con decimales y posibles espacios)
            '/(\d{2,3}\s*[.,]\s*\d{2})(?!\d)/i',
            
            // Números standalone que podrían ser montos
            '/(?:^|\s)(\d{2,4})(?=\s|$|\r|\n)/m',
        ];
        
        $possibleAmounts = [];
        
        foreach ($montoPatterns as $pattern) {
            if (preg_match_all($pattern, $text, $matches)) {
                foreach ($matches[1] as $amount) {
                    $cleanAmount = $this->cleanMontoFormat($amount);
                    if (!empty($cleanAmount) && is_numeric($cleanAmount) && $cleanAmount > 0) {
                        $possibleAmounts[] = floatval($cleanAmount);
                    }
                }
            }
        }
        
        if (!empty($possibleAmounts)) {
            // Filtrar montos muy pequeños o muy grandes
            $filteredAmounts = array_filter($possibleAmounts, function($amount) {
                return $amount >= 10 && $amount <= 10000; // Rango razonable para pagos universitarios
            });
            
            if (!empty($filteredAmounts)) {
                // Retornar el monto más grande (probablemente el total)
                $finalAmount = max($filteredAmounts);
                return $this->cleanMontoFormat(number_format($finalAmount, 2, '.', ''));
            }
        }
        
        return '';
    }

    protected function extractMontoFromWords($text)
    {
        // Diccionario de números en español
        $numberWords = [
            'cero' => 0, 'uno' => 1, 'dos' => 2, 'tres' => 3, 'cuatro' => 4, 'cinco' => 5,
            'seis' => 6, 'siete' => 7, 'ocho' => 8, 'nueve' => 9, 'diez' => 10,
            'once' => 11, 'doce' => 12, 'trece' => 13, 'catorce' => 14, 'quince' => 15,
            'dieciséis' => 16, 'diecisiete' => 17, 'dieciocho' => 18, 'diecinueve' => 19,
            'veinte' => 20, 'veintiuno' => 21, 'veintidós' => 22, 'veintitrés' => 23,
            'veinticuatro' => 24, 'veinticinco' => 25, 'veintiséis' => 26, 'veintisiete' => 27,
            'veintiocho' => 28, 'veintinueve' => 29, 'treinta' => 30, 'cuarenta' => 40,
            'cincuenta' => 50, 'sesenta' => 60, 'setenta' => 70, 'ochenta' => 80,
            'noventa' => 90, 'cien' => 100, 'ciento' => 100, 'doscientos' => 200,
            'trescientos' => 300, 'cuatrocientos' => 400, 'quinientos' => 500,
            'seiscientos' => 600, 'setecientos' => 700, 'ochocientos' => 800,
            'novecientos' => 900
        ];
        
        // Buscar patrón "Son: [texto en palabras]"
        if (preg_match('/Son:\s*([^0-9\r\n]+)/i', $text, $matches)) {
            $wordsText = strtolower(trim($matches[1]));
            
            // Limpiar texto mal reconocido por OCR
            $wordsText = preg_replace('/[^a-záéíóúñ\s]/u', '', $wordsText);
            $wordsText = str_replace(['onao', 'onaa', 'onas'], 'ochenta', $wordsText);
            $wordsText = str_replace(['as', 'os'], '', $wordsText);
            
            // Buscar "ciento ochenta" específicamente
            if (preg_match('/ciento\s*ochenta/i', $wordsText)) {
                return $this->cleanMontoFormat('180.00');
            }
            
            // Buscar otros números en palabras
            foreach ($numberWords as $word => $value) {
                if (strpos($wordsText, $word) !== false) {
                    if ($value >= 100) { // Solo considerar montos significativos
                        return $this->cleanMontoFormat(number_format($value, 2, '.', ''));
                    }
                }
            }
        }
        
        return '';
    }

    protected function cleanOcrText($text)
    {
        // Reemplazar caracteres problemáticos del OCR
        $replacements = [
            '/\t+/' => ' ', // Múltiples tabs por espacio
            '/\r\n|\r|\n/' => ' ', // Saltos de línea por espacio
            '/\s+/' => ' ', // Múltiples espacios por uno solo
        ];
        
        $cleanText = $text;
        foreach ($replacements as $pattern => $replacement) {
            $cleanText = preg_replace($pattern, $replacement, $cleanText);
        }
        
        return trim($cleanText);
    }

    protected function extractMontoFromTable($text)
    {
        // Buscar patrones de tabla con números
        $lines = explode(' ', $text);
        $numbers = [];
        
        foreach ($lines as $line) {
            if (preg_match('/^\d+(?:[.,]\d{2})?$/', trim($line))) {
                $number = str_replace(',', '.', trim($line));
                if (is_numeric($number) && $number > 10) { // Filtrar números muy pequeños
                    $numbers[] = $number;
                }
            }
        }
        
        // Retornar el número más grande (probablemente el total)
        return !empty($numbers) ? max($numbers) : '';
    }

    protected function normalizeDate($dateStr)
    {
        // Convertir meses en español a formato numérico
        $spanishMonths = [
            'ENERO' => '01', 'FEBRERO' => '02', 'MARZO' => '03',
            'ABRIL' => '04', 'MAYO' => '05', 'JUNIO' => '06',
            'JULIO' => '07', 'AGOSTO' => '08', 'SEPTIEMBRE' => '09',
            'OCTUBRE' => '10', 'NOVIEMBRE' => '11', 'DICIEMBRE' => '12'
        ];
        
        // Para formato "2025-04-25" (ya normalizado)
        if (preg_match('/(\d{4})-(\d{2})-(\d{2})/', $dateStr)) {
            return $dateStr;
        }
        
        // Para formato "25-04-2025" o "25/04/2025"
        if (preg_match('/(\d{1,2})[-\/](\d{1,2})[-\/](\d{2,4})/', $dateStr, $matches)) {
            $day = sprintf('%02d', $matches[1]);
            $month = sprintf('%02d', $matches[2]);
            $year = strlen($matches[3]) === 2 ? '20'.$matches[3] : $matches[3];
            return "$day-$month-$year";
        }
        
        // Para formato "25-ABRIL-2025"
        if (preg_match('/(\d{1,2})-([A-Z]+)-(\d{4})/i', $dateStr, $matches)) {
            $month = strtoupper($matches[2]);
            if (isset($spanishMonths[$month])) {
                return sprintf('%02d-%s-%s', $matches[1], $spanishMonths[$month], $matches[3]);
            }
        }
        
        return $dateStr;
    }

    protected function calculateConfidence($text)
    {
        $confidence = 60; // Base más conservadora
        
        // Verificaciones específicas para recibos UMSS
        if (preg_match('/UNIVERSIDAD MAYOR DE SAN SIMON/i', $text)) $confidence += 15;
        if (preg_match('/RECIBO/i', $text)) $confidence += 10;
        if (preg_match('/N\s*rcx\s*\d+/i', $text)) $confidence += 10;
        if (preg_match('/Fecha\s*de\s*pago/i', $text)) $confidence += 10;
        if (preg_match('/N\s*ombre/i', $text)) $confidence += 5;
        if (preg_match('/TOTAL/i', $text)) $confidence += 5;
        if (preg_match('/Cajero/i', $text)) $confidence += 5;
        
        return min($confidence, 100) . '%';
    }

    protected function logExtractedText($text)
    {
        $dir = storage_path('logs/ocr/');
        
        if (!file_exists($dir)) {
            mkdir($dir, 0755, true);
        }

        $logPath = $dir . date('Y-m-d') . '.log';
        
        $logEntry = [
            'timestamp' => now()->toDateTimeString(),
            'raw_text' => $text,
            'separator' => str_repeat('=', 50)
        ];

        file_put_contents($logPath, 
            "===== OCR RESULT " . $logEntry['timestamp'] . " =====\n" . 
            $text . "\n" . 
            $logEntry['separator'] . "\n\n", 
            FILE_APPEND
        );
    }

    protected function cleanMontoFormat($amount)
    {
        if (empty($amount)) {
            return '';
        }
        
        // Convertir a string si no lo es
        $cleanAmount = (string) $amount;
        
        // Remover todos los espacios
        $cleanAmount = preg_replace('/\s+/', '', $cleanAmount);
        
        // Reemplazar comas por puntos para decimales
        $cleanAmount = str_replace(',', '.', $cleanAmount);
        
        // Remover caracteres no numéricos excepto el punto decimal
        $cleanAmount = preg_replace('/[^0-9.]/', '', $cleanAmount);
        
        // Asegurar que solo hay un punto decimal
        $parts = explode('.', $cleanAmount);
        if (count($parts) > 2) {
            // Si hay múltiples puntos, mantener solo el último como decimal
            $integer = implode('', array_slice($parts, 0, -1));
            $decimal = end($parts);
            $cleanAmount = $integer . '.' . $decimal;
        }
        
        // Validar que es un número válido
        if (!is_numeric($cleanAmount)) {
            return '';
        }
        
        // Formatear a 2 decimales
        $finalAmount = number_format(floatval($cleanAmount), 2, '.', '');
        
        return $finalAmount;
    }
}
