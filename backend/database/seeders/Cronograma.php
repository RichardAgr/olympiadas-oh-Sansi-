<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class Cronograma extends Seeder{
    public function run(){
        $competencia = DB::table('competencia')->where('nombre_competencia', 'Olimpiada Oh! SanSi 2024')->first();
        $areas = DB::table('area')->get();
        
        $cronogramas = [
            // Eventos generales
            [
                'competencia_id' => $competencia->competencia_id,
                'area_id' => null,
                'nombre_evento' => 'Lanzamiento de convocatoria',
                'descripcion' => 'Lanzamiento oficial de la convocatoria para la Olimpiada Oh! SanSi 2024',
                'fecha_inicio' => Carbon::parse('2024-07-01'),
                'fecha_fin' => Carbon::parse('2024-07-01'),
                'tipo_evento' => 'Administrativo',
                'anio_olimpiada' => 2024,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'competencia_id' => $competencia->competencia_id,
                'area_id' => null,
                'nombre_evento' => 'Periodo de inscripciones',
                'descripcion' => 'Periodo de inscripciones para todas las áreas de competencia',
                'fecha_inicio' => Carbon::parse('2024-07-15'),
                'fecha_fin' => Carbon::parse('2024-08-21'),
                'tipo_evento' => 'Administrativo',
                'anio_olimpiada' => 2024,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'competencia_id' => $competencia->competencia_id,
                'area_id' => null,
                'nombre_evento' => 'Cierre de inscripciones',
                'descripcion' => 'Cierre oficial de inscripciones para todas las áreas',
                'fecha_inicio' => Carbon::parse('2024-08-21'),
                'fecha_fin' => Carbon::parse('2024-08-21'),
                'tipo_evento' => 'Administrativo',
                'anio_olimpiada' => 2024,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'competencia_id' => $competencia->competencia_id,
                'area_id' => null,
                'nombre_evento' => 'Ceremonia de premiación',
                'descripcion' => 'Ceremonia de premiación para todas las áreas de competencia',
                'fecha_inicio' => Carbon::parse('2024-11-30'),
                'fecha_fin' => Carbon::parse('2024-11-30'),
                'tipo_evento' => 'Premiación',
                'anio_olimpiada' => 2024,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];
        
        // Eventos específicos por área
        foreach ($areas as $area) {
            $cronogramas[] = [
                'competencia_id' => $competencia->competencia_id,
                'area_id' => $area->area_id,
                'nombre_evento' => 'Etapa de Inscripcion ' . $area->nombre,
                'descripcion' => 'Primera fase inscripciones habilitadas de la competencia para el área de ' . $area->nombre,
                'fecha_inicio' => Carbon::parse('2024-09-15'),
                'fecha_fin' => Carbon::parse('2024-09-15'),
                'tipo_evento' => 'Inscripcion',
                'anio_olimpiada' => 2024,
                'created_at' => now(),
                'updated_at' => now(),
            ];
            
            $cronogramas[] = [
                'competencia_id' => $competencia->competencia_id,
                'area_id' => $area->area_id,
                'nombre_evento' => 'Segunda fase ' . $area->nombre,
                'descripcion' => 'Segunda fase: competencia para el área de ' . $area->nombre,
                'fecha_inicio' => Carbon::parse('2024-10-15'),
                'fecha_fin' => Carbon::parse('2024-10-15'),
                'tipo_evento' => 'Competencia',
                'anio_olimpiada' => 2024,
                'created_at' => now(),
                'updated_at' => now(),
            ];
            
            $cronogramas[] = [
                'competencia_id' => $competencia->competencia_id,
                'area_id' => $area->area_id,
                'nombre_evento' => 'Fase final ' . $area->nombre,
                'descripcion' => 'Fase final de competencia para el área de ' . $area->nombre,
                'fecha_inicio' => Carbon::parse('2024-11-15'),
                'fecha_fin' => Carbon::parse('2024-11-15'),
                'tipo_evento' => 'Fin',
                'anio_olimpiada' => 2024,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        DB::table('cronograma')->insert($cronogramas);
    }
}
