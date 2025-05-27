<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class UsuarioDemoSeeder extends Seeder
{
    public function run(): void
    {
        // Tutor demo
        DB::table('tutor')->insert([
            'ci' => '12345678',
            'nombres' => 'Fer',
            'apellidos' => 'Gómez',
            'correo_electronico' => 'tutor@sansi.bo',
            'telefono' => '78945612',
            'estado' => 1,
            'password' => Hash::make('tutor1234'),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Responsable de Gestión demo
        DB::table('responsable_gestion')->insert([
            'ci' => '87654321',
            'nombres' => 'Vale',
            'apellidos' => 'Rojas',
            'correo_electronico' => 'responsable@sansi.bo',
            'telefono' => '71234567',
            'fecha_asignacion' => now(),
            'estado' => 1,
            'password' => Hash::make('resp1234'),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Admin demo
        DB::table('admin')->insert([
            'nombre' => 'Vale Admin',
            'correo_electronico' => 'admin@sansi.bo',
            'password' => Hash::make('admin1234'),
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}

