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

        // Búsqueda por texto
        if ($request->has('search')) {
            $search = strtolower($request->search);
            $query->where(function ($q) use ($search) {
                $q->whereRaw('LOWER(nombres) LIKE ?', ["%{$search}%"])
                  ->orWhereRaw('LOWER(apellidos) LIKE ?', ["%{$search}%"])
                  ->orWhereRaw('LOWER(ci) LIKE ?', ["%{$search}%"]);
            });

            // Búsqueda en relaciones
            $query->orWhereHas('colegio', function ($q) use ($search) {
                $q->whereRaw('LOWER(nombre) LIKE ?', ["%{$search}%"]);
            });

            $query->orWhereHas('ubicacion', function ($q) use ($search) {
                $q->whereRaw('LOWER(departamento) LIKE ?', ["%{$search}%"])
                  ->orWhereRaw('LOWER(provincia) LIKE ?', ["%{$search}%"]);
            });
        }

        // Filtro por curso
        if ($request->has('curso')) {
            $query->whereHas('curso', function ($q) use ($request) {
                $q->where('nombre', $request->curso);
            });
        }

        $query->distinct();

        return response()->json($query->paginate(10));
    }
}

