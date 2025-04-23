<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Carbon\Carbon;
use App\Models\Notificacion;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;


class NotificacionController extends Controller{
    public function crearNotificacion(Request $request){
        $validator = Validator::make($request->all(), [
            'id_responsable' => 'required|integer|exists:responsable_gestion,responsable_id',
            'id_tutorPrincipal' => 'required|integer|exists:tutor,tutor_id',
            'id_competidor' => 'nullable|integer|exists:competidor,competidor_id',
            'asunto' => 'required|string|max:255',
            'motivo' => 'required|string',
            'estado' => 'integer'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Error de validación',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $notificacion = new Notificacion();
            $notificacion->responsable_id = $request->id_responsable;
            $notificacion->tutor_id = $request->id_tutorPrincipal;
            $notificacion->competidor_id = $request->id_competidor;
            $notificacion->asunto = $request->asunto;
            $notificacion->mensaje = $request->motivo;
            $notificacion->fecha_envio = Carbon::now(); 
            $notificacion->estado = false; // Por defecto activo
            
            $notificacion->save();

            return response()->json([
                'success' => true,
                'message' => 'Notificación creada correctamente',
                'data' => $notificacion
            ], 201); // Created
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al crear la notificación',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
