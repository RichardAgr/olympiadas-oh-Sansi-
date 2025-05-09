<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Google\Cloud\Vision\V1\ImageAnnotatorClient;
use Google\Cloud\Vision\V1\Feature\Type;
use Illuminate\Support\Facades\Log;
use Exception;
use Illuminate\Http\Request;

class BoletaPagoController extends Controller{
    public function procesarComprobante(Request $request)
    {
        try {
            // Validar la solicitud
            $request->validate([
                'image' => 'required|image|max:5000', // máximo 5MB
            ]);

            // Obtener la imagen
            $image = $request->file('image');
            $imageContent = file_get_contents($image->getPathname());

            // Configurar la ruta a las credenciales usando storage_path()
            $credentialsPath = storage_path('app\\googleCredentials\\proyectoveltrix-2ee3a494c5b0.json');
            
            // Verificar que el archivo existe
            if (!file_exists($credentialsPath)) {
                throw new Exception("El archivo de credenciales no existe en: $credentialsPath");
            }
            
            // Registrar información para depuración
            Log::info("Usando archivo de credenciales: $credentialsPath");
            Log::info("El archivo existe: " . (file_exists($credentialsPath) ? 'Sí' : 'No'));
            
            // Establecer la variable de entorno
            putenv('GOOGLE_APPLICATION_CREDENTIALS=' . $credentialsPath);
            
            // Inicializar el cliente con opciones explícitas
            $imageAnnotator = new ImageAnnotatorClient([
                'credentials' => $credentialsPath
            ]);

            // Realizar la detección de texto
            $response = $imageAnnotator->textDetection($imageContent);
            $texts = $response->getTextAnnotations();
            
            // Cerrar el cliente para liberar recursos
            $imageAnnotator->close();

            // Extraer el texto completo (el primer elemento contiene todo el texto)
            $extractedText = '';
            if (count($texts) > 0) {
                $extractedText = $texts[0]->getDescription();
            }

            // Si no se extrajo texto, devolver error
            if (empty($extractedText)) {
                return response()->json([
                    'success' => false,
                    'error' => 'No se pudo extraer texto de la imagen'
                ], 400);
            }

            // Procesar el texto para extraer los datos específicos
            $datos = $this->extraerDatosComprobante($extractedText);

            // Devolver los datos extraídos
            return response()->json([
                'success' => true,
                'datos' => $datos,
                'texto_completo' => $extractedText // Útil para depuración
            ]);

        } catch (Exception $e) {
            Log::error('Error en procesamiento de comprobante: ' . $e->getMessage());
            Log::error($e->getTraceAsString());
            
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    private function extraerDatosComprobante($texto)
    {
        // Inicializar array de datos
        $datos = [
            'numeroComprobante' => '',
            'nombreCompleto' => '',
            'montoPagado' => '',
            'fechaPago' => ''
        ];

        // Convertir el texto a líneas para procesarlo más fácilmente
        $lineas = explode("\n", $texto);

        // Patrones para buscar cada dato
        $patronesNumero = [
            '/(?:comprobante|recibo|factura|ticket)(?:\s+(?:n[°º]|num|numero|número))?(?:\s*[:.-])?\s*([A-Z0-9]{5,15})/i',
            '/(?:n[°º]|num|numero|número)(?:\s+(?:de)?(?:\s+(?:comprobante|recibo|factura|ticket)))?(?:\s*[:.-])?\s*([A-Z0-9]{5,15})/i',
            '/([A-Z0-9]{5,15})/'
        ];

        $patronesNombre = [
            '/(?:cliente|nombre|pagador|titular|a nombre de|recibido de)(?:\s*[:.-])?\s*([A-ZÁÉÍÓÚÜÑa-záéíóúüñ\s]{5,60})/i',
            '/(?:señor|sr|sra|srta)(?:\.|\s)([A-ZÁÉÍÓÚÜÑa-záéíóúüñ\s]{5,60})/i'
        ];

        $patronesMonto = [
            '/(?:monto|total|importe|valor|suma)(?:\s*(?:pagado|abonado|cancelado))?(?:\s*[:.-])?\s*(?:bs\.?|bolivianos|\$)?\s*([0-9.,]{1,10})/i',
            '/(?:bs\.?|bolivianos|\$)\s*([0-9.,]{1,10})/i'
        ];

        $patronesFecha = [
            '/(?:fecha|date)(?:\s*(?:de)?(?:\s*(?:pago|emisión|emision|expedición|expedicion)))?(?:\s*[:.-])?\s*([0-9]{1,2}[-\/\.][0-9]{1,2}[-\/\.][0-9]{2,4})/i',
            '/([0-9]{1,2}[-\/\.][0-9]{1,2}[-\/\.][0-9]{2,4})/'
        ];

        // Buscar número de comprobante
        foreach ($lineas as $linea) {
            foreach ($patronesNumero as $patron) {
                if (preg_match($patron, $linea, $matches)) {
                    $datos['numeroComprobante'] = trim($matches[1]);
                    break 2; // Salir de ambos bucles
                }
            }
        }

        // Buscar nombre completo
        foreach ($lineas as $linea) {
            foreach ($patronesNombre as $patron) {
                if (preg_match($patron, $linea, $matches)) {
                    $datos['nombreCompleto'] = trim($matches[1]);
                    break 2;
                }
            }
        }

        // Si no se encontró el nombre con los patrones, buscar líneas que parezcan nombres
        if (empty($datos['nombreCompleto'])) {
            foreach ($lineas as $linea) {
                // Buscar líneas que tengan al menos 2 palabras, todas empezando con mayúscula
                if (preg_match('/^([A-ZÁÉÍÓÚÜÑ][a-záéíóúüñ]+\s+){1,}[A-ZÁÉÍÓÚÜÑ][a-záéíóúüñ]+$/', $linea)) {
                    $datos['nombreCompleto'] = trim($linea);
                    break;
                }
            }
        }

        // Buscar monto pagado
        foreach ($lineas as $linea) {
            foreach ($patronesMonto as $patron) {
                if (preg_match($patron, $linea, $matches)) {
                    $datos['montoPagado'] = trim($matches[1]);
                    break 2;
                }
            }
        }

        // Buscar fecha de pago
        foreach ($lineas as $linea) {
            foreach ($patronesFecha as $patron) {
                if (preg_match($patron, $linea, $matches)) {
                    $datos['fechaPago'] = trim($matches[1]);
                    break 2;
                }
            }
        }

        // Limpiar y formatear los datos
        $datos = $this->limpiarDatos($datos);

        return $datos;
    }

    private function limpiarDatos($datos)
    {
        // Limpiar número de comprobante (solo alfanuméricos)
        $datos['numeroComprobante'] = preg_replace('/[^A-Z0-9]/i', '', $datos['numeroComprobante']);

        // Limpiar nombre (eliminar múltiples espacios y caracteres extraños)
        $datos['nombreCompleto'] = preg_replace('/\s+/', ' ', $datos['nombreCompleto']);
        $datos['nombreCompleto'] = trim($datos['nombreCompleto']);

        // Limpiar monto (dejar solo números y punto decimal)
        $monto = preg_replace('/[^0-9.,]/', '', $datos['montoPagado']);
        // Convertir comas a puntos si es necesario
        $monto = str_replace(',', '.', $monto);
        $datos['montoPagado'] = $monto;

        // Normalizar formato de fecha (DD/MM/YYYY)
        if (!empty($datos['fechaPago'])) {
            $fecha = $datos['fechaPago'];
            // Reemplazar guiones y puntos por barras
            $fecha = str_replace(['-', '.'], '/', $fecha);
            
            // Intentar convertir a formato estándar
            $partes = explode('/', $fecha);
            if (count($partes) === 3) {
                // Si el año tiene 2 dígitos, convertir a 4 dígitos
                if (strlen($partes[2]) === 2) {
                    $partes[2] = '20' . $partes[2]; // Asumimos años 2000+
                }
                
                // Asegurarse de que día y mes tengan 2 dígitos
                $partes[0] = str_pad($partes[0], 2, '0', STR_PAD_LEFT);
                $partes[1] = str_pad($partes[1], 2, '0', STR_PAD_LEFT);
                
                $datos['fechaPago'] = implode('/', $partes);
            }
        }

        return $datos;
    }
}
