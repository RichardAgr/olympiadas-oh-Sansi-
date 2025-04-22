<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Competidor;
use App\Models\CompetidorCompetencia;
use App\Models\Area;
use Illuminate\Http\Request;

class CompetidorController extends Controller{
    public function index(Request $request){
        $competidores = Competidor::select('competidor_id', 'nombres', 'apellidos', 'estado')
            ->get();

        $data = [];

        foreach ($competidores as $competidor) {
            $areas = CompetidorCompetencia::where('competidor_id', $competidor->competidor_id)
                ->join('area', 'competidor_competencia.area_id', '=', 'area.area_id')
                ->pluck('area.nombre')
                ->unique()
                ->implode(', ');

            $data[] = [
                'competidor_id' => $competidor->competidor_id,
                'nombre_completo' => $competidor->nombres . ' ' . $competidor->apellidos,
                'area_competencia' => $areas ?: 'No asignada',
                'estado' => $competidor->estado
            ];
        }

        return response()->json(['data' => $data]);
    }
}
