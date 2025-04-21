<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Tutor;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\TutoresExport;

class TutorController extends Controller
{
   
    public function index(Request $request)
    {
        $estado = $request->query('estado');
        $busqueda = $request->query('q');

        $tutores = Tutor::with(['competidores.colegio', 'competidores.curso'])
            ->withCount([
                'competidores as competidores_activos' => function ($query) {
                    $query->where('estado', 'Inscrito');
                }
            ]);

        if ($estado && in_array($estado, ['Activo', 'Inactivo'])) {
            $tutores->where('estado', $estado);
        }

        if ($busqueda) {
            $tutores->where(function ($query) use ($busqueda) {
                $query->where('nombres', 'like', '%' . $busqueda . '%')
                      ->orWhere('apellidos', 'like', '%' . $busqueda . '%');
            });
        }

        $tutores = $tutores->get();

        $data = $tutores->map(function ($tutor) {
            $primerCompetidor = $tutor->competidores->first();

            return [
                'tutor_id' => $tutor->tutor_id,
                'nombres' => $tutor->nombres,
                'apellidos' => $tutor->apellidos,
                'ci' => $tutor->ci,
                'telefono' => $tutor->telefono,
                'estado' => $tutor->estado,
                'colegio' => $primerCompetidor?->colegio->nombre ?? 'Sin colegio',
                'curso' => $primerCompetidor?->curso->nombre ?? 'Sin curso',
                'competidores' => $tutor->competidores->count(),
                'competidores_activos' => $tutor->competidores_activos
            ];
        });

        return response()->json($data);
    }

    
    public function actualizarEstadoMasivo(Request $request)
    {
        $request->validate([
            'tutores' => 'required|array',
            'estado' => 'required|in:Activo,Inactivo'
        ]);

        Tutor::whereIn('tutor_id', $request->tutores)
              ->update(['estado' => $request->estado]);

        return response()->json(['mensaje' => 'Estados actualizados correctamente.']);
    }

    
    public function cambiarEstado(Request $request, $id)
    {
        $request->validate([
            'estado' => 'required|in:Activo,Inactivo',
            'motivo' => 'required_if:estado,Inactivo'
        ]);

        $tutor = Tutor::withCount(['competidores as competidores_activos' => function ($q) {
            $q->where('estado', 'Inscrito');
        }])->findOrFail($id);

        if ($request->estado === 'Inactivo' && $tutor->competidores_activos > 0) {
            return response()->json([
                'error' => 'No se pudo deshabilitar: tutor tiene competidores activos.'
            ], 422);
        }

        $tutor->estado = $request->estado;
        $tutor->save();

        return response()->json(['mensaje' => 'Estado actualizado']);
    }

    public function exportar(Request $request)
    {
        $formato = $request->query('formato', 'xlsx');

        if (!in_array($formato, ['xlsx', 'pdf'])) {
            return response()->json(['error' => 'Formato inválido'], 400);
        }

        return Excel::download(new TutoresExport, 'tutores.' . $formato);
    }
}
