<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Tutor;
use App\Http\Resources\CompetidoresTutorResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

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
}
