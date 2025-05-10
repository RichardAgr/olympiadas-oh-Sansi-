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

    public function processReceipt($imagePath){
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
                'OCREngine' => 2,
                'filetype' => strtoupper(pathinfo($imagePath, PATHINFO_EXTENSION)),
                'isCreateSearchablePdf' => 'false',
                'isSearchablePdfHideTextLayer' => 'false',
            ];

            Log::debug('Enviando solicitud a OCR.space', ['payload_size' => strlen($base64Image)]);

            // Envío de la solicitud
            $response = Http::timeout(90)/* $this->timeout  estoy haciendo que la duracion sea de 1:30 minutos con 3 intentos*/ 
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

   protected function extractReceiptData($text){
    $data = [
        'success' => true,
        'numero_comprobante' => '',
        'nombre_pagador' => '',
        'monto_total' => '',
        'fecha_pago' => '',
/*         'texto_resumen' => substr($text, 0, 200).(strlen($text) > 200 ? '...' : '') */
    ];

    // Número de comprobante
    if (preg_match('/N(?:ro|°|umero)?[\s:\.]*(\d{5,10})/i', $text, $matches)) {
        $data['numero_comprobante'] = $matches[1];
    }

    // Nombre del pagador
    if (preg_match('/(?:Estudiante|Cliente|Nombre|Pagador)[\s:]*([^\r\n]+)/i', $text, $matches)) {
        $data['nombre_pagador'] = trim(preg_replace('/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/u', '', $matches[1]));
    }

    // Fecha de pago 
    if (preg_match('/Fecha\s*de\s*pago:\s*(\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4})/i', $text, $matches)) {
        $data['fecha_pago'] = $this->normalizeDate($matches[1]);
    }
    // Patrón alternativo para fecha sin "Fecha de pago:"
    elseif (preg_match('/(\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4})(?=\s*(?:$|\r|\n|Periodo|Área|Nombre))/i', $text, $matches)) {
        $data['fecha_pago'] = $this->normalizeDate($matches[1]);
    }
    // Patrón para formato con mes en texto
    elseif (preg_match('/Fecha\s*de\s*pago:\s*(\d{1,2}-[A-Z]+-\d{4})/i', $text, $matches)) {
        $data['fecha_pago'] = $this->normalizeDate($matches[1]);
    }

    // Monto total
    if (preg_match('/(?:TOTAL|MONTO|IMPORTE|TOTAL\s*A\s*PAGAR)[\s:]*([$\s]*(\d+[.,]\d{2}))/i', $text, $matches)) {
        $data['monto_total'] = str_replace(',', '.', $matches[2]);
    } elseif (preg_match('/\b(\d+[.,]\d{2})(?=\s*Bs)/i', $text, $matches)) {
        $data['monto_total'] = str_replace(',', '.', $matches[1]);
    }

    return $data;
}

protected function normalizeDate($dateStr){
    // Convertir meses en español a formato numérico
    $spanishMonths = [
        'ENERO' => '01', 'FEBRERO' => '02', 'MARZO' => '03',
        'ABRIL' => '04', 'MAYO' => '05', 'JUNIO' => '06',
        'JULIO' => '07', 'AGOSTO' => '08', 'SEPTIEMBRE' => '09',
        'OCTUBRE' => '10', 'NOVIEMBRE' => '11', 'DICIEMBRE' => '12'
    ];
    
    // Para formato "24-04-2025" o "24/04/2025"
    if (preg_match('/(\d{1,2})[-\/](\d{1,2})[-\/](\d{2,4})/', $dateStr, $matches)) {
        $day = sprintf('%02d', $matches[1]);
        $month = sprintf('%02d', $matches[2]);
        $year = strlen($matches[3]) === 2 ? '20'.$matches[3] : $matches[3];
        return "$day-$month-$year";
    }
    
    // Para formato "24-ABRIL-2025"
    if (preg_match('/(\d{1,2})-([A-Z]+)-(\d{4})/i', $dateStr, $matches)) {
        $month = strtoupper($matches[2]);
        if (isset($spanishMonths[$month])) {
            return sprintf('%02d-%s-%s', $matches[1], $spanishMonths[$month], $matches[3]);
        }
    }
    
    return $dateStr; // Devolver original si no podemos normalizar
}


protected function logExtractedText($text){
    $dir = storage_path('logs/ocr/');
    
    // Verifica si la carpeta existe; si no, la crea
    if (!file_exists($dir)) {
        mkdir($dir, 0755, true); // para crear directorios recursivamente
    }

    $logPath = $dir . date('Y-m-d') . '.log';

    file_put_contents($logPath, "===== OCR RESULT =====\n" . $text . "\n\n", FILE_APPEND);
}

}