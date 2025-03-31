<?php

namespace App\Http\Controllers\apiR;

use App\Http\Controllers\Controller;
use App\Models\modelR\Area;
use App\Models\modelR\Grado;
use App\Models\modelR\NivelCategoria;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;

class AreaCategoriarR extends Controller{
    public function getAreaConCategoria($id){
        try {
            $area = Area::findOrFail($id);
            
            $categories = NivelCategoria::where('area_id', $id)
                ->with(['gradoInicial', 'gradoFinal'])
                ->get()
                ->map(function ($category) {
                    return [
                        'nivel_categoria_id' => $category->nivel_categoria_id,
                        'nombre' => $category->nombre,
                        'descripcion' => $category->descripcion,
                        'estado' => $category->estado,
                        'grado_id_inicial' => $category->grado_id_inicial,
                        'grado_id_final' => $category->grado_id_final,
                        'grado_inicial_nombre' => $category->gradoInicial->nombre,
                        'grado_final_nombre' => $category->gradoFinal->nombre,
                    ];
                });
            
            return response()->json([
                'area' => $area,
                'categories' => $categories
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Area not found',
            ], 404);
        }
    }
}