<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TutorCompetidor extends Seeder{
    public function run(){
        // Obtener IDs de tutores y competidores
        $tutores = DB::table('tutor')->get();
        $competidores = DB::table('competidor')->get();
        
        $tutor_competidores = [];
        
        // Asignar el primer tutor a los primeros 3 competidores (caso de un tutor con varios competidores)
        $tutor1 = $tutores->first();
        for ($i = 0; $i < 3; $i++) {
            $tutor_competidores[] = [
                'competidor_id' => $competidores[$i]->competidor_id,
                'tutor_id' => $tutor1->tutor_id,
                'nivel_respansabilidad' => 'Principal',
                'realcion_competidor' => 'Profesor',
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }
        
        // Asignar el segundo tutor a los siguientes 2 competidores
        $tutor2 = $tutores[1];
        for ($i = 3; $i < 5; $i++) {
            $tutor_competidores[] = [
                'competidor_id' => $competidores[$i]->competidor_id,
                'tutor_id' => $tutor2->tutor_id,
                'nivel_respansabilidad' => 'Principal',
                'realcion_competidor' => 'Papa',
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }
        
        // Asignar tutores individuales a los demás competidores
        for ($i = 5; $i < count($competidores); $i++) {
            $tutor_competidores[] = [
                'competidor_id' => $competidores[$i]->competidor_id,
                'tutor_id' => $tutores[$i]->tutor_id,
                'nivel_respansabilidad' => 'Principal',
                'realcion_competidor' => 'Profesor',
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }
        
        // Asignar tutores secundarios a algunos competidores (caso de un competidor con varios tutores)
        $tutor_competidores[] = [
            'competidor_id' => $competidores[0]->competidor_id,
            'tutor_id' => $tutores[5]->tutor_id,
            'nivel_respansabilidad' => 'Secundario',
            'realcion_competidor' => 'Madre',
            'created_at' => now(),
            'updated_at' => now(),
        ];
        
        $tutor_competidores[] = [
            'competidor_id' => $competidores[1]->competidor_id,
            'tutor_id' => $tutores[6]->tutor_id,
            'nivel_respansabilidad' => 'Secundario',
            'realcion_competidor' => 'Familiar',
            'created_at' => now(),
            'updated_at' => now(),
        ];

        DB::table('tutor_competidor')->insert($tutor_competidores);
    }
}
