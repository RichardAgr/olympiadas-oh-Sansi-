<?php

namespace App\Http\Controllers;

use App\Models\Area;
use App\Http\Resources\AreaResource;
use Illuminate\Http\Request;

class TablaDatosHU2Controller extends Controller{

    public function obtenerAreasCategoriaGrados(){

        // Obtener áreas activas con sus niveles de categoría
        $areas = Area::where('estado', true)
            ->with(['nivelesCategoria' => function($query) {
                $query->with([
                    'gradoMinimo.nivelEducativo', 
                    'gradoMaximo.nivelEducativo'
                ]);
            }])
            ->get();
            
       return  AreaResource::collection($areas);  
    }
}
