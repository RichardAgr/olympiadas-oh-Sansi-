<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Tutor;

class TutorController extends Controller
{
    public function index(Request $request)
    {
        // Cargar tutores con sus competidores Y sus relaciones colegio/curso
        $tutores = Tutor::with(['competidores.colegio', 'competidores.curso'])->get();

        // Formatear para el frontend
        $data = $tutores->map(function ($tutor) {
            $primerCompetidor = $tutor->competidores->first();

            return [
                'tutor_id' => $tutor->tutor_id,
                'nombres' => $tutor->nombres,
                'apellidos' => $tutor->apellidos,
                'ci' => $tutor->ci,
                'telefono' => $tutor->telefono,
                'colegio' => $primerCompetidor?->colegio->nombre ?? 'Sin colegio',
                'curso' => $primerCompetidor?->curso->nombre ?? 'Sin curso',
                'competidores' => $tutor->competidores->count(),
            ];
        });

        return response()->json($data);
    }
}

