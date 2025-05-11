<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class CompetidorCompetencia extends Seeder{
   public function run()
    {
        $competencia = DB::table('competencia')->where('nombre_competencia', 'Olimpiada Oh! SanSi 2024')->first();
        $areas = DB::table('area')->get();
        $niveles_categorias = DB::table('nivel_categoria')->get();
        $competidores = DB::table('competidor')->get();
        
        if (!$competencia || $areas->isEmpty() || $niveles_categorias->isEmpty() || $competidores->isEmpty()) {
            echo "Error: Ejecuta primero los seeders de Competencia, Area, NivelCategoria y Competidor\n";
            return;
        }
        
        $inscripciones = [];
        
        foreach ($competidores as $competidor) {
            $area = $areas->random();
            $categoriasArea = $niveles_categorias->where('area_id', $area->area_id);
            
            if ($categoriasArea->isEmpty()) continue;
            
            $inscripciones[] = [
                'competidor_id' => $competidor->competidor_id,
                'competencia_id' => $competencia->competencia_id,
                'area_id' => $area->area_id,
                'nivel_categoria_id' => $categoriasArea->random()->nivel_categoria_id,
                'boleta_id' => null, // Sin boleta por ahora
                'fecha_inscripcion' => Carbon::now()->subDays(rand(1, 15)),
                'created_at' => now(),
                'updated_at' => now(),
            ];
            
            // 20% de probabilidad de inscribir en una segunda área
            if (rand(1, 100) <= 20) {
                $segundaArea = $areas->where('area_id', '!=', $area->area_id)->random();
                $segundasCategorias = $niveles_categorias->where('area_id', $segundaArea->area_id);
                
                if ($segundasCategorias->isNotEmpty()) {
                    $inscripciones[] = [
                        'competidor_id' => $competidor->competidor_id,
                        'competencia_id' => $competencia->competencia_id,
                        'area_id' => $segundaArea->area_id,
                        'nivel_categoria_id' => $segundasCategorias->random()->nivel_categoria_id,
                        'boleta_id' => null,
                        'fecha_inscripcion' => Carbon::now()->subDays(rand(1, 15)),
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                }
            }
        }

        DB::table('competidor_competencia')->insert($inscripciones);
    }
}
