<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class Competidor extends Seeder{
     public function run()
    {
        $colegios = DB::table('colegio')->get();
        $cursos = DB::table('curso')->get();
        $ubicaciones = DB::table('ubicacion')->get();

        if ($cursos->isEmpty() || $colegios->isEmpty() || $ubicaciones->isEmpty()) {
            echo "Error: Ejecuta primero los seeders de Colegio, Curso y Ubicacion\n";
            return;
        }

        $competidores = [];
        $estados = ['Pendiente', 'Habilitado', 'Deshabilitado'];
        
        // Generar 60 competidores (10 por cada tutor que crearemos después)
        for ($i = 0; $i < 60; $i++) {
            $colegio = $colegios->random();
            $curso = $cursos->random();
            $ubicacion = $ubicaciones->where('ubicacion_id', $colegio->ubicacion_id)->first() ?? $ubicaciones->random();
            
            $genero = rand(0, 1) ? 'male' : 'female';
            
            $competidores[] = [
                'colegio_id' => $colegio->colegio_id,
                'curso_id' => $curso->curso_id,
                'ubicacion_id' => $ubicacion->ubicacion_id,
                'nombres' => $this->generateName($genero),
                'apellidos' => $this->generateLastName() . ' ' . $this->generateLastName(),
                'ci' => $this->generateCI(),
                'fecha_nacimiento' => $this->generateBirthDate($curso->nombre),
                'estado' => $estados[array_rand($estados)],
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        DB::table('competidor')->insert($competidores);
    }
    
    private function generateName($gender)
    {
        $maleNames = ['Juan', 'Carlos', 'Luis', 'Pedro', 'Jorge', 'Fernando', 'Diego', 'Andrés', 'José', 'Miguel'];
        $femaleNames = ['María', 'Ana', 'Lucía', 'Sofía', 'Patricia', 'Carmen', 'Laura', 'Daniela', 'Valeria', 'Gabriela'];
        
        $names = $gender == 'male' ? $maleNames : $femaleNames;
        $secondName = rand(0, 1) ? ' ' . $names[array_rand($names)] : '';
        
        return $names[array_rand($names)] . $secondName;
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
    
    private function generateBirthDate($cursoNombre)
    {
        // Determinar rango de edad basado en el curso
        if (strpos($cursoNombre, 'Primaria') !== false) {
            $grade = (int) substr($cursoNombre, 0, 1);
            $age = 6 + $grade - 1 + rand(0, 1); // Edad típica para el grado ±1 año
        } else {
            $grade = (int) substr($cursoNombre, 0, 1);
            $age = 12 + $grade - 1 + rand(0, 1); // Edad típica para el grado ±1 año
        }
        
        $year = date('Y') - $age;
        $month = rand(1, 12);
        $day = rand(1, 28);
        
        return Carbon::create($year, $month, $day);
    }
}
