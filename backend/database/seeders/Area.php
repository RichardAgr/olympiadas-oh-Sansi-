<?php

namespace Database\Seeders;
use Illuminate\Support\Facades\DB;

use Illuminate\Database\Seeder;

class Area extends Seeder{
    public function run(){
        $areas = [
            [
                'nombre' => 'MATEMÁTICA',
                'descripcion' => 'Área de competencia en matemáticas para estudiantes de primaria y secundaria.',
                'costo' => 15,
                'estado' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'FÍSICA',
                'descripcion' => 'Área de competencia en física para estudiantes de secundaria.',
                'costo' => 15,
                'estado' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'QUÍMICA',
                'descripcion' => 'Área de competencia en química para estudiantes de secundaria.',
                'costo' => 15,
                'estado' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'BIOLOGÍA',
                'descripcion' => 'Área de competencia en biología para estudiantes de secundaria.',
                'costo' => 15,
                'estado' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'ASTRONOMÍA Y ASTROFÍSICA',
                'descripcion' => 'Área de competencia en astronomía y astrofísica para estudiantes de primaria y secundaria.',
                'costo' => 15,
                'estado' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'INFORMÁTICA',
                'descripcion' => 'Área de competencia en informática para estudiantes de primaria y secundaria.',
                'costo' => 15,
                'estado' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'ROBÓTICA',
                'descripcion' => 'Área de competencia en robótica para estudiantes de primaria y secundaria.',
                'costo' => 15,
                'estado' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('area')->insert($areas);
    }
}
