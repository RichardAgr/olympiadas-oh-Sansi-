<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TutorCompetidor extends Seeder{
    public function run(){
        // Obtener IDs de tutores y competidores
        $tutores = DB::table('tutor')->get();
        $competidores = DB::table('competidor')->get();
        
        // Verificar que haya tutores y competidores
        if ($tutores->isEmpty() || $competidores->isEmpty()) {
            return;
        }
        
        $tutor_competidores = [];
        
        // Asignar el primer tutor a los primeros 3 competidores (caso de un tutor con varios competidores)
        $tutor1 = $tutores[0];
        for ($i = 0; $i < min(3, count($competidores)); $i++) {
            $tutor_competidores[] = [
                'competidor_id' => $competidores[$i]->competidor_id,
                'tutor_id' => $tutor1->tutor_id,
                'nivel_respansabilidad' => 'Principal',
                'realcion_competidor' => 'Profesor',
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }
        
        // Asignar el segundo tutor a los siguientes 2 competidores (si existen)
        if (count($tutores) > 1 && count($competidores) > 3) {
            $tutor2 = $tutores[1];
            for ($i = 3; $i < min(5, count($competidores)); $i++) {
                $tutor_competidores[] = [
                    'competidor_id' => $competidores[$i]->competidor_id,
                    'tutor_id' => $tutor2->tutor_id,
                    'nivel_respansabilidad' => 'Principal',
                    'realcion_competidor' => 'Papa',
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        }
        
        // Asignar tutores individuales a los demás competidores usando tutores disponibles
        $tutorIndex = 0;
        for ($i = 5; $i < count($competidores); $i++) {
            // Usar módulo para ciclar entre los tutores disponibles
            $tutor = $tutores[$tutorIndex % count($tutores)];
            
            $tutor_competidores[] = [
                'competidor_id' => $competidores[$i]->competidor_id,
                'tutor_id' => $tutor->tutor_id,
                'nivel_respansabilidad' => 'Principal',
                'realcion_competidor' => 'Profesor',
                'created_at' => now(),
                'updated_at' => now(),
            ];
            
            $tutorIndex++;
        }
        
        // Asignar tutores secundarios a algunos competidores (solo si hay suficientes tutores)
        if (count($tutores) > 5 && count($competidores) > 0) {
            $tutor_competidores[] = [
                'competidor_id' => $competidores[0]->competidor_id,
                'tutor_id' => $tutores[min(5, count($tutores) - 1)]->tutor_id,
                'nivel_respansabilidad' => 'Secundario',
                'realcion_competidor' => 'Madre',
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }
        
        if (count($tutores) > 6 && count($competidores) > 1) {
            $tutor_competidores[] = [
                'competidor_id' => $competidores[1]->competidor_id,
                'tutor_id' => $tutores[min(6, count($tutores) - 1)]->tutor_id,
                'nivel_respansabilidad' => 'Secundario',
                'realcion_competidor' => 'Familiar',
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }


        DB::table('tutor_competidor')->insert($tutor_competidores);
    }
}
