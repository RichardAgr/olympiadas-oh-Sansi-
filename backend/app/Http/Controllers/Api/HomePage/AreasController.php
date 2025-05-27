<?php

namespace App\Http\Controllers\Api\HomePage;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Area; 
use App\Models\DocumentoArea;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\JsonResponse;


class AreasController extends Controller{
    public function obtenerDocumentacionPorArea($areaId): JsonResponse{
        try {
            if (!is_numeric($areaId) || $areaId <= 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'El ID del área debe ser un número válido mayor a 0',
                    'url_pdf' => null
                ], 200); 
            }

            // Verificar si el área existe
            $area = Area::where('area_id', $areaId)
                ->where('estado', true)
                ->first();

            if (!$area) {
                return response()->json([
                    'success' => false,
                    'message' => 'El área especificada no existe o está inactiva',
                    'url_pdf' => null
                ], 200); // ✅ Cambiado a 200
            }

            $documentacion = DocumentoArea::where('area_id', $areaId)
                ->where('estado', true) 
                ->whereNotNull('url_pdf') 
                ->where('url_pdf', '!=', '') 
                ->orderBy('fecha_creacion', 'desc')
                ->first();

            if ($documentacion && !empty(trim($documentacion->url_pdf))) {
                return response()->json([
                    'success' => true,
                    'message' => 'Documentación encontrada exitosamente',
                    'url_pdf' => trim($documentacion->url_pdf),
                    'fecha_creacion' => $documentacion->fecha_creacion,
                    'documento_id' => $documentacion->documento_area_id,
                    'area_nombre' => $area->nombre
                ], 200);
            }

            return response()->json([
                'success' => false,
                'message' => 'El área no tiene documentación PDF disponible',
                'url_pdf' => null,
                'area_nombre' => $area->nombre
            ], 200); // ✅ Cambiado a 200

        } catch (\Exception $e) {
            Log::error('Error al obtener documentación del área', [
                'area_id' => $areaId,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error interno del servidor al procesar la solicitud',
                'url_pdf' => null
            ], 200);
        }
    }
}
