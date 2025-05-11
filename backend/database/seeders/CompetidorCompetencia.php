<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class CompetidorCompetencia extends Seeder{
    public function run(){
        // Obtener datos necesarios
        $competidores = DB::table('competidor')->get();
        $competencia = DB::table('competencia')->where('nombre_competencia', 'Olimpiada Oh! SanSi 2024')->first();
        $areas = DB::table('area')->get();
        $niveles_categorias = DB::table('nivel_categoria')->get();
        $tutoresCompetidores = DB::table('tutor_competidor')
            ->where('nivel_respansabilidad', 'Principal')
            ->get()
            ->groupBy('tutor_id');
        
        // Obtener o crear boletas para cada tutor
        $boletasPorTutor = [];
        foreach ($tutoresCompetidores as $tutorId => $relaciones) {
            $fechaEmision = Carbon::now()->subDays(rand(1, 30));
            $fechaPago = rand(0, 10) > 2 ? $fechaEmision->copy()->addDays(rand(1, 3)) : null;
            
            $boletaId = DB::table('boleta')->insertGetId([
                'tutor_id' => $tutorId,
                'numero_boleta' => 'BOL-' . str_pad(rand(1000, 9999), 5, '0', STR_PAD_LEFT),
                'nombre_pagador' => DB::table('tutor')->where('tutor_id', $tutorId)->value('nombres') . ' ' . 
                                   DB::table('tutor')->where('tutor_id', $tutorId)->value('apellidos'),
                'monto_total' => count($relaciones) * 150, // $150 por competidor
                'fecha_pago' => $fechaPago,
                'estado' => $fechaPago !== null,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            
            $boletasPorTutor[$tutorId] = $boletaId;
            
            // Crear imagen de boleta si está pagada
            if ($fechaPago !== null) {
                $googleDriveLinks = [
                    'https://i.ibb.co/svnPKS1b/boleta1.jpg',
                    'https://drive.google.com/file/d/1hg76Wy-L_au8AixQvAXB1qm4MrgpvGEt/view?usp=drive_link',
                    'https://drive.google.com/file/d/1wqUU2h4cbuaIt9ti34RbX5gPJsSuYdvz/view?usp=drive_link',
                    'https://drive.google.com/file/d/16mi8Hrmck874RejlmdT_s2wJL9IVL35a/view?usp=drive_link'
                ];
                
                DB::table('imagen_boleta')->insert([
                    'boleta_id' => $boletaId,
                    'ruta_imagen' => $googleDriveLinks[array_rand($googleDriveLinks)],
                    'fecha_subida' => $fechaPago,
                    'estado' => true,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
        
        // Inscripciones de competidores con referencia a boleta
        $inscripciones = [];
        
        // Mapeo de competidores específicos a áreas y categorías
        $inscripcionesEspecificas = [
            '14268363' => ['QUÍMICA', '6S'],
            '15582477' => ['ROBÓTICA', 'Lego P'],
            '14567890' => ['FÍSICA', '4S'],
            '14567890' => ['MATEMÁTICA', 'Cuarto Nivel'], // Segundo registro para el mismo competidor
            '14678901' => ['BIOLOGÍA', '3S'],
            '14789012' => ['QUÍMICA', '2S'],
            '14890123' => ['MATEMÁTICA', 'Primer Nivel'],
            '14901234' => ['INFORMÁTICA', 'Guacamayo'],
            '15012345' => ['ROBÓTICA', 'Builders P'],
            '15123456' => ['ASTRONOMÍA Y ASTROFÍSICA', '4P'],
            '15234567' => ['ASTRONOMÍA Y ASTROFÍSICA', '3P']
        ];
        
        // Procesar inscripciones específicas
        foreach ($inscripcionesEspecificas as $ci => $datos) {
            $competidor = $competidores->where('ci', $ci)->first();
            if (!$competidor) continue;
            
            $tutorId = DB::table('tutor_competidor')
                ->where('competidor_id', $competidor->competidor_id)
                ->where('nivel_respansabilidad', 'Principal')
                ->value('tutor_id');
                
            $inscripciones[] = [
                'competidor_id' => $competidor->competidor_id,
                'competencia_id' => $competencia->competencia_id,
                'area_id' => $areas->where('nombre', $datos[0])->first()->area_id,
                'nivel_categoria_id' => $niveles_categorias
                    ->where('area_id', $areas->where('nombre', $datos[0])->first()->area_id)
                    ->where('nombre', $datos[1])->first()->nivel_categoria_id,
                'boleta_id' => $boletasPorTutor[$tutorId] ?? null,
                'fecha_inscripcion' => Carbon::now()->subDays(rand(1, 15)),
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }
        
        // Inscribir competidores adicionales (hasta 25)
        $competidoresRestantes = $competidores->whereNotIn('ci', array_keys($inscripcionesEspecificas));
        $areasDisponibles = $areas->pluck('nombre')->toArray();
        
        foreach ($competidoresRestantes as $competidor) {
            $areaNombre = $areasDisponibles[array_rand($areasDisponibles)];
            $area = $areas->where('nombre', $areaNombre)->first();
            $categoriasArea = $niveles_categorias->where('area_id', $area->area_id);
            
            $tutorId = DB::table('tutor_competidor')
                ->where('competidor_id', $competidor->competidor_id)
                ->where('nivel_respansabilidad', 'Principal')
                ->value('tutor_id');
            
            $inscripciones[] = [
                'competidor_id' => $competidor->competidor_id,
                'competencia_id' => $competencia->competencia_id,
                'area_id' => $area->area_id,
                'nivel_categoria_id' => $categoriasArea->random()->nivel_categoria_id,
                'boleta_id' => $boletasPorTutor[$tutorId] ?? null,
                'fecha_inscripcion' => Carbon::now()->subDays(rand(1, 15)),
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        DB::table('competidor_competencia')->insert($inscripciones);
    }
}
