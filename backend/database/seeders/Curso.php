<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class Curso extends Seeder{
    public function run(){
        // Obtener IDs de grados
        $grados = DB::table('grado')->get();
        
        $cursos = [];
        
        // Para cada grado, crear 3 cursos (A, B, C)
        foreach ($grados as $grado) {
            $letras = ['A', 'B', 'C'];
            
            foreach ($letras as $letra) {
                $cursos[] = [
                    'grado_id' => $grado->grado_id,
                    'nombre' => $grado->nombre . ' ' . $letra,
                    'estado' => true,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        }
        
        DB::table('curso')->insert($cursos);
    }
}
