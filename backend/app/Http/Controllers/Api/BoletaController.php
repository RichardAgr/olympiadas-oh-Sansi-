<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ImagenBoleta;
use App\Models\Boleta;
use App\Models\Recibo;
use App\Models\ReciboDetalle;
use App\Models\Tutor;
use App\Models\CompetidorCompetencia;
use App\Models\TutorCompetidor;
use App\Models\Competidor;
use App\Models\NivelCategoria;
use App\Http\Resources\PagoCollection;
use App\Models\Area;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use Carbon\Carbon;


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
        $numeroBoleta = strval(rand(1000000, 9999999));



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

public function procesarPagoOCR(Request $request){
        $validator = Validator::make($request->all(), [
            'tutor_id' => 'required|integer|exists:tutor,tutor_id',
            'fechaPago' => 'required|string',
            'imageUrl' => 'required|string',
            'montoPagado' => 'required|string',
            'nombreCompleto' => 'required|string|max:100',
            'numeroComprobante' => 'required|string|max:50',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Error de validación',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            DB::beginTransaction();

            // 1. Verificar si existe el recibo con el número proporcionado
            $recibo = Recibo::where('numero_recibo', $request->numeroComprobante)
                           ->where('estado', '!=', 'Pagado')
                           ->first();

            if (!$recibo) {
                DB::rollBack();
                return response()->json([
                    'success' => false,
                    'message' => 'No se encontró un recibo pendiente con el número: ' . $request->numeroComprobante
                ], 404);
            }

            // 2. Crear registro en la tabla boleta
            $boleta = new Boleta();
            $boleta->tutor_id = $request->tutor_id;
            $boleta->recibo_id = $recibo->recibo_id;
            $boleta->numero_boleta = $request->numeroComprobante;
            $boleta->nombre_pagador = $request->nombreCompleto;
            $boleta->monto_total = floatval(str_replace(',', '.', $request->montoPagado));
            $boleta->fecha_pago = Carbon::createFromFormat('d-m-Y', $request->fechaPago)->format('Y-m-d');
            $boleta->estado = true;
            $boleta->save();

            // 3. Crear registro en la tabla imagen_boleta
            $imagenBoleta = new ImagenBoleta();
            $imagenBoleta->boleta_id = $boleta->boleta_id;
            $imagenBoleta->ruta_imagen = $request->imageUrl;
            $imagenBoleta->fecha_subida = now();
            $imagenBoleta->estado = true;
            $imagenBoleta->save();

            $recibo->estado = 'Pagado';
            $recibo->save();

            // 5. Relacionar la boleta con los competidores que tienen ese número de recibo
            $this->actualizarInscripcionesCompetidores($recibo->recibo_id, $boleta->boleta_id);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Pago procesado correctamente',
                'data' => [
                    'boleta_id' => $boleta->boleta_id,
                    'recibo_id' => $recibo->recibo_id
                ]
            ], 200);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error al procesar pago: ' . $e->getMessage());
            Log::error($e->getTraceAsString());
            
            return response()->json([
                'success' => false,
                'message' => 'Error al procesar el pago',
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

     private function actualizarInscripcionesCompetidores($reciboId, $boletaId)
    {
        try {

            $detallesRecibo = ReciboDetalle::where('recibo_id', $reciboId)->get();
            
            if ($detallesRecibo->isEmpty()) {
                Log::warning("No se encontraron detalles para el recibo ID: {$reciboId}");
                return;
            }

            foreach ($detallesRecibo as $detalle) {
                // Actualizar el estado del detalle del recibo
                $detalle->estado = 'Pagado';
                $detalle->save();
                
                // Buscar todas las inscripciones del competidor que no tengan boleta asignada
                $inscripciones = CompetidorCompetencia::where('competidor_id', $detalle->competidor_id)
                                                     ->whereNull('boleta_id')
                                                     ->get();
                
                if ($inscripciones->isEmpty()) {
                    Log::info("No se encontraron inscripciones pendientes para el competidor ID: {$detalle->competidor_id}");
                    continue;
                }
                
                // Actualizar cada inscripción con el ID de la boleta
                foreach ($inscripciones as $inscripcion) {
                    $inscripcion->boleta_id = $boletaId;
                    $inscripcion->recibo_detalle_id = $detalle->recibo_detalle_id;
                    $inscripcion->save();
                    
                    Log::info("Inscripción ID: {$inscripcion->competidor_competencia_id} actualizada con boleta ID: {$boletaId}");
                }
            }
            
            Log::info("Todas las inscripciones relacionadas con el recibo ID: {$reciboId} han sido actualizadas");
            
        } catch (\Exception $e) {
            Log::error("Error al actualizar inscripciones: " . $e->getMessage());
            throw $e; 
        }
    }
}
