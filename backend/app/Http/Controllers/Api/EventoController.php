<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Area;
use App\Models\Competencia;
use App\Models\Cronograma;

class EventoController extends Controller
{
    // GET all areas with fechas
    public function index()
    {
        $areas = Area::all();

        $data = $areas->map(function ($area) {
            $competencia = Competencia::where('area_id', $area->area_id)->first();
            $inscripcion = Cronograma::where('area_id', $area->area_id)->where('tipo_evento', 'inscripcion')->first();

            return [
                'id' => $area->area_id,
                'nombre' => $area->nombre,
                'fechas_competencia' => [
                    'inicio' => optional($competencia)->fecha_inicio,
                    'fin' => optional($competencia)->fecha_fin
                ],
                'fechas_inscripcion' => [
                    'inicio' => optional($inscripcion)->fecha_inicio,
                    'fin' => optional($inscripcion)->fecha_fin
                ]
            ];
        });

        return response()->json($data);
    }

    // POST to save or update fechas
    public function store(Request $request)
    {
        $request->validate([
            'area_id' => 'required|exists:area,area_id',
            'tipo' => 'required|in:competencia,inscripcion',
            'inicio' => 'required|date',
            'fin' => 'required|date|after_or_equal:inicio',
        ]);

        if ($request->tipo === 'competencia') {
            $record = Competencia::updateOrCreate(
                ['area_id' => $request->area_id],
                ['fecha_inicio' => $request->inicio, 'fecha_fin' => $request->fin]
            );
        } else {
            $record = Cronograma::updateOrCreate(
                ['area_id' => $request->area_id, 'tipo_evento' => 'inscripcion'],
                ['fecha_inicio' => $request->inicio, 'fecha_fin' => $request->fin]
            );
        }

        return response()->json(['message' => 'Fechas actualizadas correctamente']);
    }

    public function destroy(Request $request)
    {
        $request->validate([
            'area_id' => 'required|exists:area,area_id',
            'tipo' => 'required|in:competencia,inscripcion'
        ]);

        if ($request->tipo === 'competencia') {
            Competencia::where('area_id', $request->area_id)->delete();
        } else {
            Cronograma::where('area_id', $request->area_id)
                      ->where('tipo_evento', 'inscripcion')
                      ->delete();
        }

        return response()->json(['message' => 'Fechas eliminadas correctamente']);
    }
}
