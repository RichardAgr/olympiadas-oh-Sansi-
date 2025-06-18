<?php

namespace Database\Seeders;
use Illuminate\Support\Facades\DB;

use Illuminate\Database\Seeder;

class Area extends Seeder{
    public function run(){
        $areas = [
            [
                'nombre' => 'MATEMATICA',
                'descripcion' => 'Área de competencia en matemáticas para estudiantes de primaria y secundaria.',
                'competencia_id'=>1,
                'costo' => 15,
                'estado' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'FISICA',
                'descripcion' => 'Área de competencia en física para estudiantes de secundaria.',
                'competencia_id'=>1,
                'costo' => 15,
                'estado' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'QUIMICA',
                'descripcion' => 'Área de competencia en química para estudiantes de secundaria.',
                'competencia_id'=>2,
                'costo' => 15,
                'estado' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'BIOLOGIA',
                'descripcion' => 'Área de competencia en biología para estudiantes de secundaria.',
                'competencia_id'=>2,
                'costo' => 15,
                'estado' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('area')->insert($areas);
    }
}
