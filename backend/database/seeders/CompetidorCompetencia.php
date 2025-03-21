<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class CompetidorCompetencia extends Seeder{
    public function run(){
        $competidores = DB::table('competidor')->get();
        $competencia = DB::table('competencia')->where('nombre_competencia', 'Olimpiada Oh! SanSi 2024')->first();
        $areas = DB::table('area')->get();
        $niveles_categorias = DB::table('nivel_categoria')->get();
        
        $competidor_competencias = [];
        
        // Inscribir a Fresia Ticona en Química 6S
        $competidor_competencias[] = [
            'competidor_id' => $competidores->where('ci', '14268363')->first()->competidor_id,
            'competencia_id' => $competencia->competencia_id,
            'area_id' => $areas->where('nombre', 'QUÍMICA')->first()->area_id,
            'nivel_categoria_id' => $niveles_categorias->where('area_id', $areas->where('nombre', 'QUÍMICA')->first()->area_id)
                                                    ->where('nombre', '6S')->first()->nivel_categoria_id,
            'fecha_inscripcion' => Carbon::now()->subDays(10),
            'created_at' => now(),
            'updated_at' => now(),
        ];
        
        // Inscribir a Dayra Damian en Robótica Lego P
        $competidor_competencias[] = [
            'competidor_id' => $competidores->where('ci', '15582477')->first()->competidor_id,
            'competencia_id' => $competencia->competencia_id,
            'area_id' => $areas->where('nombre', 'ROBÓTICA')->first()->area_id,
            'nivel_categoria_id' => $niveles_categorias->where('area_id', $areas->where('nombre', 'ROBÓTICA')->first()->area_id)
                                                    ->where('nombre', 'Lego P')->first()->nivel_categoria_id,
            'fecha_inscripcion' => Carbon::now()->subDays(15),
            'created_at' => now(),
            'updated_at' => now(),
        ];
        
        // Inscribir a Carlos Mendoza en Física 4S
        $competidor_competencias[] = [
            'competidor_id' => $competidores->where('ci', '14567890')->first()->competidor_id,
            'competencia_id' => $competencia->competencia_id,
            'area_id' => $areas->where('nombre', 'FÍSICA')->first()->area_id,
            'nivel_categoria_id' => $niveles_categorias->where('area_id', $areas->where('nombre', 'FÍSICA')->first()->area_id)
                                                    ->where('nombre', '4S')->first()->nivel_categoria_id,
            'fecha_inscripcion' => Carbon::now()->subDays(12),
            'created_at' => now(),
            'updated_at' => now(),
        ];
        
        // Inscribir a Carlos Mendoza también en Matemática (caso de un competidor en múltiples áreas)
        $competidor_competencias[] = [
            'competidor_id' => $competidores->where('ci', '14567890')->first()->competidor_id,
            'competencia_id' => $competencia->competencia_id,
            'area_id' => $areas->where('nombre', 'MATEMÁTICA')->first()->area_id,
            'nivel_categoria_id' => $niveles_categorias->where('area_id', $areas->where('nombre', 'MATEMÁTICA')->first()->area_id)
                                                    ->where('nombre', 'Cuarto Nivel')->first()->nivel_categoria_id,
            'fecha_inscripcion' => Carbon::now()->subDays(12),
            'created_at' => now(),
            'updated_at' => now(),
        ];
        
        // Inscribir a Patricia Flores en Biología 3S
        $competidor_competencias[] = [
            'competidor_id' => $competidores->where('ci', '14678901')->first()->competidor_id,
            'competencia_id' => $competencia->competencia_id,
            'area_id' => $areas->where('nombre', 'BIOLOGÍA')->first()->area_id,
            'nivel_categoria_id' => $niveles_categorias->where('area_id', $areas->where('nombre', 'BIOLOGÍA')->first()->area_id)
                                                    ->where('nombre', '3S')->first()->nivel_categoria_id,
            'fecha_inscripcion' => Carbon::now()->subDays(8),
            'created_at' => now(),
            'updated_at' => now(),
        ];
        
        // Inscribir a Roberto Guzmán en Química 2S
        $competidor_competencias[] = [
            'competidor_id' => $competidores->where('ci', '14789012')->first()->competidor_id,
            'competencia_id' => $competencia->competencia_id,
            'area_id' => $areas->where('nombre', 'QUÍMICA')->first()->area_id,
            'nivel_categoria_id' => $niveles_categorias->where('area_id', $areas->where('nombre', 'QUÍMICA')->first()->area_id)
                                                    ->where('nombre', '2S')->first()->nivel_categoria_id,
            'fecha_inscripcion' => Carbon::now()->subDays(7),
            'created_at' => now(),
            'updated_at' => now(),
        ];
        
        // Inscribir a María López en Matemática Primer Nivel
        $competidor_competencias[] = [
            'competidor_id' => $competidores->where('ci', '14890123')->first()->competidor_id,
            'competencia_id' => $competencia->competencia_id,
            'area_id' => $areas->where('nombre', 'MATEMÁTICA')->first()->area_id,
            'nivel_categoria_id' => $niveles_categorias->where('area_id', $areas->where('nombre', 'MATEMÁTICA')->first()->area_id)
                                                    ->where('nombre', 'Primer Nivel')->first()->nivel_categoria_id,
            'fecha_inscripcion' => Carbon::now()->subDays(6),
            'created_at' => now(),
            'updated_at' => now(),
        ];
        
        // Inscribir a Fernando Camacho en Informática Guacamayo
        $competidor_competencias[] = [
            'competidor_id' => $competidores->where('ci', '14901234')->first()->competidor_id,
            'competencia_id' => $competencia->competencia_id,
            'area_id' => $areas->where('nombre', 'INFORMÁTICA')->first()->area_id,
            'nivel_categoria_id' => $niveles_categorias->where('area_id', $areas->where('nombre', 'INFORMÁTICA')->first()->area_id)
                                                    ->where('nombre', 'Guacamayo')->first()->nivel_categoria_id,
            'fecha_inscripcion' => Carbon::now()->subDays(5),
            'created_at' => now(),
            'updated_at' => now(),
        ];
        
        // Inscribir a Lucía Montaño en Robótica Builders P
        $competidor_competencias[] = [
            'competidor_id' => $competidores->where('ci', '15012345')->first()->competidor_id,
            'competencia_id' => $competencia->competencia_id,
            'area_id' => $areas->where('nombre', 'ROBÓTICA')->first()->area_id,
            'nivel_categoria_id' => $niveles_categorias->where('area_id', $areas->where('nombre', 'ROBÓTICA')->first()->area_id)
                                                    ->where('nombre', 'Builders P')->first()->nivel_categoria_id,
            'fecha_inscripcion' => Carbon::now()->subDays(4),
            'created_at' => now(),
            'updated_at' => now(),
        ];
        
        // Inscribir a Jorge Pérez en Astronomía y Astrofísica 4P
        $competidor_competencias[] = [
            'competidor_id' => $competidores->where('ci', '15123456')->first()->competidor_id,
            'competencia_id' => $competencia->competencia_id,
            'area_id' => $areas->where('nombre', 'ASTRONOMÍA Y ASTROFÍSICA')->first()->area_id,
            'nivel_categoria_id' => $niveles_categorias->where('area_id', $areas->where('nombre', 'ASTRONOMÍA Y ASTROFÍSICA')->first()->area_id)
                                                    ->where('nombre', '4P')->first()->nivel_categoria_id,
            'fecha_inscripcion' => Carbon::now()->subDays(3),
            'created_at' => now(),
            'updated_at' => now(),
        ];
        
        // Inscribir a Ana Rodríguez en Astronomía y Astrofísica 3P
        $competidor_competencias[] = [
            'competidor_id' => $competidores->where('ci', '15234567')->first()->competidor_id,
            'competencia_id' => $competencia->competencia_id,
            'area_id' => $areas->where('nombre', 'ASTRONOMÍA Y ASTROFÍSICA')->first()->area_id,
            'nivel_categoria_id' => $niveles_categorias->where('area_id', $areas->where('nombre', 'ASTRONOMÍA Y ASTROFÍSICA')->first()->area_id)
                                                    ->where('nombre', '3P')->first()->nivel_categoria_id,
            'fecha_inscripcion' => Carbon::now()->subDays(2),
            'created_at' => now(),
            'updated_at' => now(),
        ];

        DB::table('competidor_competencia')->insert($competidor_competencias);
    }
}
