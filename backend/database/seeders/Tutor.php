<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class Tutor extends Seeder{
    public function run()
    {
        $tutores = [];
        
        // Crear 6 tutores (para asignarles competidores después)
        for ($i = 0; $i < 6; $i++) {
            $gender = rand(0, 1) ? 'male' : 'female';
            $firstName = $this->generateFirstName($gender);
            $lastName1 = $this->generateLastName();
            $lastName2 = $this->generateLastName();
            
            $tutores[] = [
                'ci' => $this->generateCI(),
                'nombres' => $firstName,
                'apellidos' => $lastName1 . ' ' . $lastName2,
                'correo_electronico' => strtolower($firstName) . '.' . strtolower($lastName1) . '@example.com',
                'telefono' => '7' . str_pad(rand(0, 9999999), 7, '0', STR_PAD_LEFT),
                'estado' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        DB::table('tutor')->insert($tutores);
    }
    
    private function generateFirstName($gender)
    {
        $maleNames = ['Juan', 'Carlos', 'Luis', 'Pedro', 'Jorge', 'Fernando', 'Diego', 'Andrés', 'José', 'Miguel'];
        $femaleNames = ['María', 'Ana', 'Lucía', 'Sofía', 'Patricia', 'Carmen', 'Laura', 'Daniela', 'Valeria', 'Gabriela'];
        
        return $gender == 'male' 
            ? $maleNames[array_rand($maleNames)]
            : $femaleNames[array_rand($femaleNames)];
    }
    
    private function generateLastName()
    {
        $lastNames = ['García', 'Rodríguez', 'González', 'Fernández', 'López', 'Martínez', 'Sánchez', 'Pérez', 'Gómez', 'Martín'];
        return $lastNames[array_rand($lastNames)];
    }
    
    private function generateCI()
    {
        return str_pad(rand(1000000, 9999999), 7, '0', STR_PAD_LEFT);
    }
}
