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
    // GET /api/eventos
    public function index()
    {
        $areas = Area::with(['competencia', 'cronogramas' => function ($query) {
            $query->whereIn('tipo', ['inscripcion', 'competencia']);
        }])->get();

        $areas = $areas->map(function ($area) {
            $fechasInscripcion = $area->cronogramas->firstWhere('tipo', 'inscripcion');
            $fechasCompetencia = $area->cronogramas->firstWhere('tipo', 'competencia');

            return [
                'id' => $area->id,
                'nombre' => $area->nombre,
                'competencia_id' => $area->competencia->id ?? null,
                'fechas_inscripcion' => $fechasInscripcion ? [
                    'inicio' => $fechasInscripcion->inicio,
                    'fin' => $fechasInscripcion->fin,
                ] : null,
                'fechas_competencia' => $fechasCompetencia ? [
                    'inicio' => $fechasCompetencia->inicio,
                    'fin' => $fechasCompetencia->fin,
                ] : null,
            ];
        });

        return response()->json($areas);
    }
    public function listarFechasEvento()
    {
        $areas = Area::with([
            'competencia.cronograma'
        ])->get();

        $result = $areas->map(function ($area) {
            $competencia = $area->competencia;
            $cronograma = $competencia?->cronograma;

            return [
                'id' => $area->id,
                'nombre' => $area->nombre,
                'competencia_id' => $competencia?->id,
                'fechas_inscripcion' => $cronograma && $cronograma->fecha_inscripcion_inicio
                    ? [
                        'inicio' => $cronograma->fecha_inscripcion_inicio,
                        'fin' => $cronograma->fecha_inscripcion_fin
                    ]
                    : null,
                'fechas_competencia' => $cronograma && $cronograma->fecha_competencia_inicio
                    ? [
                        'inicio' => $cronograma->fecha_competencia_inicio,
                        'fin' => $cronograma->fecha_competencia_fin
                    ]
                    : null,
            ];
        });

        return response()->json($result);
    }

    // POST /api/eventos
    public function store(Request $request)
    {
        $request->validate([
            'area_id' => 'required|exists:areas,id',
            'tipo' => 'required|in:inscripcion,competencia',
            'nombre_evento' => 'required|string',
            'inicio' => 'required|date',
            'fin' => 'required|date|after_or_equal:inicio',
        ]);

        $competencia = Competencia::firstOrCreate(
            ['area_id' => $request->area_id],
            ['nombre' => $request->nombre_evento]
        );

        $cronograma = Cronograma::updateOrCreate(
            ['competencia_id' => $competencia->id, 'tipo' => $request->tipo],
            ['inicio' => $request->inicio, 'fin' => $request->fin]
        );

        return response()->json(['message' => 'Fechas actualizadas correctamente']);
    }

    // DELETE /api/eventos/{id}
    public function destroy($id)
    {
        // Expecting ID to be a cronograma ID
        $cronograma = Cronograma::find($id);

        if (!$cronograma) {
            return response()->json(['error' => 'No se encontró el cronograma'], 404);
        }

        $cronograma->delete();

        return response()->json(['message' => 'Fechas eliminadas correctamente']);
    }

    // GET /api/eventos/{id}
    public function show($id)
    {
        $area = Area::with('competencia', 'cronogramas')->find($id);

        if (!$area) {
            return response()->json(['error' => 'Área no encontrada'], 404);
        }

        return response()->json($area);
    }

    // PUT /api/eventos/{id}
    public function update(Request $request, $id)
    {
        $cronograma = Cronograma::find($id);

        if (!$cronograma) {
            return response()->json(['error' => 'Cronograma no encontrado'], 404);
        }

        $request->validate([
            'inicio' => 'required|date',
            'fin' => 'required|date|after_or_equal:inicio',
        ]);

        $cronograma->update([
            'inicio' => $request->inicio,
            'fin' => $request->fin,
        ]);

        return response()->json(['message' => 'Fechas actualizadas correctamente']);
    }
}
