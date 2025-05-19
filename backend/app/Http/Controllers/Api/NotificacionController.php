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
    public function VerNotificacionesTutor(Request $request, $id_tutor)
{
    $notificaciones = Notificacion::with(['responsable', 'competidor', 'tutor'])
        ->where('tutor_id', $id_tutor)
        ->get();

    $resultado = $notificaciones->map(function ($notificacion) {
        // Determinar destinatario
        if ($notificacion->competidor_id !== null) {
            $destinatario = [
                'tipo' => 'competidor',
                'competidor' => [
                    'competidor_id' => optional($notificacion->competidor)->competidor_id,
                    'nombres' => optional($notificacion->competidor)->nombres,
                    'apellidos' => optional($notificacion->competidor)->apellidos,
                ]
            ];
        } else {
            $destinatario = [
                'tipo' => 'tutor',
                'tutor' => [
                    'tutor_id' => optional($notificacion->tutor)->tutor_id,
                    'nombres' => optional($notificacion->tutor)->nombres,
                    'apellidos' => optional($notificacion->tutor)->apellidos,
                ]
            ];
        }

        return [
            'notificacion_id' => $notificacion->notificacion_id,
            'responsableGestion' => [
                'responsable_id' => optional($notificacion->responsable)->responsable_id,
                'nombres' => optional($notificacion->responsable)->nombres,
                'apellidos' => optional($notificacion->responsable)->apellidos,
            ],
            'destinatario' => $destinatario,
            'fechaEnvio' => optional($notificacion->fecha_envio)->toDateString(),
            'asunto' => $notificacion->asunto,
            'mensaje' => $notificacion->mensaje,
            'estado' => (bool) $notificacion->estado,
        ];
    });

    return response()->json([
        'success' => true,
        'message' => 'Notificaciones del tutor obtenidas correctamente',
        'data' => $resultado
    ], 200);
}
public function cambiarEstadoNotificacion(Request $request, $id_tutor, $id_notificacion)
{
    $notificacion = Notificacion::where('tutor_id', $id_tutor)
        ->where('notificacion_id', $id_notificacion)
        ->first();

    if (!$notificacion) {
        return response()->json([
            'success' => false,
            'message' => 'Notificación no encontrada',
        ], 404);
    }

    if ($notificacion->estado) {
        return response()->json([
            'success' => false,
            'message' => 'La notificación ya está en estado leído',
        ], 400);
    }

    // Solo cambiamos si el estado aún no era leído (false)
    $notificacion->estado = true;
    $notificacion->save();

    return response()->json([
        'success' => true,
        'message' => 'Estado de la notificación actualizado correctamente',
        'data' => $notificacion
    ], 200);
}
public function contarNotificacionesActivas($id_tutor)
{
    $count = Notificacion::where('tutor_id', $id_tutor)
                        ->where('estado', false)
                        ->count();

    return response()->json([
        'success' => true,
        'message' => 'Conteo de notificaciones activas obtenido correctamente',
        'data' => [
            'total_activas' => $count
        ]
    ], 200);
}
}
