<?php

namespace App\Http\Controllers\Api;

use App\Models\NivelCategoria;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class NivelCategoriaController extends Controller
{
    // GET /api/nivel-categorias
    public function index()
{
    try {
        $niveles = NivelCategoria::with(['gradoInicial', 'gradoFinal', 'area'])->get();
        return response()->json($niveles);
    } catch (\Throwable $e) {
        return response()->json([
            'error' => 'Error cargando datos',
            'message' => $e->getMessage(),
            'line' => $e->getLine(),
            'file' => $e->getFile(),
        ], 500);
    }
}


    // GET /api/nivel-categorias/{id}
    public function show($id)
    {
        $nivel = NivelCategoria::with(['gradoInicial', 'gradoFinal', 'area'])->find($id);
        if (!$nivel) {
            return response()->json(['message' => 'Nivel/Categoría no encontrado'], 404);
        }
        return response()->json($nivel);
    }

    // POST /api/nivel-categorias
    public function store(Request $request)
    {
        $validated = $request->validate([
            'grado_id_inicial' => 'required|exists:grado,grado_id',
            'grado_id_final' => 'required|exists:grado,grado_id',
            'area_id' => 'required|exists:area,area_id',
            'nombre' => 'required|string|max:50',
            'descripcion' => 'nullable|string',
            'estado' => 'required|boolean',
        ]);

        $nivel = NivelCategoria::create($validated);
        return response()->json($nivel, 201);
    }

    // PUT /api/nivel-categorias/{id}
    public function update(Request $request, $id)
    {
        $nivel = NivelCategoria::find($id);
        if (!$nivel) {
            return response()->json(['message' => 'Nivel/Categoría no encontrado'], 404);
        }

        $validated = $request->validate([
            'grado_id_inicial' => 'required|exists:grado,grado_id',
            'grado_id_final' => 'required|exists:grado,grado_id',
            'area_id' => 'required|exists:area,area_id',
            'nombre' => 'required|string|max:50',
            'descripcion' => 'nullable|string',
            'estado' => 'required|boolean',
        ]);

        $nivel->update($validated);
        return response()->json($nivel);
    }

    // DELETE /api/nivel-categorias/{id}
    public function destroy($id)
    {
        $nivel = NivelCategoria::find($id);
        if (!$nivel) {
            return response()->json(['message' => 'Nivel/Categoría no encontrado'], 404);
        }

        $nivel->delete();
        return response()->json(['message' => 'Nivel/Categoría eliminado correctamente']);
    }
}
