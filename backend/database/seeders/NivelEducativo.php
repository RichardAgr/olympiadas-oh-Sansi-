<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class NivelEducativo extends Seeder
{
    public function run(){
        $niveles = [
            [
                'nombre' => 'Primaria',
                'abreviatura' => 'P',
                'orden' => 1,
                'estado' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'Secundaria',
                'abreviatura' => 'S',
                'orden' => 2,
                'estado' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('nivel_educativo')->insert($niveles);
    }
}
