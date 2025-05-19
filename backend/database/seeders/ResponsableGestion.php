<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ResponsableGestion extends Seeder{
    public function run(){
        $responsables = [
            [
                'ci' => '3452789',
                'nombres' => 'Juan Carlos',
                'apellidos' => 'Mendoza López',
                'correo_electronico' => 'jcmendoza@umss.edu.bo',
                'telefono' => '70712345',
                'fecha_asignacion' => Carbon::parse('2024-01-15'),
                'estado' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'ci' => '4567890',
                'nombres' => 'María Elena',
                'apellidos' => 'Vargas Rojas',
                'correo_electronico' => 'mevargas@umss.edu.bo',
                'telefono' => '70723456',
                'fecha_asignacion' => Carbon::parse('2024-01-15'),
                'estado' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'ci' => '5678901',
                'nombres' => 'Roberto Carlos',
                'apellidos' => 'Guzmán Torrico',
                'correo_electronico' => 'rcguzman@umss.edu.bo',
                'telefono' => '70734567',
                'fecha_asignacion' => Carbon::parse('2024-01-20'),
                'estado' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'ci' => '6789012',
                'nombres' => 'Patricia',
                'apellidos' => 'Montaño Quiroga',
                'correo_electronico' => 'pmontano@umss.edu.bo',
                'telefono' => '70745678',
                'fecha_asignacion' => Carbon::parse('2024-01-20'),
                'estado' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'ci' => '7890123',
                'nombres' => 'Fernando José',
                'apellidos' => 'Camacho Suárez',
                'correo_electronico' => 'fjcamacho@umss.edu.bo',
                'telefono' => '70756789',
                'fecha_asignacion' => Carbon::parse('2024-01-25'),
                'estado' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('responsable_gestion')->insert($responsables);
    }
}
