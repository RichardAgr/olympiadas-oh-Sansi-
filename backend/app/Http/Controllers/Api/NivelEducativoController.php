<?php

namespace App\Http\Controllers\Api;

use App\Models\NivelEducativo;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class NivelEducativoController extends Controller
{
    // GET /api/niveles-educativos
    public function index()
    {
        return response()->json(NivelEducativo::all());
    }

    // GET /api/niveles-educativos/{id}
    public function show($id)
    {
        $nivel = NivelEducativo::find($id);
        if (!$nivel) {
            return response()->json(['message' => 'Nivel educativo no encontrado'], 404);
        }
        return response()->json($nivel);
    }

    // POST /api/niveles-educativos
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:50',
            'abreviatura' => 'required|string|max:20',
            'orden' => 'required|integer',
            'estado' => 'required|boolean',
        ]);

        $nivel = NivelEducativo::create($validated);
        return response()->json($nivel, 201);
    }

    // PUT /api/niveles-educativos/{id}
    public function update(Request $request, $id)
    {
        $nivel = NivelEducativo::find($id);
        if (!$nivel) {
            return response()->json(['message' => 'Nivel educativo no encontrado'], 404);
        }

        $validated = $request->validate([
            'nombre' => 'required|string|max:50',
            'abreviatura' => 'required|string|max:20',
            'orden' => 'required|integer',
            'estado' => 'required|boolean',
        ]);

        $nivel->update($validated);
        return response()->json($nivel);
    }

    // DELETE /api/niveles-educativos/{id}
    public function destroy($id)
    {
        $nivel = NivelEducativo::find($id);
        if (!$nivel) {
            return response()->json(['message' => 'Nivel educativo no encontrado'], 404);
        }

        $nivel->delete();
        return response()->json(['message' => 'Nivel educativo eliminado correctamente']);
    }
}
