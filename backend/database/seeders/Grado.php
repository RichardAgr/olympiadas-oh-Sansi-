<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class Grado extends Seeder{
    public function run(){
        $primaria_id = DB::table('nivel_educativo')->where('nombre', 'Primaria')->value('nivel_educativo_id');
        $secundaria_id = DB::table('nivel_educativo')->where('nombre', 'Secundaria')->value('nivel_educativo_id');

        // Grados de primaria
        $grados_primaria = [];
        for ($i = 1; $i <= 6; $i++) {
            $grados_primaria[] = [
                'nivel_educativo_id' => $primaria_id,
                'nombre' => $i . 'ro Primaria',
                'abreviatura' => $i . 'P',
                'orden' => $i,
                'estado' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }
        DB::table('grado')->insert($grados_primaria);

        // Grados de secundaria
        $grados_secundaria = [];
        for ($i = 1; $i <= 6; $i++) {
            $grados_secundaria[] = [
                'nivel_educativo_id' => $secundaria_id,
                'nombre' => $i . 'ro Secundaria',
                'abreviatura' => $i . 'S',
                'orden' => $i + 6,
                'estado' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }
        DB::table('grado')->insert($grados_secundaria);
    }
}
