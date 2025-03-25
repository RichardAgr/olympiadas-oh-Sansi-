<?php

namespace App\Http\Controllers\apiR;

use Illuminate\Http\Request;
use App\Models\modelR\Area;

class AreaController extends Controller{
    public function show($id){
        $area = Area::find($id);
        
        if (!$area) {
            return response()->json([
                'success' => false,
                'message' => 'Área no encontrada'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $area
        ]);
    }
}
