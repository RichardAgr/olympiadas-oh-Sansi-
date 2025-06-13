<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Exception;
use App\Models\Competencia;

class CompetenciaController extends Controller{
     public function getCompetenciaActiva(){
        try {
            // Obtener todas las competencias activas
            $competencias = Competencia::where('estado', 1)->get(); // Asegúrate de usar el modelo correcto

            if ($competencias->isEmpty()) {
                return response()->json([
                    'message' => 'No hay competencias activas en este momento.',
                    'data' => []
                ], 404);
            }

            $competenciasFormateadas = $competencias->map(function ($competencia) {
                    return [
                        'competencia_id' => $competencia->competencia_id,
                        'nombre_competencia' => $competencia->nombre_competencia,
                        'descripcion' => $competencia->descripcion,
                        'fecha_inicio' => $competencia->fecha_inicio->format('Y-m-d'),
                        'fecha_fin' => $competencia->fecha_fin->format('Y-m-d'),
                        'anio_competencia' => $competencia->fecha_inicio->format('Y'),
                        'estado' => $competencia->estado,
                        'created_at' => $competencia->created_at->format('Y-m-d'),
                        'updated_at' => $competencia->updated_at->format('Y-m-d'),
                    ];
            });


            return response()->json([
                'message' => 'Competencias activas encontradas.',
                'data' => $competenciasFormateadas
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Ocurrió un error al obtener la competencia activa.',
                'error' => $e->getMessage()
            ], 500);
        }
}
    public function ObtenerCompetencias(): JsonResponse
    {
        try {
        $competencias = Competencia::select(
                'competencia_id',
                'nombre_competencia',
                'descripcion',
                'fecha_inicio',
                'fecha_fin',
                'estado'
            )->get();

        $competenciasFormateadas = $competencias->map(function ($competencia) {
            return [
                'competencia_id' => $competencia->competencia_id,
                'nombre_competencia' => $competencia->nombre_competencia,
                'descripcion' => $competencia->descripcion,
                'fecha_inicio' => $competencia->fecha_inicio ? $competencia->fecha_inicio->format('Y-m-d') : null,
                'fecha_fin' => $competencia->fecha_fin ? $competencia->fecha_fin->format('Y-m-d') : null,
                'estado' => (bool) $competencia->estado,
            ];
        });

        return response()->json([
            'success' => true,
            'message' => 'Competencias obtenidas exitosamente',
            'data' => $competenciasFormateadas,
            'total' => $competenciasFormateadas->count()
        ], 200);

    } catch (Exception $e) {
        Log::error('Error al obtener competencias: ' . $e->getMessage(), [
            'file' => $e->getFile(),
            'line' => $e->getLine(),
            'trace' => $e->getTraceAsString()
        ]);

        return response()->json([
            'success' => false,
            'message' => 'Error interno del servidor al obtener las competencias',
            'error' => config('app.debug') ? $e->getMessage() : 'Error interno del servidor'
        ], 500);
    }
    }

