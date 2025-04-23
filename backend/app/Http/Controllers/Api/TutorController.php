<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Tutor;
use App\Models\Competidor;
use App\Models\TutorCompetidor;
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
}
