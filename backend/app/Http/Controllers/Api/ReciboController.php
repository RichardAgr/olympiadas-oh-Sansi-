<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use App\Models\Recibo;
use App\Models\Tutor;

class ReciboController extends Controller{
     public function registrarRecibo(Request $request)
    {
        try {
            // Validar los datos de entrada
            $validator = Validator::make($request->all(), [
                'tutor_id' => 'required|exists:TUTOR,tutor_id',
                'numero_recibo' => 'required|string|max:20|unique:RECIBO,numero_recibo',
                'monto_total' => 'required|numeric|min:0',
                'fecha_emision' => 'required|date',
                'ruta_pdf' => 'required|string',
                'estado' => 'required|string|max:20',
            ], [
                'tutor_id.required' => 'El ID del tutor es obligatorio',
                'tutor_id.exists' => 'El tutor seleccionado no existe',
                'numero_recibo.required' => 'El número de recibo es obligatorio',
                'numero_recibo.unique' => 'El número de recibo ya existe',
                'monto_total.required' => 'El monto total es obligatorio',
                'monto_total.numeric' => 'El monto total debe ser un valor numérico',
                'fecha_emision.required' => 'La fecha de emisión es obligatoria',
                'fecha_emision.date' => 'La fecha de emisión debe ser una fecha válida',
                'ruta_pdf.required' => 'La ruta del PDF es obligatoria',
                'estado.required' => 'El estado es obligatorio',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Error de validación',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Iniciar transacción
            DB::beginTransaction();
            $fechaFormateada = date('Y-m-d', strtotime(str_replace('/', '-', $request->fecha_emision)));
            // Crear el recibo
            $recibo = Recibo::create([
                'tutor_id' => $request->tutor_id,
                'numero_recibo' => $request->numero_recibo,
                'monto_total' => $request->monto_total,
                'fecha_emision' => $fechaFormateada,
                'ruta_pdf' => $request->ruta_pdf,
                'estado' => $request->estado,
            ]);

            // Confirmar transacción
            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Recibo registrado correctamente',
                'data' => $recibo
            ], 201);

        } catch (\Exception $e) {
            // Revertir transacción en caso de error
            DB::rollBack();
            
            Log::error('Error al registrar recibo: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Error al registrar el recibo',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function obtenerRecibosPorTutor($tutorId)
    {
        try {
            $tutor = Tutor::find($tutorId);
            
            if (!$tutor) {
                return response()->json([
                    'success' => false,
                    'message' => 'No se encontró el tutor con ID: ' . $tutorId
                ], 404);
            }

            // Obtener los recibos del tutor con los datos del tutor
            $recibos = Recibo::select(
                    'RECIBO.recibo_id',
                    'RECIBO.numero_recibo',
                    'RECIBO.monto_total',
                    'RECIBO.fecha_emision',
                    'RECIBO.estado',
                    'RECIBO.ruta_pdf',
                    'tutor.nombres',
                    'tutor.apellidos',
                    DB::raw("CONCAT(tutor.nombres, ' ', tutor.apellidos) as nombre_completo")
                )
                ->join('tutor', 'RECIBO.tutor_id', '=', 'tutor.tutor_id')
                ->where('RECIBO.tutor_id', $tutorId)
                ->orderBy('RECIBO.fecha_emision', 'desc')
                ->get();

            // Formatear los datos para la respuesta
            $recibosFormateados = $recibos->map(function ($recibo) {
                return [
                    'recibo_id' => $recibo->recibo_id,
                    'numero_recibo' => $recibo->numero_recibo,
                    'nombre_completo' => $recibo->nombre_completo,
                    'fecha_emision' => $recibo->fecha_emision,
                    'monto_total' => $recibo->monto_total,
                    'estado' => $recibo->estado,
                    'url_pdf' => $recibo->ruta_pdf
                ];
            });

            return response()->json([
                'success' => true,
                'data' => $recibosFormateados,
                'total' => count($recibosFormateados)
            ], 200);

        } catch (\Exception $e) {
            Log::error('Error al obtener recibos por tutor: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener los recibos',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
