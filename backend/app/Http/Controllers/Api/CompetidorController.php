<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Competidor;

class CompetidorController extends Controller
{
    public function index(Request $request)
    {
        $query = Competidor::with(['colegio', 'curso', 'ubicacion']);

        // Búsqueda por nombre, apellido, CI, colegio, departamento o provincia
        if ($request->has('search')) {
            $search = strtolower($request->search);

            $query->where(function ($q) use ($search) {
                $q->whereRaw('LOWER(nombres) LIKE ?', ["%{$search}%"])
                  ->orWhereRaw('LOWER(apellidos) LIKE ?', ["%{$search}%"])
                  ->orWhereRaw('LOWER(ci) LIKE ?', ["%{$search}%"]);
            });

            $query->orWhereHas('colegio', function ($q) use ($search) {
                $q->whereRaw('LOWER(nombre) LIKE ?', ["%{$search}%"]);
            });

            $query->orWhereHas('ubicacion', function ($q) use ($search) {
                $q->whereRaw('LOWER(departamento) LIKE ?', ["%{$search}%"])
                  ->orWhereRaw('LOWER(provincia) LIKE ?', ["%{$search}%"]);
            });
        }

        if ($request->filled('curso') && strtolower($request->curso) !== 'todos los cursos') {
            $query->whereHas('curso', function ($q) use ($request) {
                $q->where('nombre', $request->curso);
            });
        }

        $query->distinct();

        //Formato plano para frontend
        $result = $query->get()->map(function ($c) {
            return [
                'nombre' => $c->nombres ?? '',
                'apellido' => $c->apellidos ?? '',
                'colegio' => $c->colegio->nombre ?? '',
                'departamento' => $c->ubicacion->departamento ?? '',
                'provincia' => $c->ubicacion->provincia ?? '',
                'curso' => $c->curso->nombre ?? '',
            ];
        });

        return response()->json($result);
    }
}


