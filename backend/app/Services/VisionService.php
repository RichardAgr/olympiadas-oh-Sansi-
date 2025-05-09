<?php

namespace App\Services;

use Google\Cloud\Vision\V1\ImageAnnotatorClient;
use Google\Cloud\Vision\V1\Feature\Type;
use Google\Cloud\Vision\V1\Image;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;

class VisionService
{
    protected $client;

    /**
     * Constructor que recibe una instancia de ImageAnnotatorClient
     * Esta instancia se inyecta automáticamente gracias al Service Container de Laravel
     */
    public function __construct(ImageAnnotatorClient $client)
    {
        $this->client = $client;
    }

    /**
     * Procesa una imagen y extrae texto usando OCR
     *
     * @param UploadedFile|string $image
     * @return array
     */
    public function detectText($image)
    {
        try {
            // Obtener contenido de la imagen
            // Si es un objeto UploadedFile (de un formulario), obtenemos el path
            // Si es una ruta de archivo, leemos directamente el contenido
            if ($image instanceof UploadedFile) {
                $imageContent = file_get_contents($image->path());
            } else {
                $imageContent = file_get_contents($image);
            }

            // Crear objeto de imagen para Google Cloud Vision
            $visionImage = new Image();
            $visionImage->setContent($imageContent);

            // Realizar detección de texto
            // Esto envía la imagen a la API de Google Cloud Vision
            $response = $this->client->textDetection($visionImage);
            $texts = $response->getTextAnnotations();

            // Verificar si se encontró texto
            if (empty($texts)) {
                return [
                    'success' => false,
                    'message' => 'No se pudo detectar texto en la imagen',
                    'data' => null
                ];
            }

            // El primer elemento contiene todo el texto
            $fullText = $texts[0]->getDescription();

            // Extraer datos específicos usando el método extractPaymentData
            $extractedData = $this->extractPaymentData($fullText);

            // Devolver resultado exitoso
            return [
                'success' => true,
                'message' => 'Texto extraído correctamente',
                'data' => $extractedData,
                'fullText' => $fullText // Útil para depuración
            ];
        } catch (\Exception $e) {
            // Registrar el error en los logs
            Log::error('Error en OCR: ' . $e->getMessage());
            
            // Devolver error
            return [
                'success' => false,
                'message' => 'Error al procesar la imagen: ' . $e->getMessage(),
                'data' => null
            ];
        } finally {
            // Cerrar el cliente para liberar recursos
            // Esto es importante para evitar fugas de memoria
            $this->client->close();
        }
    }

    /**
     * Extrae datos específicos del texto completo
     * Busca patrones para encontrar número de comprobante, nombre, monto y fecha
     *
     * @param string $text
     * @return array
     */
    protected function extractPaymentData($text)
    {
        // Inicializar datos
        $data = [
            'numeroComprobante' => null,
            'nombreCompleto' => null,
            'montoPagado' => null,
            'fechaPago' => null,
        ];

        // Buscar número de comprobante (patrones comunes)
        if (preg_match('/(?:comprobante|recibo|factura)[^\d]*(\d{5,10})/i', $text, $matches)) {
            // Busca texto como "Comprobante: 12345" o "Recibo Nro 12345"
            $data['numeroComprobante'] = $matches[1];
        } elseif (preg_match('/N[º°]?\s*(?:comprobante|recibo|factura)[^\d]*(\d{5,10})/i', $text, $matches)) {
            // Busca texto como "N° Comprobante: 12345"
            $data['numeroComprobante'] = $matches[1];
        } elseif (preg_match('/(?:\b|#)(\d{5,10})(?:\b|$)/', $text, $matches)) {
            // Buscar números de 5-10 dígitos que podrían ser comprobantes
            $data['numeroComprobante'] = $matches[1];
        }

        // Buscar nombre completo (patrones comunes)
        if (preg_match('/(?:nombre|cliente|pagador|titular)[\s:]*([A-ZÁ-ÚÑ\s]{10,50})\b/i', $text, $matches)) {
            // Busca texto como "Nombre: JUAN PEREZ" o "Cliente: MARIA RODRIGUEZ"
            $data['nombreCompleto'] = trim($matches[1]);
        } elseif (preg_match('/(?:sr\.|sra\.|señor|señora)[\s:]*([A-ZÁ-ÚÑ\s]{10,50})\b/i', $text, $matches)) {
            // Busca texto como "Sr. JUAN PEREZ" o "Señora MARIA RODRIGUEZ"
            $data['nombreCompleto'] = trim($matches[1]);
        }

        // Buscar monto pagado (patrones comunes)
        if (preg_match('/(?:total|monto|importe|pago)[^\d]*(?:BS\.?|BOB|Bs\.?)?[\s:]*(\d+[.,]\d{2}|\d+)/i', $text, $matches)) {
            // Busca texto como "Total: BS. 123.45" o "Monto: 500"
            $data['montoPagado'] = str_replace(',', '.', $matches[1]);
        } elseif (preg_match('/(?:BS\.?|BOB|Bs\.?)[\s:]*(\d+[.,]\d{2}|\d+)/i', $text, $matches)) {
            // Busca texto como "BS. 123.45" o "Bs 500"
            $data['montoPagado'] = str_replace(',', '.', $matches[1]);
        }

        // Buscar fecha de pago (patrones comunes)
        if (preg_match('/(?:fecha|date)[^\d]*(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})/i', $text, $matches)) {
            // Busca texto como "Fecha: 01/01/2023" o "Date: 01-01-2023"
            $data['fechaPago'] = $matches[1];
        } elseif (preg_match('/(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})/', $text, $matches)) {
            // Busca cualquier fecha en formato DD/MM/YYYY o similar
            $data['fechaPago'] = $matches[1];
        }

        return $data;
    }
}