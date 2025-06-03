<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Area;
use App\Models\Competencia;
use App\Models\Cronograma;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;


class EventoController extends Controller{
    public function ObtenerCronogramasPorArea(int $areaId): JsonResponse
    {
        try {
            // Verificar si el área existe
            $area = Area::where('area_id', $areaId)->first();
            
            if (!$area) {
                return response()->json([
                    'error' => 'Área no encontrada'
                ], 404);
            }

            // Obtener todos los cronogramas del área
            $cronogramas = Cronograma::where('area_id', $areaId)
                ->select(
                    'cronograma_id',
                    'area_id',
                    'competencia_id',
                    'descripcion',
                    'fecha_inicio',
                    'fecha_fin',
                    'tipo_evento',
                    'anio_olimpiada',
                    'created_at',
                    'updated_at'
                )
                ->orderBy('tipo_evento')
                ->get();

            // Formatear la respuesta
            $cronogramasFormatted = $cronogramas->map(function ($cronograma) {
                return [
                    'cronograma_id' => $cronograma->cronograma_id,
                    'descripcion' => $cronograma->descripcion,
                    'fecha_inicio' => $cronograma->fecha_inicio ? $cronograma->fecha_inicio->format('Y-m-d') : null,
                    'fecha_fin' => $cronograma->fecha_fin ? $cronograma->fecha_fin->format('Y-m-d') : null,
                    'tipo_evento' => $cronograma->tipo_evento,
                    'anio_olimpiada' => (int) $cronograma->anio_olimpiada,
                ];
            });

            return response()->json([
                'nombre' => $area->nombre,
                'area_id' => $area->area_id,
                'costo' => $area-> costo,
                'cronogramas' => $cronogramasFormatted,
                'total_cronogramas' => $cronogramas->count()
            ], 200);

        } catch (Exception $e) {
            Log::error('Error al obtener cronogramas por área: ' . $e->getMessage(), [
                'area_id' => $areaId,
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ]);

            return response()->json([
                'error' => 'Error interno del servidor'
            ], 500);
        }
    }

    public function EditarCronograma(Request $request, int $areaId): JsonResponse{
        DB::beginTransaction();
        
        try {
            // Verificar si el área existe
            $area = Area::where('area_id', $areaId)->first();
            
            if (!$area) {
                DB::rollBack();
                return response()->json([
                    'error' => 'Área no encontrada'
                ], 404);
            }

            // Validar que se envíe un array de cronogramas
            $validated = $request->validate([
                'cronogramas' => 'required|array|size:3', // Exactamente 3 cronogramas
                'cronogramas.*.cronograma_id' => 'required|integer|exists:cronograma,cronograma_id',
                'cronogramas.*.descripcion' => 'sometimes|string|max:1000',
                'cronogramas.*.fecha_inicio' => 'sometimes|date|date_format:Y-m-d',
                'cronogramas.*.fecha_fin' => 'sometimes|date|date_format:Y-m-d',
                'cronogramas.*.tipo_evento' => 'sometimes|string|in:Inscripcion,Competencia,Fin',
                'cronogramas.*.anio_olimpiada' => 'sometimes|integer|min:0|max:9999'
            ]);

            $cronogramasActualizados = [];

            foreach ($validated['cronogramas'] as $cronogramaData) {
                $cronogramaId = $cronogramaData['cronograma_id'];
                unset($cronogramaData['cronograma_id']); // Remover el ID del array de datos a actualizar

                // Verificar que el cronograma pertenezca al área
                $cronograma = Cronograma::where('cronograma_id', $cronogramaId)
                    ->where('area_id', $areaId)
                    ->first();

                if (!$cronograma) {
                    DB::rollBack();
                    return response()->json([
                        'error' => "Cronograma con ID {$cronogramaId} no encontrado o no pertenece al área {$areaId}"
                    ], 404);
                }

                // Actualizar el cronograma
                $cronograma->update($cronogramaData);
                $cronogramasActualizados[] = $cronograma->fresh();
            }

            DB::commit();

            // Formatear la respuesta
            $cronogramasFormatted = collect($cronogramasActualizados)->map(function ($cronograma) {
                return [
                    'cronograma_id' => $cronograma->cronograma_id,
                    'area_id' => $cronograma->area_id,
                    'competencia_id' => $cronograma->competencia_id,
                    'descripcion' => $cronograma->descripcion,
                    'fecha_inicio' => $cronograma->fecha_inicio ? $cronograma->fecha_inicio->format('Y-m-d') : null,
                    'fecha_fin' => $cronograma->fecha_fin ? $cronograma->fecha_fin->format('Y-m-d') : null,
                    'tipo_evento' => $cronograma->tipo_evento,
                    'anio_olimpiada' => (int) $cronograma->anio_olimpiada,
                    'updated_at' => $cronograma->updated_at->toISOString()
                ];
            });

            return response()->json([
                'message' => 'Los 3 cronogramas del área actualizados exitosamente',
                'area' => [
                    'area_id' => $area->area_id,
                    'nombre' => $area->nombre
                ],
                'cronogramas' => $cronogramasFormatted
            ], 200);

        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            return response()->json([
                'error' => 'Datos de entrada inválidos',
                'details' => $e->errors()
            ], 422);

        } catch (Exception $e) {
            DB::rollBack();
            
            Log::error('Error al editar cronogramas del área: ' . $e->getMessage(), [
                'area_id' => $areaId,
                'request_data' => $request->all(),
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ]);

            return response()->json([
                'error' => 'Error interno del servidor'
            ], 500);
        }
    }
}
