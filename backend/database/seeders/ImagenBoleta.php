<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ImagenBoleta extends Seeder{
    public function run(): void{
        $boletaIds = DB::table('boleta')->pluck('boleta_id')->toArray();
        
        if (empty($boletaIds)) {
            $this->command->info('No hay boletas en la base de datos. Ejecuta BoletaSeeder primero.');
            return;
        }
        
        $imagenes = [];
        
        foreach ($boletaIds as $boletaId) {
            $numImagenes = rand(1, 2);
            
            for ($i = 1; $i <= $numImagenes; $i++) {
                $imagenes[] = [
                    'boleta_id' => $boletaId,
                    'ruta_imagen' => 'storage/boletas/boleta_' . $boletaId . '_' . $i . '.jpg',
                    'fecha_subida' => Carbon::now()->subDays(rand(0, 15)),
                    'estado' => true,
                    'created_at' => Carbon::now(),
                    'updated_at' => Carbon::now(),
                ];
            }
        }
        
        // Insertar imágenes en lotes
        DB::table('imagen_boleta')->insert($imagenes);
        
        $this->command->info('Se han creado ' . count($imagenes) . ' imágenes de boletas.');
    }
}
