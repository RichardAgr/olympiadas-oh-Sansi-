<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Area;
use App\Models\Competencia;
use App\Models\Cronograma;

class EventoController extends Controller
{
    // ✅ GET all areas with their assigned dates
    public function index()
    {
        $areas = Area::all();

        $data = $areas->map(function ($area) {
            $competencia = Competencia::where('area_id', $area->area_id)->first();
            $inscripcion = Cronograma::where('area_id', $area->area_id)
                                     ->where('tipo_evento', 'inscripcion')
                                     ->first();

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

    // ✅ POST - Save or update competition/registration dates
    public function store(Request $request)
    {
        try {
            $request->validate([
                'area_id' => 'required|exists:area,area_id',
                'tipo' => 'required|in:competencia,inscripcion',
                'inicio' => 'required|date',
                'fin' => 'required|date|after_or_equal:inicio',
            ]);

            if ($request->tipo === 'competencia') {
                Competencia::updateOrCreate(
                    ['area_id' => $request->area_id],
                    [
                        'fecha_inicio' => $request->inicio,
                        'fecha_fin' => $request->fin,
                        'estado' => 1, // Optional, in case you need it active
                        'descripcion' => 'Generado automáticamente',
                        'nombre_competencia' => 'Competencia por área',
                    ]
                );
            } else {
                Cronograma::updateOrCreate(
                    [
                        'area_id' => $request->area_id,
                        'tipo_evento' => 'inscripcion',
                    ],
                    [
                        'fecha_inicio' => $request->inicio,
                        'fecha_fin' => $request->fin,
                        'nombre_evento' => 'Fecha de inscripción',
                        'descripcion' => 'Generado automáticamente',
                        'anio_olimpiada' => 2025,
                    ]
                );
            }

            return response()->json(['message' => 'Fechas actualizadas correctamente']);
        } catch (\Throwable $e) {
            return response()->json([
                'error' => 'Error al procesar',
                'details' => $e->getMessage()
            ], 500);
        }
    }


    // ✅ DELETE - Remove registration or competition dates
    public function destroy(Request $request)
    {
        $request->validate([
            'area_id' => 'required|exists:area,area_id',
            'tipo' => 'required|in:competencia,inscripcion'
        ]);

        if ($request->tipo === 'competencia') {
            Competencia::where('area_id', $request->area_id)->delete();
            Cronograma::where('area_id', $request->area_id)
                      ->where('tipo_evento', 'competencia')
                      ->delete();
        } else {
            Cronograma::where('area_id', $request->area_id)
                      ->where('tipo_evento', 'inscripcion')
                      ->delete();
        }

        return response()->json(['message' => 'Fechas eliminadas correctamente']);
    }
}
