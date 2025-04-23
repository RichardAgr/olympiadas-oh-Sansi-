<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Boleta;
use App\Models\Competencia;
use App\Models\Competidor;
use App\Models\Area;
use Illuminate\Support\Facades\DB;

class EstadisticasController extends Controller{
    public function obtenerEstadisticasGenerales()
    {
        try {
            // Obtener el total de pagos (suma de monto_total de todas las boletas)
            $totalPagos = Boleta::where('estado', true)
                ->sum('monto_total');

            // Obtener el total de competencias activas
            $totalCompetenciasActivas = Area::where('estado', true)
            ->count();

            // Obtener el total de competidores habilitados
            $totalCompetidoresHabilitados = Competidor::where('estado', 'Habilitado')
                ->count();

            // Construir la respuesta
            $estadisticas = [
                'totalPagos' => $totalPagos,
                'competenciasActivas' => $totalCompetenciasActivas,
                'competidoresHabilitados' => $totalCompetidoresHabilitados
            ];

            return response()->json([
                'success' => true,
                'data' => $estadisticas
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener las estadísticas',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
