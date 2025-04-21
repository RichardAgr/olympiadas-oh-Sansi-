<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Competidor;
use App\Models\Area;

class CompetidorController extends Controller
{
    public function index(Request $request)
    {
        // Cargar relaciones necesarias, incluyendo competencias para acceder al pivot
        $query = Competidor::with(['colegio', 'curso', 'ubicacion', 'competencias']);

        // Filtro de texto
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

        // Filtro por curso
        if ($request->filled('curso') && strtolower($request->curso) !== 'todos los cursos') {
            $query->whereHas('curso', function ($q) use ($request) {
                $q->where('nombre', $request->curso);
            });
        }

        $competidores = $query->get();

        // Armar respuesta para el frontend
        $result = $competidores->flatMap(function ($competidor) {
            return $competidor->competencias->map(function ($competencia) use ($competidor) {
                // Buscar área según el area_id en la tabla pivote
                $areaNombre = null;
                if (!empty($competencia->pivot->area_id)) {
                    $area = Area::find($competencia->pivot->area_id);
                    $areaNombre = $area ? $area->nombre : '';
                }

                return [
                    'nombre' => $competidor->nombres,
                    'apellido' => $competidor->apellidos,
                    'ci' => $competidor->ci,
                    'colegio' => $competidor->colegio->nombre ?? '',
                    'curso' => $competidor->curso->nombre ?? '',
                    'estado' => $competidor->estado ?? '',
                    'area' => $areaNombre, // <- este es el nombre del area
                    'fecha' => $competencia->pivot->fecha_inscripcion ?? '',
                ];
            });
        });

        return response()->json($result->values()); 
    }
}
