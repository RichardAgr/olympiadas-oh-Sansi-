<?php

namespace App\Http\Controllers\apiK;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\modelK\Area;
use App\Http\Resources\resourceK\AreaResource;

class AreaControllerK extends Controller{
    public function getEventosCronograma(){
        try {
            $areas = Area::with([
                'nivelesCategoria.gradoMinimo',
                'cronogramas'
            ])
            ->where('estado', true)
            ->get();

            return AreaResource::collection($areas);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener datos de áreas',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
