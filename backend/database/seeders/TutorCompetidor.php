<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TutorCompetidor extends Seeder{
    public function run()
    {
        $tutores = DB::table('tutor')->get();
        $competidores = DB::table('competidor')->get();
        
        if ($tutores->isEmpty() || $competidores->isEmpty()) {
            echo "Error: Ejecuta primero los seeders de Tutor y Competidor\n";
            return;
        }
        
        $relaciones = [];
        $competidoresAsignados = collect();
        
        // Asignar aproximadamente 10 competidores por tutor (6 tutores x 10 = 60 competidores)
        foreach ($tutores as $tutor) {
            $numCompetidores = 10; // 10 competidores por tutor
            
            for ($i = 0; $i < $numCompetidores; $i++) {
                // Obtener un competidor no asignado aún
                $competidor = $competidores->whereNotIn('competidor_id', $competidoresAsignados->toArray())
                                         ->first();
                
                if (!$competidor) break; // Si no hay más competidores
                
                $relaciones[] = [
                    'competidor_id' => $competidor->competidor_id,
                    'tutor_id' => $tutor->tutor_id,
                    'nivel_respansabilidad' => 'Principal',
                    'realcion_competidor' => $this->getRandomRelation(),
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
                
                $competidoresAsignados->push($competidor->competidor_id);
                
                // 30% de probabilidad de asignar un tutor secundario
                if (rand(1, 100) <= 30) {
                    $tutorSecundario = $tutores->where('tutor_id', '!=', $tutor->tutor_id)
                                              ->random();
                    
                    $relaciones[] = [
                        'competidor_id' => $competidor->competidor_id,
                        'tutor_id' => $tutorSecundario->tutor_id,
                        'nivel_respansabilidad' => 'Secundario',
                        'realcion_competidor' => $this->getRandomRelation(),
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                }
            }
        }
        
        DB::table('tutor_competidor')->insert($relaciones);
    }
    
    private function getRandomRelation()
    {
        $relations = ['Padre', 'Madre', 'Profesor'];
        return $relations[array_rand($relations)];
    }
}
