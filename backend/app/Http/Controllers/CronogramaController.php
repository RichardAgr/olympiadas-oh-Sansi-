<?php

namespace App\Http\Controllers;

use App\Models\Cronograma;
use App\Models\Competencia;
use Illuminate\Http\Request;
use App\Models\Area;

class CronogramaController extends Controller
{
    /**
     * Crear un nuevo cronograma.
     */
    public function store(Request $request)
{
    // Validación de los datos
    $request->validate([
        'area_id' => 'required|exists:area,area_id', // Validamos que el area_id exista
        'fecha_inicio' => 'required|date',
        'fecha_fin' => 'required|date|after_or_equal:fecha_inicio',
        'tipo_evento' => 'required|string',
        'nombre_evento' => 'required|string|max:255',
        'descripcion' => 'nullable|string',
        'anio_olimpiada' => 'required|integer|min:1900|max:2100',
    ]);

    try {
        // Aseguramos que el area_id es el mismo que competencia_id
        $competencia_id = $request->area_id;  // Usamos area_id como competencia_id
        // Establecer un valor predeterminado para la descripción si no se proporciona
        $descripcion = $request->input('descripcion', 'Descripción no proporcionada'); // Valor predeterminado


        // Crear el cronograma
        $cronograma = Cronograma::create([
            'competencia_id' => $competencia_id,  // Usamos area_id como competencia_id
            'area_id' => $request->area_id,  // Usamos el valor de area_id
            'fecha_inicio' => $request->fecha_inicio,
            'fecha_fin' => $request->fecha_fin,
            'tipo_evento' => $request->tipo_evento,
            'nombre_evento' => $request->nombre_evento,
            'descripcion' => $request->descripcion,
            'anio_olimpiada' => $request->anio_olimpiada,
        ]);
        $competencia = Competencia::find($request->competencia_id);
if (!$competencia) {
    return response()->json(['message' => 'La competencia no existe.'], 400);
}

        return response()->json($cronograma, 201);
    } catch (\Exception $e) {
        return response()->json(['message' => 'Error al guardar la fecha', 'error' => $e->getMessage()], 400);
    }
}}
