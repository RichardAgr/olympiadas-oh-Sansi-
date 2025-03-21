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
            [
                'ci' => '5678901',
                'nombres' => 'Roberto',
                'apellidos' => 'Guzmán Torrico',
                'correo_electronico' => 'roberto.guzman@gmail.com',
                'telefono' => '70456789',
                'estado' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'ci' => '6789012',
                'nombres' => 'María',
                'apellidos' => 'López Suárez',
                'correo_electronico' => 'maria.lopez@gmail.com',
                'telefono' => '70567890',
                'estado' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'ci' => '7890123',
                'nombres' => 'Fernando',
                'apellidos' => 'Camacho Vargas',
                'correo_electronico' => 'fernando.camacho@gmail.com',
                'telefono' => '70678901',
                'estado' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'ci' => '8901234',
                'nombres' => 'Lucía',
                'apellidos' => 'Montaño Quiroga',
                'correo_electronico' => 'lucia.montano@gmail.com',
                'telefono' => '70789012',
                'estado' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'ci' => '9012345',
                'nombres' => 'Jorge',
                'apellidos' => 'Pérez Rojas',
                'correo_electronico' => 'jorge.perez@gmail.com',
                'telefono' => '70890123',
                'estado' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'ci' => '0123456',
                'nombres' => 'Ana',
                'apellidos' => 'Rodríguez Torrico',
                'correo_electronico' => 'ana.rodriguez@gmail.com',
                'telefono' => '70901234',
                'estado' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('tutor')->insert($tutores);
    }
}
