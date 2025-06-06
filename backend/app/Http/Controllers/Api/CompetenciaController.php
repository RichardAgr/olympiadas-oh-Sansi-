<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Exception;
use App\Models\Competencia;

class CompetenciaController extends Controller{
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

       public function cambiarEstado(Request $request, $id): JsonResponse
    {
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

}
