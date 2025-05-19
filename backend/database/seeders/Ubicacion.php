<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class Ubicacion extends Seeder{
    public function run(){
        $ubicaciones = [
            [
                'departamento' => 'Cochabamba',
                'provincia' => 'Cercado',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'departamento' => 'Cochabamba',
                'provincia' => 'Quillacollo',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'departamento' => 'Cochabamba',
                'provincia' => 'Sacaba',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'departamento' => 'La Paz',
                'provincia' => 'Murillo',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'departamento' => 'La Paz',
                'provincia' => 'Ingavi',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'departamento' => 'Santa Cruz',
                'provincia' => 'Andrés Ibáñez',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'departamento' => 'Santa Cruz',
                'provincia' => 'Warnes',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'departamento' => 'Oruro',
                'provincia' => 'Cercado',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'departamento' => 'Potosí',
                'provincia' => 'Tomás Frías',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'departamento' => 'Chuquisaca',
                'provincia' => 'Oropeza',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'departamento' => 'Tarija',
                'provincia' => 'Cercado',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'departamento' => 'Beni',
                'provincia' => 'Cercado',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'departamento' => 'Pando',
                'provincia' => 'Nicolás Suárez',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('ubicacion')->insert($ubicaciones);
    }
}
