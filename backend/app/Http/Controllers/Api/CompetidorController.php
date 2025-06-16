<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Competidor;
use App\Models\CompetidorCompetencia;
use App\Models\TutorCompetidor;
use App\Models\Area;
use App\Models\Tutor;
use App\Models\Competencia;
use App\Models\NivelCategoria;
use Carbon\Carbon;
use Illuminate\Validation\Rule;
use Illuminate\Http\Request;

class CompetidorController extends Controller{
    public function index($competenciaId){
         $competidorIds = CompetidorCompetencia::where('competencia_id', $competenciaId)
        ->pluck('competidor_id')
        ->unique();

    // Obtener competidores filtrando por los IDs obtenidos
    $competidores = Competidor::select('competidor_id', 'nombres', 'apellidos', 'estado')
        ->whereIn('competidor_id', $competidorIds)
        ->get();

    $data = [];

    foreach ($competidores as $competidor) {
        $areas = CompetidorCompetencia::where('competidor_id', $competidor->competidor_id)
            ->where('competidor_competencia.competencia_id', $competenciaId)
            ->join('area', 'competidor_competencia.area_id', '=', 'area.area_id')
            ->pluck('area.nombre')
            ->unique()
            ->implode(', ');

        $data[] = [
            'competidor_id' => $competidor->competidor_id,
            'nombre_completo' => $competidor->nombres . ' ' . $competidor->apellidos,
            'area_competencia' => $areas ?: 'No asignada',
            'estado' => $competidor->estado
        ];
    }

    return response()->json(['data' => $data]);
    }

    public function getDetallesCompetidor($id)    {
        $competidor = Competidor::with([
        'colegio.ubicacion',
        'curso',
        'tutorCompetidores.tutor',
        'competidorCompetencias.area',
        'competidorCompetencias.nivelCategoria',
        'competidorCompetencias.boleta.imagenes'
    ])->find($id);

    if (!$competidor) {
        return response()->json(['error' => 'Competidor no encontrado'], 404);
    }
    $areas = $competidor->competidorCompetencias
        ->pluck('area.nombre')
        ->unique()
        ->filter()
        ->implode(', ');

    $categorias = $competidor->competidorCompetencias
        ->pluck('nivelCategoria.nombre')
        ->unique()
        ->filter()
        ->implode(', ');

    $fechaNacimiento = Carbon::parse($competidor->fecha_nacimiento)->format('d/m/Y');

    // Obtener la ruta de la imagen de la boleta
    $rutaImagen = null;
    foreach ($competidor->competidorCompetencias as $competidorCompetencia) {
        if ($competidorCompetencia->boleta && $competidorCompetencia->boleta->imagenes->isNotEmpty()) {
            $rutaImagen = $competidorCompetencia->boleta->imagenes->first()->ruta_imagen;
            break;
        }
    }

    $inscripciones = [];
    foreach ($competidor->competidorCompetencias as $competidorCompetencia) {
        $inscripciones[] = [
            'area' => $competidorCompetencia->area->nombre ?? 'No asignada',
            'categoria' => $competidorCompetencia->nivelCategoria->nombre ?? 'Sin categoría',
            'fecha_inscripcion' => $competidorCompetencia->fecha_inscripcion ? 
                Carbon::parse($competidorCompetencia->fecha_inscripcion)->format('d/m/Y') : null
        ];
    }

    $informacionCompetidor = [
        'id' => $competidor->competidor_id,
        'nombres' => $competidor->nombres,
        'apellidos' => $competidor->apellidos,
        'ci' => $competidor->ci,
        'fecha_nacimiento' => $fechaNacimiento,
        'colegio' => $competidor->colegio->nombre,
        'curso' => $competidor->curso->nombre,
        'departamento' => $competidor->colegio->ubicacion->departamento,
        'provincia' => $competidor->colegio->ubicacion->provincia,
        'area' => $areas ?: 'No asignada', 
        'categoria' => $categorias ?: 'Sin categoría', 
        'estado' => $competidor->estado,
        'ruta_imagen' => $rutaImagen
    ];

    // Construir la información de los tutores
    $tutores = [];
    foreach ($competidor->tutorCompetidores as $tutorCompetidor) {
        $tutor = $tutorCompetidor->tutor;
        
        $tipo = $tutorCompetidor->nivel_respansabilidad === 'Principal' ? 'Principal' : 'Secundario';
        
        $tutores[] = [
            'id_tutor' => $tutor->tutor_id,
            'tipo' => $tipo,
            'nombre' => $tutor->nombres . ' ' . $tutor->apellidos,
            'relacion' => $tutorCompetidor->realcion_competidor,
            'telefono' => $tutor->telefono,
            'correo' => $tutor->correo_electronico,
        ];
    }

    $response = [
        'informacion_competidor' => $informacionCompetidor,
        'tutores' => $tutores,
    ];

    return response()->json($response);
}

