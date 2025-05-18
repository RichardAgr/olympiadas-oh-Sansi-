<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Video;
use Carbon\Carbon; 
use Illuminate\Validation\ValidationException;

class VideoController extends Controller
{
    public function crearVideo(Request $request)
{
    try {
        $validated = $request->validate([
            'tipo_video' => 'required|in:manual,excel,boleta',
            'url_video' => 'required|string',
            'fecha_creacion' => 'required|date_format:m-d-Y',
        ]);
    } catch (ValidationException $e) {
        // Devolver JSON con errores y código 422
        return response()->json([
            'message' => 'Error de validación',
            'errors' => $e->errors(),
        ], 422);
    }

    // Convertir la fecha al formato Y-m-d para guardar en la BD
    $fecha = Carbon::createFromFormat('m-d-Y', $validated['fecha_creacion'])->format('Y-m-d');

    // Actualizar o crear el video basado solo en tipo_video
    $video = Video::updateOrCreate(
        ['tipo_video' => $validated['tipo_video']],
        [
            'url_video' => $validated['url_video'],
            'fecha_creacion' => $fecha,
            'estado' => true,
        ]
    );

    // Retornar respuesta JSON con código 201 (creado)
    return response()->json([
        'message' => 'Video created successfully',
        'data' => $video,
    ], 201);
}
public function mostrarDetalleVideo(Request $request)
{
     $tipos_validos = ['manual', 'excel', 'boleta'];

    // Obtener todos los videos que coincidan con esos tipos
    $videos = Video::whereIn('tipo_video', $tipos_validos)->get();

    // Armar un array con los videos indexados por tipo_video para facilitar acceso
    $result = [];

    foreach ($tipos_validos as $tipo) {
        $video = $videos->firstWhere('tipo_video', $tipo);
        if ($video) {
            $result[$tipo] = $video;
        }
    }

    if (empty($result)) {
        return response()->json([
            'message' => 'No hay videos disponibles',
            'data' => []
        ], 404);
    }

    return response()->json([
        'message' => 'Videos encontrados',
        'data' => $result,
    ]);

}
public function eliminarVideo($tipo_video)
{
    $tipos_validos = ['manual', 'excel', 'boleta'];

    // Validar tipo_video
    if (!in_array($tipo_video, $tipos_validos)) {
        return response()->json([
            'message' => 'Tipo de video inválido. Debe ser manual, excel o boleta.'
        ], 422);
    }

    // Buscar video por tipo_video
    $video = Video::where('tipo_video', $tipo_video)->first();

    if (!$video) {
        return response()->json([
            'message' => "No se encontró video con tipo: {$tipo_video}"
        ], 404);
    }

    // Eliminar video
    $video->delete();

    return response()->json([
        'message' => "Video con tipo {$tipo_video} eliminado correctamente."
    ]);

}
}
