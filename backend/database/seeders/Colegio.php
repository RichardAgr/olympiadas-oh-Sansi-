<?php

namespace Database\Seeders;
use Illuminate\Support\Facades\DB;

use Illuminate\Database\Seeder;

class Colegio extends Seeder{
    public function run(){
        // Obtener IDs de ubicaciones
        $ubicaciones = DB::table('ubicacion')->get();
        $ubicacion_ids = [];
        foreach ($ubicaciones as $ubicacion) {
            $key = $ubicacion->departamento . '-' . $ubicacion->provincia;
            $ubicacion_ids[$key] = $ubicacion->ubicacion_id;
        }

        $colegios = [
            [
                'ubicacion_id' => $ubicacion_ids['Cochabamba-Cercado'],
                'nombre' => 'Unidad Educativa Nueva Esperanza',
                'telefono' => '44123456',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'ubicacion_id' => $ubicacion_ids['Cochabamba-Cercado'],
                'nombre' => 'Santo Domingo Savio A',
                'telefono' => '44234567',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'ubicacion_id' => $ubicacion_ids['Cochabamba-Cercado'],
                'nombre' => 'Colegio San Agustín',
                'telefono' => '44345678',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'ubicacion_id' => $ubicacion_ids['Cochabamba-Quillacollo'],
                'nombre' => 'Unidad Educativa Simón Bolívar',
                'telefono' => '44456789',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'ubicacion_id' => $ubicacion_ids['Cochabamba-Sacaba'],
                'nombre' => 'Colegio Don Bosco',
                'telefono' => '44567890',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'ubicacion_id' => $ubicacion_ids['La Paz-Murillo'],
                'nombre' => 'Colegio San Calixto',
                'telefono' => '22123456',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'ubicacion_id' => $ubicacion_ids['La Paz-Murillo'],
                'nombre' => 'Colegio Alemán',
                'telefono' => '22234567',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'ubicacion_id' => $ubicacion_ids['Santa Cruz-Andrés Ibáñez'],
                'nombre' => 'Colegio La Salle',
                'telefono' => '33123456',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'ubicacion_id' => $ubicacion_ids['Santa Cruz-Andrés Ibáñez'],
                'nombre' => 'Unidad Educativa Santa Cruz',
                'telefono' => '33234567',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'ubicacion_id' => $ubicacion_ids['Oruro-Cercado'],
                'nombre' => 'Colegio Nacional Bolívar',
                'telefono' => '25123456',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('colegio')->insert($colegios);
    }
}
