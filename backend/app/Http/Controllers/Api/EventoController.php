<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Area;
use App\Models\Competencia;
use App\Models\Cronograma;
use Illuminate\Support\Facades\DB;


class EventoController extends Controller
{
    public function listarFechasEvento()
    {
        $areas = Area::with([
            'competencia.cronograma'
        ])->get();

        $result = $areas->map(function ($area) {
            $competencia = $area->competencia;
            $cronograma = $competencia?->cronograma;

            // Group fechas by tipo_evento in cronograma
            $inscripcion = null;
            $competenciaFecha = null;

            if ($cronograma) {
                if ($cronograma->tipo_evento === 'inscripcion') {
                    $inscripcion = [
                        'inicio' => $cronograma->fecha_inicio,
                        'fin' => $cronograma->fecha_fin
                    ];
                } elseif ($cronograma->tipo_evento === 'competencia') {
                    $competenciaFecha = [
                        'inicio' => $cronograma->fecha_inicio,
                        'fin' => $cronograma->fecha_fin
                    ];
                }
            }

            return [
                'id' => $area->area_id,
                'nombre' => $area->nombre,
                'competencia_id' => $competencia?->competencia_id,
                'fechas_inscripcion' => $inscripcion,
                'fechas_competencia' => $competenciaFecha,
            ];
        });

        return response()->json($result);
    }

    public function obtenerFechaPorTipo($area_id, $tipo)
    {
        if ($tipo === 'competencia') {
            $competencia = Competencia::where('area_id', $area_id)->first();
            if (!$competencia) {
                return response()->json(null);
            }

            return response()->json([
                'inicio' => $competencia->fecha_inicio,
                'fin' => $competencia->fecha_fin,
            ]);
        }

        // For 'inscripcion' type, still look into cronograma
        $cronograma = Cronograma::where('area_id', $area_id)
            ->where('tipo_evento', $tipo)
            ->first();

        if (!$cronograma) {
            return response()->json(null);
        }

        return response()->json([
            'inicio' => $cronograma->fecha_inicio,
            'fin' => $cronograma->fecha_fin,
        ]);
    }



    public function index()
    {
        $areas = Area::all();

        $data = $areas->map(function ($area) {
            $inscripcionEvent = Cronograma::where('area_id', $area->area_id)
                                     ->where('tipo_evento', 'inscripcion')
                                     ->first();
            $finEvent = Cronograma::where('area_id', $area->area_id)
                                     ->where('tipo_evento', 'Fin')
                                     ->first();

            return [
                'id' => $area->area_id,
                'nombre' => $area->nombre,
                'fechas_fin' => [
                    'inicio' => optional($finEvent)->fecha_inicio,
                    'fin' => optional($finEvent)->fecha_fin
                ],
                'fechas_inscripcion' => [
                    'inicio' => optional($inscripcionEvent)->fecha_inicio,
                    'fin' => optional($inscripcionEvent)->fecha_fin
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
