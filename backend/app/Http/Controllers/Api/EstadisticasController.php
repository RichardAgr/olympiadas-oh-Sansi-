<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Boleta;
use App\Models\Competencia;
use App\Models\Competidor;
use App\Models\Area;
use App\Models\CompetidorCompetencia;
use App\Models\Tutor;
use Illuminate\Support\Facades\DB;

class EstadisticasController extends Controller{
    public function obtenerEstadisticasGenerales($competenciaId){
        try {
        $competencia = Competencia::find($competenciaId);
        if (!$competencia) {
            return response()->json([
                'success' => false,
                'message' => 'Competencia no encontrada'
            ], 404);
        }
        $tutorIds = Tutor::where('competencia_id', $competenciaId)->pluck('tutor_id');
        
        $totalPagos = Boleta::whereIn('tutor_id', $tutorIds)
            ->where('estado', true)
            ->sum('monto_total');

        $totalAreasActivas = Area::where('competencia_id', $competenciaId)
            ->where('estado', true)
            ->count();

        $totalCompetidoresHabilitados = Competidor::where('estado', 'Habilitado')
            ->whereHas('competencias', function ($query) use ($competenciaId) {
                $query->where('competidor_competencia.competencia_id', $competenciaId);
            })
            ->count();

        $totalInscripciones = CompetidorCompetencia::where('competencia_id', $competenciaId)
            ->count();

        $totalTutores = Tutor::where('competencia_id', $competenciaId)
            ->count();

        $estadisticas = [
            'totalPagos' => $totalPagos,
            'competenciasActivas' => $totalAreasActivas,
            'competidoresHabilitados' => $totalCompetidoresHabilitados,
            'totalInscripciones' => $totalInscripciones,
            'totalTutores' => $totalTutores,
            'competencia' => [
                'id' => $competencia->competencia_id,
                'nombre' => $competencia->nombre_competencia,
                'fecha_inicio' => $competencia->fecha_inicio,
                'fecha_fin' => $competencia->fecha_fin,
                'estado' => $competencia->estado ? 'Activa' : 'Inactiva'
            ]
        ];

        return response()->json([
            'success' => true,
            'data' => $estadisticas
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Error al obtener las estadísticas de la competencia',
            'error' => $e->getMessage()
        ], 500);
    }
    }
}
