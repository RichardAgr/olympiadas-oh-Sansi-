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
}
