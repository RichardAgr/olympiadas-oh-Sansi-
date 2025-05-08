<?php

namespace App\Http\Controllers\api\UsuarioTutor;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Competidor;
use App\Models\Ubicacion;

class CompetidorController extends Controller
{
    public function editarCompetidor(Request $request, $id_competidor)
{
    // ✅ Validación de los datos
    $request->validate([
        'nombres' => 'required|string|max:100',
        'apellidos' => 'required|string|max:100',
        'ci' => 'required|string|max:20',
        'fechaNacimiento' => 'required|date',
        'departamento' => 'required|string|max:100',
        'provincia' => 'required|string|max:100',
    ]);

    // ✅ Buscar competidor por ID
    $competidor = Competidor::find($id_competidor);

    if (!$competidor) {
        return response()->json(['message' => 'Competidor no encontrado'], 404);
    }

    // ✅ Actualizar el competidor
    $competidor->nombres = $request->input('nombres');
    $competidor->apellidos = $request->input('apellidos');
    $competidor->ci = $request->input('ci');
    $competidor->fecha_nacimiento = $request->input('fechaNacimiento');
    $competidor->save();

    // ✅ Actualizar la ubicación
    $ubicacion = $competidor->ubicacion;

    if (!$ubicacion) {
        return response()->json(['message' => 'Ubicación no encontrada'], 404);
    }

    $ubicacion->departamento = $request->input('departamento');
    $ubicacion->provincia = $request->input('provincia');
    $ubicacion->save();

    return response()->json(['message' => 'Competidor y ubicación actualizados correctamente']);
}

    
}
