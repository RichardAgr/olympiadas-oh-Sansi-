<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Tutor;
use App\Models\Competidor;
use App\Models\Competencia;
use App\Models\TutorCompetidor;
use App\Models\Colegio;
use App\Models\Curso;
use App\Models\Ubicacion;
use App\Models\Recibo;
use App\Models\Boleta;
use App\Models\NivelCategoria;
use App\Models\CompetidorCompetencia;
use App\Models\Area;
use App\Http\Resources\CompetidoresTutorResource;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class TutorController extends Controller{
public function competidoresTutor($id){
    try {
        $tutor = Tutor::find($id);
        if (!$tutor) {
            return response()->json([
                'success' => false,
                'message' => 'Tutor no encontrado'
            ], 404);
        }

        $competidores = Competidor::with([
            'colegio:colegio_id,nombre',
            'curso:curso_id,nombre,grado_id',
            'curso.grado:grado_id,nombre',
            'competidorCompetencias.area:area_id,nombre',
            'competidorCompetencias.nivelCategoria:nivel_categoria_id,nombre'
        ])
        ->whereHas('tutores', function($query) use ($id) {
            $query->where('tutor_competidor.tutor_id', $id);
        })
        ->get();

        $competidoresFormateados = $competidores->map(function ($competidor) {
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

            return [
                'competidor_id' => $competidor->competidor_id,
                'nombre_completo' => $competidor->nombres . ' ' . $competidor->apellidos,
                'colegio' => $competidor->colegio->nombre ?? 'Sin colegio',
                'area' => $areas ?: 'No asignada',
                'categoria' => $categorias ?: 'Sin categoría',
                'curso' => $competidor->curso->nombre ?? 'Sin curso',
                'grado' => $competidor->curso->grado->nombre ?? 'Sin grado',
                'estado' => $competidor->estado ?? 'Desconocido'
            ];
        });

        return response()->json([
            'data' => $competidoresFormateados
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Error al obtener los competidores del tutor',
            'error' => $e->getMessage()
        ], 500);
    }    
}



public function obtenerInformacionTutores($competenciaId,Request $request){
    try {
        // Validar que la competencia existe
        if (!Competencia::where('competencia_id', $competenciaId)->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'Competencia no encontrada'
            ], 404);
        }

        $tutores = Tutor::select([
                'tutor.tutor_id',
                'tutor.nombres',
                'tutor.apellidos',
                'tutor.ci',
                'tutor.telefono',
                'tutor.correo_electronico as correo',
                'tutor.estado',
                'tutor.created_at'
            ])
            ->where('tutor.competencia_id', $competenciaId) // Filtrar por competencia
            ->whereNotNull('tutor.password') // AGREGAR: Solo tutores con cuenta (que tienen contraseña)
            ->where('tutor.password', '!=', '') // AGREGAR: Asegurar que la contraseña no esté vacía
            ->withCount(['competidores' => function ($query) {
            }])
            ->withCount(['competidores as competidores_habilitados_count' => function ($query) {
                $query->where('competidor.estado', 'Habilitado');
            }])
            ->withCount(['competidores as competidores_deshabilitados_count' => function ($query) {
                $query->where('competidor.estado', 'Deshabilitado');
            }])
            ->withCount(['competidores as competidores_pendientes_count' => function ($query) {
                $query->where('competidor.estado', 'Pendiente');
            }]);

        // Ordenar resultados
        $ordenarPor = $request->input('ordenar_por', 'tutor_id');
        $orden = $request->input('orden', 'asc');
        $tutores->orderBy($ordenarPor, $orden);

        // Obtener todos los resultados
        $tutoresResultados = $tutores->get();
        $tutoresFormateados = $tutoresResultados->map(function ($tutor) {
            $estadoFormateado = $tutor->estado ? 'activo' : 'inactivo';
            $fechaRegistro = $tutor->created_at ? Carbon::parse($tutor->created_at)->format('d/m/Y') : null;

            return [
                'tutor_id' => $tutor->tutor_id,
                'nombres' => $tutor->nombres,
                'apellidos' => $tutor->apellidos,
                'ci' => $tutor->ci,
                'competidores' => $tutor->competidores_count,
                'competidores_habilitados' => $tutor->competidores_habilitados_count,
                'competidores_deshabilitados' => $tutor->competidores_deshabilitados_count,
                'competidores_pendientes' => $tutor->competidores_pendientes_count,
                'telefono' => $tutor->telefono,
                'correo' => $tutor->correo,
                'estado' => $estadoFormateado,
                'fechaRegistro' => $fechaRegistro,
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $tutoresFormateados,
        ]);
        
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Error al obtener los tutores',
            'error' => $e->getMessage()
        ], 500);
    }
}

    

