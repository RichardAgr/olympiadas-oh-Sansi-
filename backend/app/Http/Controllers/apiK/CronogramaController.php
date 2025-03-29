<?php

namespace App\Http\Controllers\apiK;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\modelK\Cronograma;
use App\Models\modelK\Area;
use App\Models\modelK\NivelCategoria;
use App\Models\modelK\Grado;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CronogramaController extends Controller{
    public function getEventosCronograma(Request $request){
        try {
            $query = DB::table('cronograma as c')
                ->join('area as a', 'c.area_id', '=', 'a.area_id')
                ->leftJoin('nivel_categoria as nc', 'c.nivel_categoria_id', '=', 'nc.nivel_categoria_id')
                ->leftJoin('grado as gi', 'nc.grado_id_inicial', '=', 'gi.grado_id')
                ->leftJoin('grado as gf', 'nc.grado_id_final', '=', 'gf.grado_id')
                ->leftJoin('nivel_educativo as nei', 'gi.nivel_educativo_id', '=', 'nei.nivel_educativo_id')
                ->leftJoin('nivel_educativo as nef', 'gf.nivel_educativo_id', '=', 'nef.nivel_educativo_id')
                ->select([
                    'c.cronograma_id',
                    'c.nombre as evento_nombre',
                    'c.descripcion',
                    'c.fecha_inicio',
                    'c.fecha_fin',
                    'c.costo',
                    'c.tipo_evento',
                    'a.area_id',
                    'a.nombre as area_nombre',
                    'nc.nivel_categoria_id',
                    'nc.nombre as nivel_categoria_nombre',
                    'nc.rango_grados',
                    'gi.grado_id as grado_inicial_id',
                    'gi.nombre as grado_inicial_nombre',
                    'nei.nombre as nivel_inicial_nombre',
                    'gf.grado_id as grado_final_id',
                    'gf.nombre as grado_final_nombre',
                    'nef.nombre as nivel_final_nombre'
                ]);
            
            // Aplicar filtros si existen
            if ($request->has('area_id')) {
                $query->where('c.area_id', $request->area_id);
            }
            
            if ($request->has('nivel_categoria_id')) {
                $query->where('c.nivel_categoria_id', $request->nivel_categoria_id);
            }
            
            if ($request->has('tipo_evento')) {
                $query->where('c.tipo_evento', 'like', '%' . $request->tipo_evento . '%');
            }
            
            if ($request->has('fecha_desde')) {
                $query->where('c.fecha_inicio', '>=', Carbon::parse($request->fecha_desde)->startOfDay());
            }
            
            if ($request->has('fecha_hasta')) {
                $query->where('c.fecha_inicio', '<=', Carbon::parse($request->fecha_hasta)->endOfDay());
            }
            
            if ($request->has('costo_min')) {
                $query->where('c.costo', '>=', $request->costo_min);
            }
            
            if ($request->has('costo_max')) {
                $query->where('c.costo', '<=', $request->costo_max);
            }
            
            // Ordenar por fecha de inicio (más próxima primero)
            $query->orderBy('c.fecha_inicio', 'asc');
            
            $eventos = $query->paginate(10);
            
            // Transformar resultados para el formato de respuesta
            $data = collect($eventos->items())->map(function ($evento) {
                $rangoGrados = $evento->rango_grados;
                
                if ($rangoGrados === '------' || $rangoGrados === null) {
                    if ($evento->grado_inicial_id && $evento->grado_final_id) {
                        $gradoInicial = $evento->grado_inicial_nombre;
                        $gradoFinal = $evento->grado_final_nombre;
                        
                        if ($evento->nivel_inicial_nombre === 'Secundaria') {
                            $gradoInicial .= ' Secundaria';
                        }
                        
                        if ($evento->nivel_final_nombre === 'Secundaria') {
                            $gradoFinal .= ' Secundaria';
                        }
                        
                        if ($evento->grado_inicial_id === $evento->grado_final_id) {
                            $rangoGrados = $gradoInicial;
                        } else {
                            $rangoGrados = "{$gradoInicial} a {$gradoFinal}";
                        }
                    } else {
                        $rangoGrados = 'No definido';
                    }
                }
                
                // Formatear fechas
                $fechaInicio = $evento->fecha_inicio ? Carbon::parse($evento->fecha_inicio)->format('d/m/Y') : 'No definida';
                $fechaFin = $evento->fecha_fin ? Carbon::parse($evento->fecha_fin)->format('d/m/Y') : 'No definida';
                
                // Construir respuesta
                return [
                    'id' => $evento->cronograma_id,
                    'nombre' => $evento->evento_nombre,
                    'descripcion' => $evento->descripcion,
                    'area' => [
                        'id' => $evento->area_id,
                        'nombre' => $evento->area_nombre
                    ],
                    'nivel_categoria' => $evento->nivel_categoria_id ? [
                        'id' => $evento->nivel_categoria_id,
                        'nombre' => $evento->nivel_categoria_nombre
                    ] : null,
                    'grado' => $rangoGrados,
                    'fechas' => [
                        'inicio' => $fechaInicio,
                        'fin' => $fechaFin
                    ],
                    'costo' => number_format($evento->costo, 2, '.', ','),
                    'tipo_evento' => $evento->tipo_evento,
                ];
            });
            
            return response()->json([
                'success' => true,
                'message' => 'Eventos obtenidos correctamente',
                'data' => $data,
                'pagination' => [
                    'total' => $eventos->total(),
                    'per_page' => $eventos->perPage(),
                    'current_page' => $eventos->currentPage(),
                    'last_page' => $eventos->lastPage(),
                    'from' => $eventos->firstItem(),
                    'to' => $eventos->lastItem()
                ]
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error al obtener eventos del cronograma: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener los eventos del cronograma',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
