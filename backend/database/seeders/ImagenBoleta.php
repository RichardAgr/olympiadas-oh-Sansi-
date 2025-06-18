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
        
        $googleDriveLinks = [
            'https://i.ibb.co/svnPKS1b/boleta1.jpg',
            'https://drive.google.com/file/d/1hg76Wy-L_au8AixQvAXB1qm4MrgpvGEt/view?usp=drive_link',
            'https://drive.google.com/file/d/1wqUU2h4cbuaIt9ti34RbX5gPJsSuYdvz/view?usp=drive_link',
            'https://drive.google.com/file/d/16mi8Hrmck874RejlmdT_s2wJL9IVL35a/view?usp=drive_link',
            'https://drive.google.com/file/d/1jkGDokqAXAo3_uMXGd49GSM_WgCBfhu2/view?usp=drive_link',
            'https://drive.google.com/file/d/13vy0-Vmluqq-12NPcjPsJDIx5gZFNGAp/view?usp=drive_link'
        ];
        $imagenes = [];
        $totalLinks = count($googleDriveLinks);
        foreach ($boletaIds as $index => $boletaId) {
                $linkIndex = $index % $totalLinks;
                
                $imagenes[] = [
                    'boleta_id' => $boletaId,
                    'ruta_imagen' => $googleDriveLinks[0], //luego cambiar  a $linkIndex
                    'fecha_subida' => Carbon::now()->subDays(rand(0, 15)),
                    'estado' => true,
                    'created_at' => Carbon::now(),
                    'updated_at' => Carbon::now(),
                ];
            }
        
        DB::table('imagen_boleta')->insert($imagenes);
        
        $this->command->info('Se han creado ' . count($imagenes) . ' imágenes de boletas.');
    }
}
