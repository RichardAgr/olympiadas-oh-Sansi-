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
use App\Models\Competidor;
use App\Models\ReciboDetalle;

class ReciboController extends Controller{
     public function registrarRecibo(Request $request){
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

 public function registrarReciboInscripcionManual(Request $request){
    try {
        $validator = Validator::make($request->all(), [
            'tutor_id' => 'required|exists:TUTOR,tutor_id',
            'competidor_ci' => 'required|exists:competidor,ci',
            'numero_recibo' => 'required|string|max:20|unique:RECIBO,numero_recibo',
            'monto_total' => 'required|numeric|min:0',
            'fecha_emision' => 'required|date',
            'ruta_pdf' => 'required|string',
            'estado' => 'required|string|max:20',
        ], [
            'tutor_id.required' => 'El ID del tutor es obligatorio',
            'tutor_id.exists' => 'El tutor seleccionado no existe',
            'competidor_ci.required' => 'El CI del competidor es obligatorio',
            'competidor_ci.exists' => 'El competidor con el CI proporcionado no existe',
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

        $competidor = Competidor::where('ci', $request->competidor_ci)->first();
        
        if (!$competidor) {
            return response()->json([
                'success' => false,
                'message' => 'No se encontró el competidor con el CI proporcionado',
            ], 404);
        }

        DB::beginTransaction();
        
        // Formatear la fecha si es necesario
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
        $reciboDetalle = ReciboDetalle::create([
            'recibo_id' => $recibo->recibo_id,
            'competidor_id' => $competidor->competidor_id,
            'estado' => 'Pendiente' 
        ]);

        DB::commit();

        $responseData = [
            'recibo' => $recibo,
            'detalle' => $reciboDetalle,
            'competidor' => [
                'id' => $competidor->competidor_id,
                'nombre_completo' => $competidor->nombres . ' ' . $competidor->apellidos,
                'ci' => $competidor->ci
            ]
        ];

        return response()->json([
            'success' => true,
            'message' => 'Recibo registrado y asociado al competidor correctamente',
            'data' => $responseData
        ], 201);

    } catch (\Exception $e) {
        // Revertir transacción en caso de error
        DB::rollBack();
        
        Log::error('Error al registrar recibo: ' . $e->getMessage());
        Log::error($e->getTraceAsString());
        
        // Determinar si es un error de base de datos
        $errorMessage = 'Error al registrar el recibo';
        $statusCode = 500;
        
        // Personalizar mensaje para errores comunes
        if ($e instanceof \Illuminate\Database\QueryException) {
            // Errores específicos de base de datos
            if (strpos($e->getMessage(), 'Duplicate entry') !== false) {
                $errorMessage = 'Ya existe un registro con estos datos';
                $statusCode = 409; // Conflict
            } elseif (strpos($e->getMessage(), 'foreign key constraint fails') !== false) {
                $errorMessage = 'Error de integridad referencial. Verifique que los IDs proporcionados existan';
                $statusCode = 422; // Unprocessable Entity
            }
        }
        
        return response()->json([
            'success' => false,
            'message' => $errorMessage,
            'error' => config('app.debug') ? $e->getMessage() : 'Ocurrió un error en el servidor'
        ], $statusCode);
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