       public function cambiarEstado(Request $request, $id): JsonResponse{
        try {
            $request->validate([
                'estado' => 'required|boolean'
            ]);

            $competencia = Competencia::find($id);

            if (!$competencia) {
                return response()->json([
                    'success' => false,
                    'message' => 'Competencia no encontrada',
                    'data' => null
                ], 404);
            }

            $estadoAnterior = $competencia->estado;
            $nuevoEstado = $request->input('estado');

            $competencia->estado = $nuevoEstado;
            $competencia->save();

            $mensaje = $nuevoEstado ? 'Competencia activada exitosamente' : 'Competencia desactivada exitosamente';

            return response()->json([
                'success' => true,
                'message' => $mensaje,
                'data' => [
                    'competencia_id' => $competencia->competencia_id,
                    'nombre_competencia' => $competencia->nombre_competencia,
                    'estado_anterior' => (bool) $estadoAnterior,
                    'estado_actual' => (bool) $competencia->estado,
                    'fecha_actualizacion' => now()->format('Y-m-d H:i:s')
                ]
            ], 200);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error de validación',
                'errors' => $e->errors()
            ], 422);

        } catch (Exception $e) {
            Log::error('Error al cambiar estado de competencia: ' . $e->getMessage(), [
                'competencia_id' => $id,
                'estado_solicitado' => $request->input('estado'),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error interno del servidor al cambiar el estado de la competencia',
                'error' => config('app.debug') ? $e->getMessage() : 'Error interno del servidor'
            ], 500);
        }
    }

    public function ActualizarCompetencia(Request $request, $id): JsonResponse{
        try {
            // Buscar la competencia
            $competencia = Competencia::find($id);

            if (!$competencia) {
                return response()->json([
                    'success' => false,
                    'message' => 'Competencia no encontrada',
                    'data' => null
                ], 404);
            }

            // Validar los datos de entrada
            $request->validate([
                'nombre_competencia' => 'required|string|max:50',
                'descripcion' => 'required|string',
                'fecha_inicio' => 'required|date',
                'fecha_fin' => 'required|date|after:fecha_inicio',
                'estado' => 'required|boolean',
            ]);

            // Verificar si hay inscripciones activas antes de permitir ciertos cambios
            $inscripcionesActivas = $competencia->inscripciones()->count();
        
            if ($inscripcionesActivas > 0) {
                // Si hay inscripciones, no permitir cambiar fechas que ya pasaron
                $fechaInicioNueva = \Carbon\Carbon::parse($request->input('fecha_inicio'));
                $fechaFinNueva = \Carbon\Carbon::parse($request->input('fecha_fin'));
            
                if ($fechaInicioNueva->isPast() && $fechaInicioNueva->format('Y-m-d') !== $competencia->fecha_inicio->format('Y-m-d')) {
                    return response()->json([
                        'success' => false,
                        'message' => 'No se puede cambiar la fecha de inicio a una fecha pasada cuando hay inscripciones activas',
                        'data' => [
                            'total_inscripciones' => $inscripcionesActivas
                        ]
                    ], 400);
                }
            }

            // Guardar datos anteriores para el log
            $datosAnteriores = [
                'nombre_competencia' => $competencia->nombre_competencia,
                'descripcion' => $competencia->descripcion,
                'fecha_inicio' => $competencia->fecha_inicio ? $competencia->fecha_inicio->format('Y-m-d') : null,
                'fecha_fin' => $competencia->fecha_fin ? $competencia->fecha_fin->format('Y-m-d') : null,
                'estado' => (bool) $competencia->estado,
            ];

            // Actualizar los campos
            $competencia->nombre_competencia = $request->input('nombre_competencia');
            $competencia->descripcion = $request->input('descripcion');
            $competencia->fecha_inicio = $request->input('fecha_inicio');
            $competencia->fecha_fin = $request->input('fecha_fin');
            $competencia->estado = $request->input('estado');
        
            $competencia->save();


            $competenciaFormateada = [
                'competencia_id' => $competencia->competencia_id,
                'nombre_competencia' => $competencia->nombre_competencia,
                'descripcion' => $competencia->descripcion,
                'fecha_inicio' => $competencia->fecha_inicio ? $competencia->fecha_inicio->format('Y-m-d') : null,
                'fecha_fin' => $competencia->fecha_fin ? $competencia->fecha_fin->format('Y-m-d') : null,
                'estado' => (bool) $competencia->estado,
                'fecha_actualizacion' => now()->format('Y-m-d H:i:s'),
                'datos_anteriores' => $datosAnteriores
            ];

            return response()->json([
                'success' => true,
                'message' => 'Competencia actualizada exitosamente',
                'data' => $competenciaFormateada
            ], 200);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error de validación',
                'errors' => $e->errors()
            ], 422);

        } catch (Exception $e) {
            Log::error('Error al actualizar competencia: ' . $e->getMessage(), [
                'competencia_id' => $id,
                'datos_enviados' => $request->all(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error interno del servidor al actualizar la competencia',
                'error' => config('app.debug') ? $e->getMessage() : 'Error interno del servidor'
            ], 500);
        }
    }

    public function CrearCompetencia(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'nombre_competencia' => 'required|string|max:50',
                'descripcion' => 'required|string',
                'fecha_inicio' => 'required|date|after_or_equal:today',
                'fecha_fin' => 'required|date|after:fecha_inicio',
                'estado' => 'required|boolean',
            ]);

            $competencia = new Competencia();
            $competencia->nombre_competencia = $request->input('nombre_competencia');
            $competencia->descripcion = $request->input('descripcion');
            $competencia->fecha_inicio = $request->input('fecha_inicio');
            $competencia->fecha_fin = $request->input('fecha_fin');
            $competencia->estado = $request->input('estado');
        
            $competencia->save();


            $competenciaFormateada = [
                'competencia_id' => $competencia->competencia_id,
                'nombre_competencia' => $competencia->nombre_competencia,
                'descripcion' => $competencia->descripcion,
                'fecha_inicio' => $competencia->fecha_inicio ? $competencia->fecha_inicio->format('Y-m-d') : null,
                'fecha_fin' => $competencia->fecha_fin ? $competencia->fecha_fin->format('Y-m-d') : null,
                'estado' => (bool) $competencia->estado,
                'fecha_creacion' => now()->format('Y-m-d H:i:s')
            ];

            return response()->json([
                'success' => true,
                'message' => 'Competencia creada exitosamente',
                'data' => $competenciaFormateada
            ], 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error de validación',
                'errors' => $e->errors()
            ], 422);

        } catch (Exception $e) {
            Log::error('Error al crear competencia: ' . $e->getMessage(), [
                'datos_enviados' => $request->all(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error interno del servidor al crear la competencia',
                'error' => config('app.debug') ? $e->getMessage() : 'Error interno del servidor'
            ], 500);
        }
    }

    public function EliminarCompetencia($id): JsonResponse
    {
        try {
            $competencia = Competencia::find($id);

            if (!$competencia) {
                return response()->json([
                    'success' => false,
                    'message' => 'Competencia no encontrada',
                    'data' => null
                ], 404);
            }

            // Verificar si hay inscripciones antes de eliminar
            $inscripcionesActivas = $competencia->inscripciones()->count();
        
            if ($inscripcionesActivas > 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'No se puede eliminar la competencia porque tiene inscripciones activas',
                    'data' => [
                        'competencia_id' => $competencia->competencia_id,
                        'nombre_competencia' => $competencia->nombre_competencia,
                        'total_inscripciones' => $inscripcionesActivas
                    ]
                ], 400);
        }

        // Verificar si hay cronogramas asociados
        $cronogramas = $competencia->cronograma()->count();
        
        if ($cronogramas > 0) {
            return response()->json([
                'success' => false,
                'message' => 'No se puede eliminar la competencia porque tiene cronogramas asociados',
                'data' => [
                    'competencia_id' => $competencia->competencia_id,
                    'nombre_competencia' => $competencia->nombre_competencia,
                    'total_cronogramas' => $cronogramas
                ]
            ], 400);
        }

        $nombreCompetencia = $competencia->nombre_competencia;
        $competenciaId = $competencia->competencia_id;

        // Eliminar la competencia
        $competencia->delete();

        return response()->json([
            'success' => true,
            'message' => 'Competencia eliminada exitosamente',
            'data' => [
                'competencia_id' => $competenciaId,
                'nombre_competencia' => $nombreCompetencia,
                'fecha_eliminacion' => now()->format('Y-m-d H:i:s')
            ]
        ], 200);

    } catch (Exception $e) {
        Log::error('Error al eliminar competencia: ' . $e->getMessage(), [
            'competencia_id' => $id,
            'file' => $e->getFile(),
            'line' => $e->getLine(),
            'trace' => $e->getTraceAsString()
        ]);

        return response()->json([
            'success' => false,
            'message' => 'Error interno del servidor al eliminar la competencia',
            'error' => config('app.debug') ? $e->getMessage() : 'Error interno del servidor'
        ], 500);
    }
}

}
