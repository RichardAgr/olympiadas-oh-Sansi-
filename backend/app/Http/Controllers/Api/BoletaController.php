<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ImagenBoleta;
use App\Models\Boleta;
use App\Models\Tutor;
use App\Http\Resources\PagoCollection;
use Illuminate\Support\Facades\DB;
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

    public function boletasPorTutor($id){
         try {
             $tutor = Tutor::find($id);
 
             if (!$tutor) {
                 return response()->json([
                     'success' => false,
                     'message' => 'Tutor no encontrado'
                 ], 404);
             }
 
             // Obtener las boletas del tutor
             $boletas = DB::table('boleta as b')
                 ->leftJoin('imagen_boleta as ib', 'b.boleta_id', '=', 'ib.boleta_id')
                 ->leftJoin('competidor_competencia as cc', 'b.boleta_id', '=', 'cc.boleta_id')
                 ->leftJoin('area as a', 'cc.area_id', '=', 'a.area_id')
                 ->select(
                     'b.boleta_id',
                     DB::raw('IFNULL(a.nombre, "Área no disponible") as area'),
                     'b.numero_boleta as numero_comprobante',
                     'b.monto_total as monto',
                     'b.fecha_pago',
                     'ib.ruta_imagen as imagen_url',
                     DB::raw('COUNT(DISTINCT cc.competidor_id) as cantidad_competidores')
                 )
                 ->where('b.tutor_id', $id)
                 ->groupBy(
                     'b.boleta_id',
                     'a.nombre',
                     'b.numero_boleta',
                     'b.monto_total',
                     'b.fecha_pago',
                     'ib.ruta_imagen'
                 )
                 ->orderBy('b.fecha_pago', 'desc')
                 ->get();
 
             return response()->json([
                 'tutor' => [
                     'nombre_completo' => $tutor->nombres . ' ' . $tutor->apellidos
                 ],
                 'boletas' => $boletas
             ]);
         } catch (\Exception $e) {
             return response()->json([
                 'success' => false,
                 'message' => 'Error al obtener las boletas del tutor',
                 'error' => $e->getMessage()
             ], 500);
         }
     }
     
     public function generarBoleta(Request $request, $tutor_id)
    {
        $validated = $request->validate([
            'numero' => 'required|string|unique:boleta,numero_boleta',
            'periodo' => 'required|string',
            'area' => 'required|string',
            'nombre' => 'required|string',
            'montoTotal' => 'required|numeric|min:1',
            'competidores' => 'required|array|min:1',
            'competidores.*.nombre' => 'required|string',
            'competidores.*.categoria' => 'required|string',
            'competidores.*.monto' => 'required|numeric|min:0'
        ]);

        try {
            DB::beginTransaction();

            // Create boleta
            $boleta = Boleta::create([
                'tutor_id' => $tutor_id,
                'numero_boleta' => $request->numero,
                'periodo' => $request->periodo,
                'nombre_pagador' => $request->nombre,
                'monto_total' => $request->montoTotal,
                'estado' => 0,
                'fecha_emision' => now()
            ]);


            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Boleta generada correctamente',
                'boleta_id' => $boleta->boleta_id
            ]);

        } catch (\Throwable $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Error al generar la boleta.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    public function generarBoletaDesdeQuery(Request $request, $tutor_id)
    {
        $validated = $request->validate([
            'numero' => 'required|string|unique:boleta,numero_boleta',
            'periodo' => 'required|string',
            'area' => 'required|string',
            'nombre' => 'required|string',
            'montoTotal' => 'required|numeric|min:1',
            // competidores must come as JSON stringified in GET
            'competidores' => 'required|string'
        ]);

        try {
            $competidores = json_decode($request->competidores, true);

            if (!is_array($competidores) || count($competidores) < 1) {
                return response()->json([
                    'success' => false,
                    'message' => 'El campo competidores debe contener al menos un competidor válido.'
                ], 422);
            }

            DB::beginTransaction();

            $boleta = Boleta::create([
                'tutor_id' => $tutor_id,
                'numero_boleta' => $request->numero,
                'periodo' => $request->periodo,
                'nombre_pagador' => $request->nombre,
                'monto_total' => $request->montoTotal,
                'estado' => 0,
                'fecha_emision' => now()
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Boleta generada correctamente (vía GET)',
                'boleta_id' => $boleta->boleta_id
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Error al generar la boleta (GET)',
                'error' => $e->getMessage()
            ], 500);
        }
    }

}
