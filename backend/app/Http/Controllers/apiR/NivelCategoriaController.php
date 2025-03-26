<?php

namespace App\Http\Controllers\apiR;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Schema;
use App\Models\modelR\NivelCategoria;
use App\Http\Resources\resourcesR\NivelCategoriaResource;
use App\Models\modelR\Area;
use App\Models\modelR\Grado;
use App\Http\Resources\NivelCategoriaCollection;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;

class NivelCategoriaController extends Controller{

    public function updateCategoria(Request $request, $id){
        try {
            DB::beginTransaction();
            
            $category = NivelCategoria::findOrFail($id);
            $gradoInicial = Grado::findOrFail($request->grado_id_inicial);
            $gradoFinal = Grado::findOrFail($request->grado_id_final);
            
            // Update the category
            $category->update([
                'nombre' => $request->nombre,
                'descripcion' => $request->descripcion,
                'grado_id_inicial' => $request->grado_id_inicial,
                'grado_id_final' => $request->grado_id_final,
                'area_id' => $request->area_id,
            ]);
            
            DB::commit();
            
            $category->load(['gradoMinimo', 'gradoMaximo', 'area']);
            
        } catch (\Exception $e) {
            DB::rollBack();
            
            if ($e instanceof \Illuminate\Database\Eloquent\ModelNotFoundException) {
                return response()->json([
                    'message' => 'Categoria no encontrada'
                ], 404);
            }
            
            return response()->json([
                'message' => 'Error interno del servidor',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function DatosCategoria($id){
        try {
            $categoria = DB::table('nivel_categoria as nc')
                ->join('area as a', 'nc.area_id', '=', 'a.area_id')
                ->join('grado as gi', 'nc.grado_id_inicial', '=', 'gi.grado_id')
                ->join('grado as gf', 'nc.grado_id_final', '=', 'gf.grado_id')
                ->select(
                    'nc.nivel_categoria_id as id',
                    'nc.nombre',
                    'nc.descripcion',
                    'nc.estado',
                    'a.area_id',
                    'a.nombre as area_nombre',
                    'a.descripcion as area_descripcion',
                    'gi.grado_id as grado_inicial_id',
                    'gi.nombre as grado_inicial_nombre',
                    'gf.grado_id as grado_final_id',
                    'gf.nombre as grado_final_nombre'
                )
                ->where('nc.nivel_categoria_id', $id)
                ->first();
                
            if (!$categoria) {
                return response()->json([
                    'message' => 'Categoría no encontrada'
                ], Response::HTTP_NOT_FOUND);
            }
            
            //  rango de grados
            if ($categoria->grado_inicial_id === $categoria->grado_final_id) {
                $categoria->rango_grados = $categoria->grado_inicial_nombre;
            } else {
                $categoria->rango_grados = $categoria->grado_inicial_nombre . ' a ' . $categoria->grado_final_nombre;
            }
            
            return response()->json($categoria, Response::HTTP_OK);
        } catch (\Exception $e) {
            Log::error('Error al obtener detalles de categoría: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error al obtener los detalles de la categoría',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }


    public function eliminarCategoria($id)
    {
        try {
            DB::beginTransaction();
            
            $categoria = DB::table('nivel_categoria')
                ->where('nivel_categoria_id', $id)
                ->first();
                
            if (!$categoria) {
                return response()->json([
                    'success' => false,
                    'message' => 'Categoría no encontrada'
                ], Response::HTTP_NOT_FOUND);
            }
            

            DB::table('nivel_categoria')
                ->where('nivel_categoria_id', $id)
                ->update([
                    'nombre' => '------',
                    'estado' => 0 

                ]);
            
            DB::commit();
            
            Log::info('Categoría marcada como eliminada', [
                'nivel_categoria_id' => $id,
                'usuario_id' => auth()->check() ? auth()->id() : 'sistema',
                'timestamp' => now()
            ]);
            
            return response()->json([
                'success' => true,
                'message' => 'Categoría marcada como eliminada correctamente'
            ], Response::HTTP_OK);
            
        } catch (\Exception $e) {
            DB::rollBack();
            
            Log::error('Error al marcar categoría como eliminada: ' . $e->getMessage(), [
                'nivel_categoria_id' => $id,
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Error al marcar la categoría como eliminada',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }


    public function eliminarGradoDeCategoria($categoriaId, $gradoId)
    {
        try {
            $categoria = DB::table('nivel_categoria')
                ->where('nivel_categoria_id', $categoriaId)
                ->first();
                
            if (!$categoria) {
                return response()->json([
                    'success' => false,
                    'message' => 'Categoría no encontrada'
                ], Response::HTTP_NOT_FOUND);
            }
            
            $grado = DB::table('grado')
                ->where('grado_id', $gradoId)
                ->first();
                
            if (!$grado) {
                return response()->json([
                    'success' => false,
                    'message' => 'Grado no encontrado'
                ], Response::HTTP_NOT_FOUND);
            }
            
            if ($categoria->grado_id_inicial == $gradoId || $categoria->grado_id_final == $gradoId) {
                return response()->json([
                    'success' => false,
                    'message' => 'No se puede eliminar un grado que es límite del rango de la categoría. Debe modificar la categoría primero.'
                ], Response::HTTP_BAD_REQUEST);
            }
            
            if (Schema::hasTable('categoria_grado')) {
                $eliminado = DB::table('categoria_grado')
                    ->where('nivel_categoria_id', $categoriaId)
                    ->where('grado_id', $gradoId)
                    ->delete();
                    
                if ($eliminado == 0) {
                    return response()->json([
                        'success' => false,
                        'message' => 'El grado no está asociado a esta categoría'
                    ], Response::HTTP_NOT_FOUND);
                }
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'La estructura de la base de datos no permite eliminar grados individuales de una categoría'
                ], Response::HTTP_BAD_REQUEST);
            }
            
            Log::info('Grado eliminado de categoría', [
                'nivel_categoria_id' => $categoriaId,
                'grado_id' => $gradoId,
                'usuario_id' => auth()->check() ? auth()->id() : 'sistema',
                'timestamp' => now()
            ]);
            
            return response()->json([
                'success' => true,
                'message' => 'Grado eliminado de la categoría correctamente'
            ], Response::HTTP_OK);
            
        } catch (\Exception $e) {
            // Registrar el error
            Log::error('Error al eliminar grado de categoría: ' . $e->getMessage(), [
                'nivel_categoria_id' => $categoriaId,
                'grado_id' => $gradoId,
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar el grado de la categoría',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function store(Request $request){

        // Verificar que el área existe
        $area = Area::find($request->area_id);
        if (!$area) {
            return response()->json([
                'success' => false,
                'message' => 'El área seleccionada no existe'
            ], 404);
        }

        // Crear la nueva categoría
        $categoria = new NivelCategoria();
        $categoria->area_id= $request->area_id;
        $categoria->nombre= $request->nombre;
        $categoria->descripcion = $request->descripcion;
        $categoria->grado_id_inicial = 7;
        $categoria->grado_id_final = 7;
        $categoria->estado = 1; 
        $categoria->save();

        return response()->json([
            'success' => true,
            'message' => 'Categoría creada exitosamente',
            'data' => $categoria
        ], 201);
       
    }
}