public function cambiarPassword(Request $request, $id)
{
    // Validación de los campos de entrada
    $request->validate([
        'password_actual' => 'required|string',
        'password' => 'required|string|min:6|confirmed',
    ]);

    // Buscar el tutor
    $tutor = Tutor::find($id);
    if (!$tutor) {
        return response()->json(['success' => false, 'message' => 'Tutor no encontrado.'], 404);
    }

    // Verificar contraseña actual
    if (!Hash::check($request->password_actual, $tutor->password)) {
        return response()->json(['success' => false, 'message' => 'La contraseña actual es incorrecta.'], 401);
    }

    // Cambiar la contraseña
    $tutor->password = Hash::make($request->password);
    $tutor->save();

    return response()->json(['success' => true, 'message' => 'Contraseña actualizada correctamente.']);
}

public function competidoresPorBoleta($boleta_id){
    try {
        // Validar que la boleta existe
        $boleta = Boleta::find($boleta_id);
        if (!$boleta) {
            return response()->json([
                'success' => false,
                'message' => 'Boleta no encontrada'
            ], 404);
        }

        // Obtener los competidores asociados a la boleta
        $competidores = Competidor::select([
            'competidor.competidor_id',
            'competidor.nombres',
            'competidor.apellidos',
            'colegio.nombre as colegio',
            'curso.nombre as curso',
            'grado.nombre as grado',
            'competidor.estado'
        ])
        ->join('competidor_competencia', 'competidor.competidor_id', '=', 'competidor_competencia.competidor_id')
        ->join('colegio', 'competidor.colegio_id', '=', 'colegio.colegio_id')
        ->join('curso', 'competidor.curso_id', '=', 'curso.curso_id')
        ->join('grado', 'curso.grado_id', '=', 'grado.grado_id')
        ->where('competidor_competencia.boleta_id', $boleta_id)
        ->get();

        $competidoresFormateados = $competidores->map(function ($competidor) use ($boleta_id) {
            // Obtener las áreas del competidor para esta boleta específica
            $areas = CompetidorCompetencia::select('area.nombre')
                ->join('area', 'competidor_competencia.area_id', '=', 'area.area_id')
                ->where('competidor_competencia.competidor_id', $competidor->competidor_id)
                ->where('competidor_competencia.boleta_id', $boleta_id) // Filtrar por boleta
                ->pluck('area.nombre')
                ->unique()
                ->implode(', ');

            // Obtener las categorías del competidor para esta boleta específica
            $categorias = CompetidorCompetencia::select('nivel_categoria.nombre')
                ->join('nivel_categoria', 'competidor_competencia.nivel_categoria_id', '=', 'nivel_categoria.nivel_categoria_id')
                ->where('competidor_competencia.competidor_id', $competidor->competidor_id)
                ->where('competidor_competencia.boleta_id', $boleta_id) // Filtrar por boleta
                ->pluck('nivel_categoria.nombre')
                ->unique()
                ->implode(', ');

            $nombreCompleto = $competidor->nombres . ' ' . $competidor->apellidos;

            return [
                'id' => $competidor->competidor_id,
                'nombre_completo' => $nombreCompleto,
                'colegio' => $competidor->colegio,
                'area' => $areas ?: 'No asignada',
                'categoria' => $categorias ?: 'Sin categoría',
                'curso' => $competidor->curso,
                'grado' => $competidor->grado,
                'estado' => $competidor->estado ?? 'Desconocido'
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $competidoresFormateados,
            ]
        );

    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Error al obtener los competidores de la boleta',
            'error' => $e->getMessage()
        ], 500);
    }
}


    public function actualizarEstadoTutor(Request $request, $id){
        $validator = Validator::make($request->all(), [
            'estado' => 'required|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Error de validación',
                'errors' => $validator->errors()
            ], 422);
        }

        try {

            $tutor = Tutor::find($id);

            if (!$tutor) {
                return response()->json([
                    'success' => false,
                    'message' => 'Tutor no encontrado'
                ], 404);
            }

            $estadoAnterior = $tutor->estado;
            $tutor->estado = $request->estado;
            $tutor->save();

            $estadoAnteriorFormateado = $estadoAnterior ? 'activo' : 'inactivo';
            $nuevoEstadoFormateado = $tutor->estado ? 'activo' : 'inactivo';

            return response()->json([
                'success' => true,
                'message' => 'Estado del tutor actualizado correctamente',
                'data' => [
                    'tutor_id' => $tutor->tutor_id,
                    'estado_anterior' => $estadoAnteriorFormateado,
                    'estado_nuevo' => $nuevoEstadoFormateado
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar el estado del tutor',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    public function VerMiPerfil($id)
{
    try {
        $tutor = Tutor::find($id);

        if (!$tutor) {
            return response()->json([
                'success' => false,
                'message' => 'Tutor no encontrado'
            ], 404);
        }

        return response()->json([
            'nombres' => $tutor->nombres,
            'apellidos' => $tutor->apellidos,
            'correo_electronico' => $tutor->correo_electronico,
            'telefono' => $tutor->telefono,
            'ci' => $tutor->ci,
        ]);

    } catch (\Exception $e) {
        // En caso de error, capturamos la excepción
        return response()->json([
            'success' => false,
            'message' => 'Error al obtener el perfil',
            'error' => $e->getMessage()
        ], 500);
    }
}
public function ActualizarMiPerfil(Request $request, $id)
{
    try {
        $tutor = Tutor::find($id);

        if (!$tutor) {
            return response()->json([
                'success' => false,
                'message' => 'Tutor no encontrado'
            ], 404);
        }

        // Validar los datos de entrada
        $validator = Validator::make($request->all(), [
            'nombres' => 'required|string|max:255',
            'apellidos' => 'required|string|max:255',
            'correo_electronico' => 'required|email|max:255',
            'telefono' => 'required|string|max:20',
            'ci' => 'required|string|max:20',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Error de validación',
                'errors' => $validator->errors()
            ], 422);
        }

        // Actualizar los datos del tutor
        $tutor->nombres = $request->nombres;
        $tutor->apellidos = $request->apellidos;
        $tutor->correo_electronico = $request->correo_electronico;
        $tutor->telefono = $request->telefono;
        $tutor->ci = $request->ci;
        $tutor->save();

        return response()->json([
            'success' => true,
            'message' => 'Perfil actualizado correctamente',
            'data' => [
                'tutor_id' => $tutor->tutor_id,
                'nombres' => $tutor->nombres,
                'apellidos' => $tutor->apellidos,
                'correo_electronico' => $tutor->correo_electronico,
                'telefono' => $tutor->telefono,
                'ci' => $tutor->ci,
            ]
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Error al actualizar el perfil',
            'error' => $e->getMessage()
        ], 500);
    }
}

public function competidoresFiltrados($id, Request $request){
    try {
        $tutor = Tutor::find($id);
        if (!$tutor) {
            return response()->json([
                'success' => false,
                'message' => 'Tutor no encontrado'
            ], 404);
        }

        $query = DB::table('competidor')
            ->join('tutor_competidor', 'competidor.competidor_id', '=', 'tutor_competidor.competidor_id')
            ->leftJoin('competidor_competencia', 'competidor.competidor_id', '=', 'competidor_competencia.competidor_id')
            ->leftJoin('area', 'competidor_competencia.area_id', '=', 'area.area_id')
            ->leftJoin('curso', 'competidor.curso_id', '=', 'curso.curso_id')
            ->leftJoin('nivel_categoria', 'competidor_competencia.nivel_categoria_id', '=', 'nivel_categoria.nivel_categoria_id')
            ->where('tutor_competidor.tutor_id', $id)
            ->select(
                'competidor.competidor_id',
                DB::raw("CONCAT(competidor.nombres, ' ', competidor.apellidos) as nombre_completo"),
                'area.nombre as area',
                'nivel_categoria.nombre as categoria',
                'curso.nombre as curso',
                'competidor.estado'
            );

        if ($request->has('estado')) {
            $query->where('competidor.estado', $request->estado);
        }

        if ($request->has('nombre')) {
            $query->where(DB::raw("CONCAT(competidor.nombres, ' ', competidor.apellidos)"), 'like', '%' . $request->nombre . '%');
        }

        if ($request->has('area')) {
            $query->where('area.nombre', $request->area);
        }

        $competidores = $query->get();

        return response()->json([
            'data' => $competidores
        ]);

    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Error al obtener los competidores filtrados',
            'error' => $e->getMessage()
        ], 500);
    }
}
public function verPerfilTutor($id)
     {
         try {
             $tutor = Tutor::find($id);

             if (!$tutor) {
                 return response()->json([
                     'success' => false,
                     'message' => 'Tutor no encontrado'
                 ], 404);
             }

             $competidoresCount = TutorCompetidor::where('tutor_id', $tutor->tutor_id)->count();

             $areasCount = DB::table('competidor_competencia')
                 ->join('tutor_competidor', 'competidor_competencia.competidor_id', '=', 'tutor_competidor.competidor_id')
                 ->where('tutor_competidor.tutor_id', $tutor->tutor_id)
                 ->distinct()
                 ->count('competidor_competencia.area_id');

             return response()->json([
                 'tutor_id' => $tutor->tutor_id,
                 'ci' => $tutor->ci,
                 'nombres' => $tutor->nombres,
                 'apellidos' => $tutor->apellidos,
                 'correo_electronico' => $tutor->correo_electronico,
                 'telefono' => $tutor->telefono,
                 'estado' => (bool) $tutor->estado,
                 'fecha_registro' => optional($tutor->created_at)->format('Y-m-d'),
                 'competidores_asignados' => $competidoresCount,
                 'areas_asignadas' => $areasCount
             ], 200);
         } catch (\Exception $e) {
             return response()->json([
                 'success' => false,
                 'message' => 'Error al obtener el perfil del tutor',
                 'error' => $e->getMessage()
             ], 500);
         }
     }

     public function actualizarDatosCompetidor(Request $request, $tutor_id, $competidor_id)
    {
        $validator = Validator::make($request->all(), [
            'nombres' => 'required|string',
            'apellidos' => 'required|string',
            'ci' => 'required|string',
            'fechaNacimiento' => 'required|date',
            'colegio' => 'required|string',
            'curso' => 'required|string',
            'departamento' => 'required|string',
            'provincia' => 'required|string',
            'areasInscritas' => 'required|array|min:1'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $asignacion = DB::table('tutor_competidor')
                ->where('tutor_id', $tutor_id)
                ->where('competidor_id', $competidor_id)
                ->first();

            if (!$asignacion) {
                return response()->json([
                    'success' => false,
                    'message' => 'Este tutor no tiene asignado este competidor.'
                ], 403);
            }

            $competidor = Competidor::find($competidor_id);
            if (!$competidor) {
                return response()->json([
                    'success' => false,
                    'message' => 'Competidor no encontrado.'
                ], 404);
            }

            // Actualizar datos básicos
            $competidor->nombres = $request->nombres;
            $competidor->apellidos = $request->apellidos;
            $competidor->ci = $request->ci;
            $competidor->fecha_nacimiento = $request->fechaNacimiento;

            // Colegio y Curso
            $colegio = Colegio::firstOrCreate(['nombre' => $request->colegio]);
            $competidor->colegio_id = $colegio->colegio_id;

            $curso = Curso::firstOrCreate(['nombre' => $request->curso]);
            $competidor->curso_id = $curso->curso_id;

            $competidor->save();

            // Actualizar o crear ubicación del colegio
            if ($colegio->ubicacion) {
                $colegio->ubicacion->departamento = $request->departamento;
                $colegio->ubicacion->provincia = $request->provincia;
                $colegio->ubicacion->save();
            } else {
                $ubicacion = new \App\Models\Ubicacion();
                $ubicacion->departamento = $request->departamento;
                $ubicacion->provincia = $request->provincia;
                $ubicacion->save();
                $colegio->ubicacion_id = $ubicacion->ubicacion_id;
                $colegio->save();
            }

            // Convertir nombres de áreas a IDs
            $areaIDs = Area::whereIn('nombre', $request->areasInscritas)->pluck('area_id')->toArray();

            // Limpiar e insertar áreas nuevamente
            DB::table('competidor_competencia')->where('competidor_id', $competidor_id)->delete();

            foreach ($areaIDs as $areaID) {
                DB::table('competidor_competencia')->insert([
                    'competidor_id' => $competidor_id,
                    'area_id' => $areaID,
                    'competencia_id' => 1,
                    'nivel_categoria_id' => 1,
                    'fecha_inscripcion' => now()
                ]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Datos del competidor actualizados correctamente.',
                'competidor_id' => $competidor->competidor_id
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error interno.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

 public function inscribirCompetidor(Request $request, $tutor_id)
{
    $validator = Validator::make($request->all(), [
        'competidor.nombres' => 'required|string',
        'competidor.apellidos' => 'required|string',
        'competidor.ci' => 'required|string|unique:competidor,ci',
        'competidor.fecha_nacimiento' => 'required|date',
        'competidor.colegio' => 'required|string',
        'competidor.competencia_id'=> 'required|integer',
        'competidor.curso' => 'required|string',
        'competidor.area' => 'required|string',
        'competidor.categoria' => 'required|string',
        'competidor.departamento' => 'required|string',
        'competidor.provincia' => 'required|string',
        'tutores' => 'nullable|array|min:1',
        'tutores.*.ci' => 'required|string',
        'tutores.*.relacion' => 'required|string'
    ]);

    if ($validator->fails()) {
        return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
    }

    DB::beginTransaction();
    try {
        // Buscar o crear ubicación
        $ubicacion = Ubicacion::firstOrCreate(
            [
                'departamento' => $request->competidor['departamento'],
                'provincia' => $request->competidor['provincia']
            ]
        );

        // Colegio
        $colegio = Colegio::firstOrCreate(
            ['nombre' => $request->competidor['colegio']],
            ['ubicacion_id' => $ubicacion->ubicacion_id, 'telefono' => '00000000']
        );

        // Curso
        $curso = Curso::firstOrCreate(
            ['nombre' => $request->competidor['curso']],
            ['grado_id' => 1, 'estado' => 1]
        );

        // Crear competidor
        $competidor = Competidor::create([
            'nombres' => $request->competidor['nombres'],
            'apellidos' => $request->competidor['apellidos'],
            'ci' => $request->competidor['ci'],
            'fecha_nacimiento' => $request->competidor['fecha_nacimiento'],
            'colegio_id' => $colegio->colegio_id,
            'curso_id' => $curso->curso_id,
            'ubicacion_id' => $ubicacion->ubicacion_id,
            'estado' => 'Pendiente'
        ]);

        // Validar área y categoría
        $area = Area::whereRaw('LOWER(nombre) = ?', [strtolower($request->competidor['area'])])->first();
        if (!$area) {
            return response()->json(['success' => false, 'message' => 'Área inválida.', 'field' => 'area'], 422);
        }

        $categoria = NivelCategoria::whereRaw('LOWER(nombre) = ?', [strtolower($request->competidor['categoria'])])->first();
        if (!$categoria) {
            return response()->json(['success' => false, 'message' => 'Categoría inválida.', 'field' => 'categoria'], 422);
        }

        // Insertar en tabla de competencia
        DB::table('competidor_competencia')->insert([
            'competidor_id' => $competidor->competidor_id,
            'area_id' => $area->area_id,
            'nivel_categoria_id' => $categoria->nivel_categoria_id,
            'competencia_id' => $request->competidor['competencia_id'],
            'fecha_inscripcion' => now()
        ]);

        DB::commit();

        return response()->json([
            'success' => true,
            'message' => 'Competidor registrado correctamente.',
            'competidor_id' => $competidor->competidor_id
        ]);
    } catch (\Exception $e) {
        DB::rollBack();
        return response()->json([
            'success' => false,
            'message' => 'Error al registrar el competidor.',
            'error' => $e->getMessage()
        ], 500);
    }
}



    public function getOpcionesCompetencia()
{
    try {
        // Obtener áreas con id y nombre
        $areas = \App\Models\Area::select('area_id as id', 'nombre')->get();

        // Obtener categorías con todos los campos requeridos
        $categorias = \App\Models\NivelCategoria::select(
            'nivel_categoria_id',
            'area_id',
            'grado_id_inicial',
            'grado_id_final',
            'nombre'
        )->get();

        // Obtener grados
        $grados = \App\Models\Grado::select('grado_id as id', 'nombre')->get();

        // Lista estática de rangos
        $rangos = [
            "5to a 6to primaria",
            "1ro a 3ro secundaria",
            "4to a 6to secundaria"
        ];

        return response()->json([
            "areas" => $areas,
            "categorias" => $categorias,
            "grados" => $grados,
            "rangos" => $rangos
        ]);
    } catch (\Throwable $e) {
        return response()->json([
            'success' => false,
            'message' => 'Error loading competition options.',
            'error' => $e->getMessage()
        ], 500);
    }
}
public function registrarTutores(Request $request)
{
    $validator = Validator::make($request->all(), [
        'competidor_id' => 'required|integer|exists:competidor,competidor_id',
        'tutores' => 'required|array|min:1',
        'tutores.*.nombres' => 'required|string',
        'tutores.*.apellidos' => 'required|string',
        'tutores.*.competencia_id' => 'required|integer',
        'tutores.*.correo_electronico' => 'required|email',
        'tutores.*.telefono' => 'required|string',
        'tutores.*.ci' => 'required|string',
        'tutores.*.relacion' => 'required|string'
    ]);

    if ($validator->fails()) {
        return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
    }

    DB::beginTransaction();
    try {
        $competidor_id = $request->competidor_id;

        foreach ($request->tutores as $index => $tutorData) {
            $tutor = Tutor::updateOrCreate(
                ['ci' => $tutorData['ci']],
                [
                    'nombres' => $tutorData['nombres'],
                    'apellidos' => $tutorData['apellidos'],
                    'competencia_id' => $tutorData['competencia_id'],
                    'correo_electronico' => $tutorData['correo_electronico'],
                    'telefono' => $tutorData['telefono'],
                    'relacion' => $tutorData['relacion'],
                    'estado' => 1
                ]
            );

            DB::table('tutor_competidor')->insert([
                'tutor_id' => $tutor->tutor_id,
                'competidor_id' => $competidor_id,
                'nivel_respansabilidad' => $index === 0 ? 'Principal' : 'Secundario',
                'realcion_competidor' => $tutorData['relacion'],
                'created_at' => now(),
                'updated_at' => now()
            ]);
        }

        DB::commit();
        return response()->json([
            'success' => true,
            'message' => 'Tutores y relaciones registradas correctamente'
        ]);
    } catch (\Throwable $e) {
        DB::rollBack();
        return response()->json([
            'success' => false,
            'message' => 'Error al registrar tutores',
            'error' => $e->getMessage()
        ], 500);
    }
}
   public function datosTutor($id)
{
    $tutor = Tutor::find($id);

    if (!$tutor) {
        return response()->json([
            'success' => false,
            'message' => 'Tutor no encontrado'
        ], 404);
    }

    return response()->json([
        'success' => true,
        'data' => [
            'nombres' => $tutor->nombres,
            'apellidos' => $tutor->apellidos,
            'correo_electronico' => $tutor->correo_electronico,
            'telefono' => $tutor->telefono,
            'ci' => $tutor->ci
        ]
    ]);
}


}