    public function actualizarEstadoCompetidor(Request $request, $id)
    {
        $request->validate([
            'estado' => ['required', Rule::in(['Habilitado', 'Deshabilitado', 'Pendiente'])],
        ]);

        $competidor = Competidor::find($id);

        if (!$competidor) {
            return response()->json([
                'success' => false,
                'message' => 'Competidor no encontrado'
            ], 404);
        }

        // Actualizar el estado del competidor
        $competidor->estado = $request->estado;
        $competidor->save();

        // Devolver respuesta exitosa
        return response()->json([
            'success' => true,
            'message' => 'Estado del competidor actualizado correctamente',
            'data' => [
                'competidor_id' => $competidor->competidor_id,
                'estado' => $competidor->estado
            ]
        ]);
    }

public function obtenerDetallesCompetidor($competenciaId, Request $request){
$competencia = Competencia::find($competenciaId);
    if (!$competencia) {
        return response()->json([
            'success' => false,
            'message' => 'Competencia no encontrada'
        ], 404);
    }

    $query = Competidor::with([
            'colegio', 
            'curso', 
            'ubicacion',
            'tutores' // Cargar todos los tutores
        ])
        ->whereHas('competencias', function ($q) use ($competenciaId) {
            $q->where('competidor_competencia.competencia_id', $competenciaId);
        })
        ->with(['competencias' => function ($q) use ($competenciaId) {
            $q->where('competidor_competencia.competencia_id', $competenciaId);
        }]);

    $competidores = $query->get();

    $result = $competidores->flatMap(function ($competidor) {
        return $competidor->competencias->map(function ($competencia) use ($competidor) {
            $areaNombre = null;
            if (!empty($competencia->pivot->area_id)) {
                $area = Area::find($competencia->pivot->area_id);
                $areaNombre = $area ? $area->nombre : '';
            }

            $tutorPrincipal = $competidor->tutores->where('pivot.nivel_respansabilidad', 'Principal')->first();
            $tutoresSecundarios = $competidor->tutores->where('pivot.nivel_respansabilidad', '!=', 'Principal');
            
            $tutorPrincipalNombre = '';
            $tutoresSecundariosNombres = [];
            
            if ($tutorPrincipal) {
                $tutorPrincipalNombre = $tutorPrincipal->nombres . ' ' . $tutorPrincipal->apellidos;
            }
            
            foreach ($tutoresSecundarios as $tutorSec) {
                $tutoresSecundariosNombres[] = $tutorSec->nombres . ' ' . $tutorSec->apellidos;
            }

            return [
                'id' => $competidor->competidor_id,
                'nombre' => $competidor->nombres,
                'apellido' => $competidor->apellidos,
                'ci' => $competidor->ci,
                'colegio' => $competidor->colegio->nombre ?? '',
                'curso' => $competidor->curso->grado->nombre ?? '',
                'estado' => $competidor->estado ?? '',
                'area' => $areaNombre, 
                'departamento' => $competidor->ubicacion->departamento ?? '', 
                'provincia' => $competidor->ubicacion->provincia ?? '',
                'fecha' => $competencia->pivot->fecha_inscripcion ?? '',
                'competencia_id' => $competencia->competencia_id,
                'tutor_principal' => $tutorPrincipalNombre, 
                'tutores_secundarios' => implode(', ', $tutoresSecundariosNombres),
                'tutor' => $tutorPrincipalNombre ?: (count($tutoresSecundariosNombres) > 0 ? $tutoresSecundariosNombres[0] : 'Sin tutor'),
            ];
        });
    });

    return response()->json($result->values());
}

    public function update(Request $request, $id)
    {
        $request->validate([
            'nombres' => 'required|string|max:255',
            'apellidos' => 'required|string|max:255',
            'ci' => 'required|numeric',
            'fecha_nacimiento' => 'required|date|before:today',
            'colegio_id' => 'required|exists:colegio,colegio_id',
            'curso_id' => 'required|exists:curso,curso_id',
            'departamento' => 'required|string|max:100',
            'provincia' => 'required|string|max:100',
            'areas' => 'required|array|min:1',
            'areas.*' => 'exists:area,area_id'
        ]);

        $competidor = Competidor::find($id);
        if (!$competidor) {
            return response()->json(['error' => 'Competidor no encontrado'], 404);
        }

        // Actualizar datos personales y académicos
        $competidor->nombres = $request->nombres;
        $competidor->apellidos = $request->apellidos;
        $competidor->ci = $request->ci;
        $competidor->fecha_nacimiento = $request->fecha_nacimiento;
        $competidor->colegio_id = $request->colegio_id;
        $competidor->curso_id = $request->curso_id;
        $competidor->save();

        // Actualizar ubicación del colegio si aplica
        $colegio = $competidor->colegio;
        if ($colegio && $colegio->ubicacion) {
            $colegio->ubicacion->departamento = $request->departamento;
            $colegio->ubicacion->provincia = $request->provincia;
            $colegio->ubicacion->save();
        }

        // Eliminar áreas previas
        CompetidorCompetencia::where('competidor_id', $id)->delete();

        // Asignar nuevas áreas con valores dinámicos
        foreach ($request->areas as $areaId) {
            $competencia = \App\Models\Competencia::latest()->first();
            $nivelCategoria = \App\Models\NivelCategoria::where('area_id', $areaId)->first();

            if (!$competencia || !$nivelCategoria) {
                continue; // O podrías lanzar un error aquí si es obligatorio
            }

            CompetidorCompetencia::create([
                'competidor_id' => $id,
                'area_id' => $areaId,
                'competencia_id' => $competencia->competencia_id,
                'nivel_categoria_id' => $nivelCategoria->nivel_categoria_id,
                'fecha_inscripcion' => now()
            ]);
        }

        return response()->json([
            'message' => 'Cambios guardados con éxito',
            'competidor_id' => $competidor->competidor_id
        ]);
    }

}
