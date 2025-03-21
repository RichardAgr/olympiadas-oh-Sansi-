<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class Competencia extends Seeder{
    public function run(){
        $competencias = [
            [
                'nombre_competencia' => 'Olimpiada Oh! SanSi 2024',
                'descripcion' => 'Olimpiada Científica Nacional San Simón 2024 en todas las áreas de competencia.',
                'fecha_inicio' => Carbon::parse('2024-08-01'),
                'estado' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre_competencia' => 'Olimpiada Oh! SanSi 2023',
                'descripcion' => 'Olimpiada Científica Nacional San Simón 2023 en todas las áreas de competencia.',
                'fecha_inicio' => Carbon::parse('2023-08-01'),
                'estado' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre_competencia' => 'Olimpiada Oh! SanSi 2025',
                'descripcion' => 'Olimpiada Científica Nacional San Simón 2025 en todas las áreas de competencia (planificada).',
                'fecha_inicio' => Carbon::parse('2025-08-01'),
                'estado' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('competencia')->insert($competencias);
    }
}
