<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Boleta;
use App\Http\Resources\PagoCollection;
use Illuminate\Http\Request;

class BoletaController extends Controller{
    public function index()
    {
        $boletas = Boleta::with(['tutor', 'imagenes' => function($query) {
            $query->where('estado', true)->orderBy('fecha_subida', 'desc')->limit(1);
        }])->get();

        return new PagoCollection($boletas);
    }
}
