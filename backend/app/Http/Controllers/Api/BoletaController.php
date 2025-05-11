<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ImagenBoleta;
use App\Models\Boleta;
use App\Models\Tutor;
use App\Http\Resources\PagoCollection;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use App\Models\CompetidorCompetencia;
use App\Models\TutorCompetidor;
use App\Models\Area;
use App\Models\Competidor;
use App\Models\NivelCategoria;
use Illuminate\Support\Facades\Log;

class BoletaController extends Controller{
    public function index()
    {
        $boletas = Boleta::with(['tutor'])->get();
        foreach ($boletas as $boleta) {
            $imagen = ImagenBoleta::where('boleta_id', $boleta->boleta_id)
                ->orderBy('fecha_subida', 'desc')
                ->first();

            // Asig            nar la imagen a la boleta
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

             // Obtener las boletas de l tutor
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
                 'tutor'  => [
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

     public function generarBoleta($competidorId)
{
    try {
        // Obtener la última fila de la tabla competidor_competencia
        $competidorCompetencia = CompetidorCompetencia::where('competidor_id', $competidorId)
            ->latest('created_at')
            ->first();

        if (!$competidorCompetencia) {
            return response()->json([
                'success' => false,
                'message' => 'Competidor no encontrado en la competencia.'
            ], 404);
        }

        // Obtener los datos del competidor
        $competidor = Competidor::find($competidorId);

        if (!$competidor) {
            return response()->json([
                'success' => false,
                'message' => 'Competidor no encontrado.'
            ], 404);
        }

        // Obtener los datos del área desde la tabla 'area'
        $area = Area::find($competidorCompetencia->area_id);

        if (!$area) {
            return response()->json([
                'success' => false,
                'message' => 'Área no encontrada.'
            ], 404);
        }

        // Obtener los datos del tutor relacionado con el competidor
        $tutorCompetidor = TutorCompetidor::where('competidor_id', $competidorId)
            ->latest('created_at')
            ->first();

        if (!$tutorCompetidor) {
            return response()->json([
                'success' => false,
                'message' => 'Tutor no encontrado para este competidor.'
            ], 404);
        }

        // Obtener los datos del tutor
        $tutor = Tutor::find($tutorCompetidor->tutor_id);

        if (!$tutor) {
            return response()->json([
                'success' => false,
                'message' => 'Tutor no encontrado.'
            ], 404);
        }

        // Obtener la categoría del competidor
        $nivelCategoria = NivelCategoria::find($competidorCompetencia->nivel_categoria_id);
        $categoria = $nivelCategoria ? $nivelCategoria->nombre : 'No especificado';

        // Obtener el periodo del competidor (a partir de la fecha de inscripción)
        $periodo = $competidorCompetencia->fecha_inscripcion ?? 'No especificado';

        // Si el periodo es una fecha válida, extraer solo el año
        if ($periodo !== 'No especificado' && strtotime($periodo)) {
            $periodo = date('Y', strtotime($periodo)); // Obtener solo el año
        }

        // Validar que todos los campos necesarios tengan valor
        $nombrePagador = $tutor->nombres . ' ' . $tutor->apellidos;
        $nombreCompetidor = $competidor->nombres . ' ' . $competidor->apellidos;
        $areaNombre = $area->nombre ?? 'No especificado';
        $montoTotal = $area->costo ?? 0; // Aseguramos que tenga un valor numérico

        if (!$nombrePagador || !$nombreCompetidor || !$montoTotal || !$areaNombre) {
            return response()->json([
                'success' => false,
                'message' => 'Faltan datos esenciales para generar la boleta.'
            ], 400);
        }
        // Cambiar la generación del número de boleta para que sea fijo
$numeroBoleta = 'BOL' . str_pad($competidorId, 5, '0', STR_PAD_LEFT); // Usando el competidor_id como base

        // Datos para generar la boleta
        $boletaData = [
            'numero_boleta' => $numeroBoleta,
            'nombre_pagador' => $nombrePagador,
            'monto_total' => $montoTotal,
            //'periodo' => $periodo,
            'area' => $areaNombre,
            'nombre' => $nombreCompetidor,
            'categoria' => $categoria,
            'competidores' => [
                [
                    'nombre' => $nombreCompetidor,
                    'categoria' => $categoria,
                    'monto' => $montoTotal
                ]
            ]
        ];

        // Retornar los datos de la boleta generada como respuesta
        return response()->json([
            'success' => true,
            'boleta' => $boletaData
        ]);

    } catch (\Exception $e) {
        // Log the error to see the exact issue
        \Log::error('Error generando boleta: ' . $e->getMessage());
        return response()->json([
            'success' => false,
            'message' => 'Error al generar la boleta: ' . $e->getMessage()
        ], 500);
    }
}

}
