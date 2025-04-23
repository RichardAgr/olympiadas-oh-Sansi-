<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Tutor;
use App\Http\Resources\CompetidoresTutorResource;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class TutorController extends Controller{
    public function competidores($tutorId){
        try {
            // Verificar si el tutor existe
            $tutor = Tutor::findOrFail($tutorId);
            
            $tutor->load([
                'competidores.colegio',
                'competidores.curso.grado',
                'competidores.competencias.area'
            ]);
            
            foreach ($tutor->competidores as $competidor) {
                foreach ($competidor->competencias as $competencia) {
                    if (!$competencia->area) {
                        Log::warning("Competencia ID {$competencia->competencia_id} no tiene área asociada para el competidor ID {$competidor->competidor_id}");
                    }
                }
            }
            
            // Devolver la respuesta formateada
            return new CompetidoresTutorResource($tutor);
        } catch (\Exception $e) {
            Log::error("Error al obtener competidores del tutor {$tutorId}: " . $e->getMessage());
            return response()->json([
                'error' => 'Error al obtener los competidores',
                'message' => $e->getMessage()
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
}
