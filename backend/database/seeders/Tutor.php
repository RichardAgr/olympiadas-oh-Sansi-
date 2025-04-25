<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class Tutor extends Seeder{
    public function run(){
        $tutores = [
            [
                'ci' => '1234567',
                'nombres' => 'Jofre',
                'apellidos' => 'Ticona Plata',
                'correo_electronico' => 'jofre.ticona@gmail.com',
                'telefono' => '70123456',
                'estado' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'ci' => '2345678',
                'nombres' => 'Daysi',
                'apellidos' => 'Grageda González',
                'correo_electronico' => 'daysigragedagonzales@gmail.com',
                'telefono' => '76464453',
                'estado' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'ci' => '3456789',
                'nombres' => 'Carlos',
                'apellidos' => 'Mendoza Quiroga',
                'correo_electronico' => 'carlos.mendoza@gmail.com',
                'telefono' => '70234567',
                'estado' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'ci' => '4567890',
                'nombres' => 'Patricia',
                'apellidos' => 'Flores Rojas',
                'correo_electronico' => 'patricia.flores@gmail.com',
                'telefono' => '70345678',
                'estado' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('tutor')->insert($tutores);
    }
}
