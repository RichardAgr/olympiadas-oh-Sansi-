<?php

namespace App\Http\Controllers;

use App\Models\Competencia;
use Illuminate\Http\Request;

class CompetenciaController extends Controller
{
    public function store(Request $request)
    {
        // Validación para los campos requeridos
        $validated = $request->validate([
            'fecha_inicio' => 'required|date',  // Validación para fecha_inicio
            'nombre_competencia' => 'nullable|string|max:255', // Validación opcional para nombre_competencia
            'descripcion' => 'nullable|string', // Validación opcional para descripcion
            'estado' => 'nullable|integer', // Validación opcional
        ]);

        // Establecemos el valor predeterminado para el nombre de la competencia si no se proporciona
        $nombreCompetencia = $request->input('nombre_competencia', 'Competencia Predeterminada');
        // Establecemos el valor predeterminado para la descripción si no se proporciona
        $descripcion = $request->input('descripcion', 'Descripción no proporcionada');
        // Establecemos el valor predeterminado para el estado si no se proporciona
        $estado = $request->input('estado', '1');

        // Creación de la competencia con los valores proporcionados o predeterminados
        $competencia = Competencia::create([
            'nombre_competencia' => $nombreCompetencia,
            'descripcion' => $descripcion,  // Aseguramos que descripción sea incluida
            'fecha_inicio' => $request->fecha_inicio,
            'estado' => $estado,
        ]);

        // Responder con la competencia creada
        return response()->json($competencia, 201);
    }
}
