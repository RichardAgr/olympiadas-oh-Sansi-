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
    public function generarBoleta(Request $request)
    {
        $validated = $request->validate([
            'tutor_id' => 'required|integer|exists:tutor,tutor_id',
            'numero' => 'required|string',
            'periodo' => 'required|string',
            'area' => 'required|string',
            'nombre' => 'required|string',
            'montoTotal' => 'required|numeric',
            'competidores' => 'required|array|min:1',
            'competidores.*.nombre' => 'required|string',
            'competidores.*.categoria' => 'required|string',
            'competidores.*.monto' => 'required|numeric',
        ]);

        try {
            $boleta = Boleta::create([
                'tutor_id' => $request->tutor_id,
                'numero_boleta' => $request->numero,
                'periodo' => $request->periodo,
                'area' => $request->area,
                'nombre_completo' => $request->nombre,
                'nombre_pagador' => $request->nombre, 
                'monto_total' => $request->montoTotal,
                'estado' => 1,
                'fecha_emision' => now(),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Boleta generada correctamente.',
                'boleta_id' => $boleta->boleta_id
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al generar la boleta.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

}
