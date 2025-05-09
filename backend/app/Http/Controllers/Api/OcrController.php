<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\VisionService;
use Google\Cloud\Vision\V1\ImageAnnotatorClient;
use Illuminate\Http\Request;

class OcrController extends Controller{
    public function extractText(Request $request)
    {
        try {
            // Validar la solicitud
            $request->validate([
                'image' => 'required|image|max:5000', // máximo 5MB
            ]);

            // Obtener la imagen
            $image = $request->file('image');
            $imageContent = file_get_contents($image->getPathname());

            // Configurar la ruta de las credenciales
            putenv('GOOGLE_APPLICATION_CREDENTIALS=' . env('GOOGLE_APPLICATION_CREDENTIALS'));

            // Inicializar el cliente de Vision
            $imageAnnotator = new ImageAnnotatorClient();

            // Realizar la detección de texto
            $response = $imageAnnotator->textDetection($imageContent);
            $texts = $response->getTextAnnotations();

            // Cerrar el cliente
            $imageAnnotator->close();

            // Extraer el texto completo (el primer elemento contiene todo el texto)
            $extractedText = '';
            if (count($texts) > 0) {
                $extractedText = $texts[0]->getDescription();
            }

            // Devolver el texto extraído
            return response()->json([
                'success' => true,
                'text' => $extractedText
            ]);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
