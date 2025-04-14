<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class CompetidorController extends Controller
{
    public function index(Request $request)
{
    $query = \App\Models\Competidor::query();

    // Búsqueda por texto
    if ($request->has('search')) {
        $search = strtolower($request->search);
        $query->where(function ($q) use ($search) {
            $q->whereRaw('LOWER(nombres) LIKE ?', ["%{$search}%"])
              ->orWhereRaw('LOWER(apellidos) LIKE ?', ["%{$search}%"])
              ->orWhereRaw('LOWER(colegio) LIKE ?', ["%{$search}%"])
              ->orWhereRaw('LOWER(departamento) LIKE ?', ["%{$search}%"])
              ->orWhereRaw('LOWER(provincia) LIKE ?', ["%{$search}%"]);
        });
    }

    // Filtro por curso
    if ($request->has('curso')) {
        $query->where('curso', $request->curso);
    }

    // Quitar duplicados
    $query->distinct();

    // Paginación
    return response()->json($query->paginate(10));
}

}
