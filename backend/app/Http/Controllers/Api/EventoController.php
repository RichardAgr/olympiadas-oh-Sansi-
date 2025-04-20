<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Area;
use App\Models\Competencia;
use App\Models\Cronograma;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

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

    // ✅ POST - Save or update competition/registration dates (Frontend format)
    public function store(Request $request)
    {
        try {
            $request->validate([
                'area_id' => 'required|exists:area,area_id',
                'tipo_evento' => 'required|in:competencia,inscripcion',
                'fecha_inicio' => 'required|date',
                'fecha_fin' => 'required|date|after_or_equal:fecha_inicio',
            ]);

            if ($request->tipo_evento === 'competencia') {
                Competencia::updateOrCreate(
                    ['area_id' => $request->area_id],
                    [
                        'fecha_inicio' => $request->fecha_inicio,
                        'fecha_fin' => $request->fecha_fin,
                        'estado' => 1,
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
                        'fecha_inicio' => $request->fecha_inicio,
                        'fecha_fin' => $request->fecha_fin,
                        'nombre_evento' => $request->nombre_evento ?? 'Fecha de inscripción',
                        'descripcion' => 'Generado automáticamente',
                        'anio_olimpiada' => 2025,
                        'lugar' => $request->lugar ?? 'No especificado',
                    ]
                );
            }

            return response()->json(['message' => 'Fechas actualizadas correctamente']);
        } catch (\Throwable $e) {
            Log::error('❌ Error al guardar fecha:', [
                'error' => $e->getMessage(),
                'request' => $request->all()
            ]);

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
            'tipo_evento' => 'required|in:competencia,inscripcion'
        ]);

        if ($request->tipo_evento === 'competencia') {
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
