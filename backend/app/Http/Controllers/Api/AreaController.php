<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\QueryException;
use Illuminate\Http\JsonResponse;
use App\Models\Area;

class AreaController extends Controller{
    public function ObtenerAreasRegistradas(Request $request): JsonResponse{
         try {
            $areas = Area::select('area_id', 'costo', 'nombre', 'descripcion', 'estado', 'created_at', 'updated_at')
                         ->distinct()
                         ->orderBy('nombre', 'asc')
                         ->get();

            if ($areas->isEmpty()) {
                return response()->json([], 200);
            }

            $areasFormatted = $areas->map(function ($area) {
                return [
                    'area_id' => $area->area_id,
                    'costo' => (float) $area->costo,
                    'nombre' => $area->nombre,
                    'descripcion' => $area->descripcion,
                    'estado' => (int) $area->estado,
                    'created_at' => $area->created_at->toISOString(),
                    'updated_at' => $area->updated_at->toISOString()
                ];
            });

            return response()->json($areasFormatted->toArray(), 200);

        } catch (Exception $e) {
            Log::error('Error al obtener áreas: ' . $e->getMessage());

            return response()->json([
                'error' => 'Error interno del servidor'
            ], 500);
        }
    }

    /**
     * Mostrar áreas con eventos y cronogramas.
     * GET /api/areasRegistradas
     */
    public function getEventosCronograma()
{
    try {
        $resultados = \DB::table('area')
            ->join('nivel_categoria', 'area.area_id', '=', 'nivel_categoria.area_id')
            ->join('grado as gi', 'nivel_categoria.grado_id_inicial', '=', 'gi.grado_id')
            ->join('grado as gf', 'nivel_categoria.grado_id_final', '=', 'gf.grado_id')
            ->leftJoin('cronograma', 'area.area_id', '=', 'cronograma.area_id')
            ->select(
                'area.nombre as area',
                'nivel_categoria.nombre as nivel_categoria',
                \DB::raw("CONCAT(gi.nombre, ' - ', gf.nombre) as grado"),
                'area.costo',
                'cronograma.tipo_evento',
                'cronograma.fecha_inicio',
                'cronograma.fecha_fin',
                'nivel_categoria.descripcion'
            )
            ->get();

        return response()->json([
            'data' => [
                [
                    'data' => $resultados
                ]
            ]
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'error' => 'Error al obtener datos de áreas registradas',
            'message' => $e->getMessage()
        ], 500);
    }
}


    /**
     * Registrar una nueva área.
     * POST /api/areas
     */
    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:50|unique:area,nombre',
            'descripcion' => 'required|string',
            'costo' => 'required|numeric|min:0',
            'estado' => 'nullable|boolean'
        ]);

        $area = Area::create([
            'nombre' => $request->nombre,
            'descripcion' => $request->descripcion,
            'costo' => $request->costo,
            'estado' => $request->estado ?? true
        ]);

        return response()->json([
            'message' => 'Área registrada con éxito',
            'area' => $area
        ], 201);
    }

    /**
     * Mostrar un área específica.
     * GET /api/areas/{id}
     */
    public function show($id)
    {
        $area = Area::findOrFail($id);
        return response()->json($area, 200);
    }

    /**
     * Actualizar un área.
     * PUT /api/areas/{id}
     */
    public function update(Request $request, $id)
    {
        $area = Area::findOrFail($id);

        $request->validate([
            'nombre' => 'required|string|max:50|unique:area,nombre,' . $id . ',area_id',
            'descripcion' => 'required|string',
            'costo' => 'required|numeric|min:0',
            'estado' => 'required|boolean'
        ]);

        $area->update($request->all());

        return response()->json([
            'message' => 'Área actualizada correctamente',
            'area' => $area
        ]);
    }


    public function EliminarArea(int $areaId): JsonResponse{
        try {
            // Buscar el área por area_id
            $area = Area::where('area_id', $areaId)->first();

            // Verificar si el área existe
            if (!$area) {
                return response()->json([
                    'error' => 'Área no encontrada'
                ], 404);
            }

            // Guardar los datos del área antes de eliminar
            $areaData = [
                'area_id' => $area->area_id,
                'costo' => (float) $area->costo,
                'nombre' => $area->nombre,
                'descripcion' => $area->descripcion,
                'estado' => (int) $area->estado,
                'created_at' => $area->created_at->toISOString(),
                'updated_at' => $area->updated_at->toISOString()
            ];

            // Eliminar el área sin verificar relaciones
            $area->delete();

            // Retornar los datos del área eliminada
            return response()->json($areaData, 200);

        } catch (Exception $e) {
            Log::error('Error al eliminar área forzadamente: ' . $e->getMessage(), [
                'area_id' => $areaId,
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ]);

            return response()->json([
                'error' => 'Error interno del servidor'
            ], 500);
        }
    }

    public function getAreasWithCategoriasGrados()
    {
        try {
            // Obtener todas las áreas con sus categorías y relaciones de grados
            $areas = Area::with([
                'nivelCategoria',
                'nivelCategoria.gradoInicial',
                'nivelCategoria.gradoFinal',
                'nivelCategoria.gradoInicial.nivelEducativo',
                'nivelCategoria.gradoFinal.nivelEducativo'
            ])
            ->where('estado', true)
            ->get();

            $result = [];

            foreach ($areas as $area) {
                $categorias = [];

                // Procesar cada categoría del área
                foreach ($area->nivelCategoria as $categoria) {
                    $gradoInicialNombre = $categoria->gradoInicial->nombre;
                    $gradoFinalNombre = $categoria->gradoFinal->nombre;
                    
                    // Crear el rango_grado
                    $rangoGrado = $gradoInicialNombre;
                    if ($categoria->grado_id_inicial !== $categoria->grado_id_final) {
                        $rangoGrado .= ' a ' . $gradoFinalNombre;
                    }
                    
                    $categoriaData = [
                        'nivel_categoria_id' => $categoria->nivel_categoria_id,
                        'nombre' => $categoria->nombre,
                        'rango_grado' => $rangoGrado
                    ];

                    $categorias[] = $categoriaData;
                }

                // Solo agregar áreas que tengan categorías
                if (count($categorias) > 0) {
                    $result[] = [
                        'area_id' => $area->area_id,
                        'nombre' => $area->nombre,
                        'costo' => $area->costo,
                        'categorias' => $categorias
                    ];
                }
            }

            return response()->json([
                'success' => true,
                'data' => $result,
                'message' => 'Áreas con categorías y grados obtenidas correctamente'
            ], 200);

        } catch (\Exception $e) {
            Log::error('Error al obtener áreas con categorías y grados: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener las áreas con categorías y grados',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}