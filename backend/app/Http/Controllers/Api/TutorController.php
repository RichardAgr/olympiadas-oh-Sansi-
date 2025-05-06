<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Tutor;
use App\Models\Competidor;
use App\Models\TutorCompetidor;
use App\Models\Colegio;
use App\Models\Curso;
use App\Models\NivelCategoria; 
use App\Models\CompetidorCompetencia;
use App\Models\Area;;
use App\Http\Resources\CompetidoresTutorResource;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

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

            $competidores = Competidor::select([
                'competidor.competidor_id as id',
                'competidor.nombres',
                'competidor.apellidos',
                'colegio.nombre as colegio',
                'curso.nombre as curso',
                'grado.nombre as grado'
            ])
            ->join('tutor_competidor', 'competidor.competidor_id', '=', 'tutor_competidor.competidor_id')
            ->join('colegio', 'competidor.colegio_id', '=', 'colegio.colegio_id')
            ->join('curso', 'competidor.curso_id', '=', 'curso.curso_id')
            ->join('grado', 'curso.grado_id', '=', 'grado.grado_id')
            ->where('tutor_competidor.tutor_id', $id)
            ->get();

            $competidoresFormateados = $competidores->map(function ($competidor) {
                $areas = CompetidorCompetencia::select('area.nombre')
                    ->join('area', 'competidor_competencia.area_id', '=', 'area.area_id')
                    ->where('competidor_competencia.competidor_id', $competidor->id)
                    ->pluck('area.nombre')
                    ->unique()
                    ->implode(', ');

                $nombreCompleto = $competidor->nombres . ' ' . $competidor->apellidos;

                $cursoCompleto = $competidor->grado;

                return [
                    'id' => $competidor->id,
                    'nombre' => $nombreCompleto,
                    'colegio' => $competidor->colegio,
                    'curso' => $cursoCompleto,
                    'competencia' => $areas ?: 'No asignada'
                ];
            });

            // Construir la respuesta en el formato solicitado
            $respuesta = [
                'data' => [
                    'estudiantes' => $competidoresFormateados
                ]
            ];

            return response()->json($respuesta);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener los competidores del tutor',
                'error' => $e->getMessage()
            ], 500);
        }
    }


    public function obtenerInformacionTutores(Request $request){
        try {
                // En esta parte deberia ir la paginacion si es que se tiene mas de 100 tutores 
                //se recomiendo que sea de 15 en 15


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
                    'fechaRegistro' => $fechaRegistro
                ];
            });
            
            return response()->json($tutoresFormateados);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener los tutores',
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

    
    public function competidoresFiltrados($id, Request $request)
    {
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

            // 📌 Actualizar datos básicos
            $competidor->nombres = $request->nombres;
            $competidor->apellidos = $request->apellidos;
            $competidor->ci = $request->ci;
            $competidor->fecha_nacimiento = $request->fechaNacimiento;

            // 📚 Colegio y Curso
            $colegio = Colegio::firstOrCreate(['nombre' => $request->colegio]);
            $competidor->colegio_id = $colegio->colegio_id;

            $curso = Curso::firstOrCreate(['nombre' => $request->curso]);
            $competidor->curso_id = $curso->curso_id;

            $competidor->save();

            // 🌎 Actualizar o crear ubicación del colegio
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

            // 🧠 Convertir nombres de áreas a IDs
            $areaIDs = Area::whereIn('nombre', $request->areasInscritas)->pluck('area_id')->toArray();

            // 🔄 Limpiar e insertar áreas nuevamente
            DB::table('competidor_competencia')->where('competidor_id', $competidor_id)->delete();

            foreach ($areaIDs as $areaID) {
                DB::table('competidor_competencia')->insert([
                    'competidor_id' => $competidor_id,
                    'area_id' => $areaID,
                    'competencia_id' => 1, // puedes hacer esto dinámico
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
            'competidor.curso' => 'required|string',
            'competidor.area' => 'required|string',
            'competidor.categoria' => 'required|string',
            'tutores' => 'required|array|min:1',
            'tutores.*.nombres' => 'required|string',
            'tutores.*.apellidos' => 'required|string',
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
            // Colegio
            $colegio = Colegio::firstOrCreate(
                ['nombre' => $request->competidor['colegio']],
                ['ubicacion_id' => 1, 'telefono' => '00000000']
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
                'ubicacion_id' => 1,
                'estado' => 'Pendiente'
            ]);

            // Tutor principal
            DB::table('tutor_competidor')->insert([
                'tutor_id' => $tutor_id,
                'competidor_id' => $competidor->competidor_id,
                'nivel_responsabilidad' => 'Titular',
                'relacion_competidor' => 'Padre'
            ]);

            // Área
            $area = Area::whereRaw('LOWER(nombre) = ?', [strtolower($request->competidor['area'])])->first();
            if (!$area) {
                return response()->json([
                    'success' => false,
                    'message' => 'Área inválida: ' . $request->competidor['area'],
                    'field' => 'area'
                ], 422);
            }

            // Categoría
            $categoria = NivelCategoria::whereRaw('LOWER(nombre) = ?', [strtolower($request->competidor['categoria'])])->first();
            if (!$categoria) {
                return response()->json([
                    'success' => false,
                    'message' => 'Categoría inválida: ' . $request->competidor['categoria'],
                    'field' => 'categoria'
                ], 422);
            }

            // Insertar en tabla pivote
            DB::table('competidor_competencia')->insert([
                'competidor_id' => $competidor->competidor_id,
                'area_id' => $area->area_id,
                'nivel_categoria_id' => $categoria->nivel_categoria_id,
                'competencia_id' => 1, // <-- hardcoded for now
                'fecha_inscripcion' => now()
            ]);

            // Tutores adicionales
            foreach ($request->tutores as $tutorData) {
                $newTutor = Tutor::firstOrCreate(
                    ['ci' => $tutorData['ci']],
                    [
                        'nombres' => $tutorData['nombres'],
                        'apellidos' => $tutorData['apellidos'],
                        'correo_electronico' => $tutorData['correo_electronico'],
                        'telefono' => $tutorData['telefono'],
                        'relacion' => $tutorData['relacion'],
                        'estado' => 1
                    ]
                );

                if ($newTutor->tutor_id != $tutor_id) {
                    DB::table('tutor_competidor')->updateOrInsert(
                        [
                            'tutor_id' => $newTutor->tutor_id,
                            'competidor_id' => $competidor->competidor_id
                        ],
                        [
                            'nivel_responsabilidad' => 'Tutor principal',
                            'relacion_competidor' => $tutorData['relacion']
                        ]
                    );
                }
            }

            DB::commit();
            return response()->json([
                'success' => true,
                'message' => 'Competidor registered successfully.'
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Error during registration.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

}