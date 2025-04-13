<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class Boleta extends Seeder{
    public function run(): void{
        $tutorIds = DB::table('tutor')->pluck('tutor_id')->toArray();
        
        if (empty($tutorIds)) {
            $this->command->info('No hay tutores en la base de datos.');
            return;
        }
        
        $boletas = [];
        
        for ($i = 1; $i <= 6; $i++) {
            $fechaEmision = Carbon::now()->subDays(rand(1, 30));
            $fechaPago = rand(0, 10) > 2 ? $fechaEmision->copy()->addDays(rand(1, 3)) : null;
            
            $boletas[] = [
                'tutor_id' => $tutorIds[array_rand($tutorIds)],
                'numero_boleta' => 'BOL-' . str_pad($i, 5, '0', STR_PAD_LEFT),
                'nombre_pagador' => 'Pagador ' . $i,
                'monto_total' => rand(15, 100) * 15, // Múltiplos de 15 (costo por área)
                'fecha_emision' => $fechaEmision,
                'fecha_pago' => $fechaPago,
                'estado' => $fechaPago !== null,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ];
        }
        
        DB::table('boleta')->insert($boletas);
        
        $this->command->info('Se han creado 6 boletas de ejemplo.');
    }
}
