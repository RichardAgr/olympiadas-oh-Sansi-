<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ImagenBoleta;
use App\Models\Boleta;
use App\Http\Resources\PagoCollection;
use Illuminate\Http\Request;

class BoletaController extends Controller{
    public function index()
    {
        $boletas = Boleta::with(['tutor'])->get();
        foreach ($boletas as $boleta) {
            $imagen = ImagenBoleta::where('boleta_id', $boleta->boleta_id)
                ->orderBy('fecha_subida', 'desc')
                ->first();
            
            // Asignar la imagen a la boleta
            $boleta->imagen_manual = $imagen;
        }

        // Devolver la colección formateada como JSON
        return new PagoCollection($boletas);
    }
}
