<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\NivelCategoria;
use App\Http\Resources\NivelCategoriaResource;
use App\Http\Resources\NivelCategoriaCollection;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;

class NivelCategoriaController extends Controller{
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
}