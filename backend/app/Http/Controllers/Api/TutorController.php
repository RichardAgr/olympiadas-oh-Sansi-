<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Tutor;

class TutorController extends Controller
{
    public function index(Request $request)
    {
        // Cargar tutores con su relación a competidores desde tabla pivote
        $tutores = Tutor::with('competidores')->get();

        // Mapear al formato esperado por el frontend
        $data = $tutores->map(function ($tutor) {
            return [
                'tutor_id' => $tutor->tutor_id,
                'nombres' => $tutor->nombres,
                'apellidos' => $tutor->apellidos,
                'ci' => $tutor->ci,
                'telefono' => $tutor->telefono,
                'colegio' => 'Colegio temporal', // Luego podés usar $tutor->colegio->nombre ?? ''
                'curso' => 'Curso temporal',     // Luego podés usar $tutor->curso->nombre ?? ''
                'competidores' => $tutor->competidores->count(),
            ];
        });

        return response()->json($data);
    }
}

