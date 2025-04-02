<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Area;

class AreaController extends Controller
{
    /**
     * Mostrar todas las áreas de competencia.
     * GET /api/areas
     */
    public function index()
    {
        $areas = Area::all();
        return response()->json($areas, 200);
    }

    /**
     * Registrar una nueva área de competencia.
     * POST /api/areas
     */
    public function store(Request $request)
    {
        // Validamos la entrada
        $request->validate([
            'nombre' => 'required|string|max:50|unique:area,nombre',
            'descripcion' => 'required|string',
            'costo' => 'required|numeric|min:0',
            'foto' => 'nullable|string',
            'estado' => 'nullable|boolean' // opcional, por defecto será true
        ]);

        // Creamos el registro
        $area = Area::create([
            'nombre' => $request->nombre,
            'descripcion' => $request->descripcion,
            'costo' => $request->costo,
            'foto' => $request->foto ?? '',
            'estado' => $request->estado ?? true
        ]);

        // Devolvemos respuesta de éxito
        return response()->json([
            'message' => 'Área registrada con éxito ',
            'area' => $area
        ], 201);
    }

    /**
     * Mostrar un área específica.
     * GET /api/areas/{id}
     */
    public function show($id)
    {
        $area = Area::findOrFail($id);
        return response()->json($area, 200);
    }

    /**
     * Modificar un área existente.
     * PUT /api/areas/{id}
     */
    public function update(Request $request, $id)
    {
        $area = Area::findOrFail($id);

        // Validar cambios
        $request->validate([
            'nombre' => 'required|string|max:50|unique:area,nombre,' . $id . ',area_id',
            'descripcion' => 'required|string',
            'costo' => 'required|numeric|min:0',
            'foto' => 'nullable|string',
            'estado' => 'required|boolean'
        ]);

        // Actualizamos el área
        $area->update($request->all());

        return response()->json([
            'message' => 'Área actualizada correctamente ',
            'area' => $area
        ]);
    }

    /* public function destroy($id)
        {
    $area = Area::findOrFail($id);

    // Verifica si tiene relaciones activas
    if ($area->categorias()->exists() || $area->inscripciones()->exists()) {
        return response()->json([
            'message' => 'No se puede eliminar esta área porque tiene categorías o inscripciones activas asociadas.'
        ], 409); // Código 409 = conflicto
    }

    $area->delete();

    return response()->json([
        'message' => 'Área eliminada exitosamente'
    ]);
    }

     */
    public function destroy($id)
    {
        $area = Area::findOrFail($id);
        $area->delete();

        return response()->json([
            'message' => 'Área eliminada exitosamente '
        ]);
    }


}

