<?php

namespace App\Http\Controllers\Api;

use App\Models\Grado;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class GradoController extends Controller
{
    // GET /api/grados
    public function index()
{
    return Grado::all(); // sin la relación
}


    // GET /api/grados/{id}
    public function show($id)
    {
        $grado = Grado::with('nivelEducativo')->find($id);
        if (!$grado) {
            return response()->json(['message' => 'Grado no encontrado'], 404);
        }
        return response()->json($grado);
    }

    // POST /api/grados
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nivel_educativo_id' => 'required|exists:nivel_educativo,nivel_educativo_id',
            'nombre' => 'required|string|max:50',
            'abreviatura' => 'required|string|max:20',
            'orden' => 'required|integer',
            'estado' => 'required|boolean',
        ]);

        $grado = Grado::create($validated);
        return response()->json($grado, 201);
    }

    // PUT /api/grados/{id}
    public function update(Request $request, $id)
    {
        $grado = Grado::find($id);
        if (!$grado) {
            return response()->json(['message' => 'Grado no encontrado'], 404);
        }

        $validated = $request->validate([
            'nivel_educativo_id' => 'required|exists:nivel_educativo,nivel_educativo_id',
            'nombre' => 'required|string|max:50',
            'abreviatura' => 'required|string|max:20',
            'orden' => 'required|integer',
            'estado' => 'required|boolean',
        ]);

        $grado->update($validated);
        return response()->json($grado);
    }

    // DELETE /api/grados/{id}
    public function destroy($id)
    {
        $grado = Grado::find($id);
        if (!$grado) {
            return response()->json(['message' => 'Grado no encontrado'], 404);
        }

        $grado->delete();
        return response()->json(['message' => 'Grado eliminado correctamente']);
    }
}

