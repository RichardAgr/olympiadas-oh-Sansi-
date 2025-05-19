<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class NivelCategoria extends Seeder{
    public function run(){
        // Obtener IDs de áreas
        $areas = DB::table('area')->get();
        $area_ids = [];
        foreach ($areas as $area) {
            $area_ids[$area->nombre] = $area->area_id;
        }

        // Obtener IDs de grados
        $grados = DB::table('grado')->get();
        $grado_ids = [];
        foreach ($grados as $grado) {
            $grado_ids[$grado->abreviatura] = $grado->grado_id;
        }

        // Niveles/categorías según el Anexo B
        $niveles_categorias = [
            // ASTRONOMÍA - ASTROFÍSICA
            [
                'area_id' => $area_ids['ASTRONOMÍA Y ASTROFÍSICA'],
                'grado_id_inicial' => $grado_ids['3P'],
                'grado_id_final' => $grado_ids['3P'],
                'nombre' => '3P',
                'descripcion' => 'Nivel para 3ro Primaria',
                'estado' => true,
            ],
            [
                'area_id' => $area_ids['ASTRONOMÍA Y ASTROFÍSICA'],
                'grado_id_inicial' => $grado_ids['4P'],
                'grado_id_final' => $grado_ids['4P'],
                'nombre' => '4P',
                'descripcion' => 'Nivel para 4to Primaria',
                'estado' => true,
            ],
            [
                'area_id' => $area_ids['ASTRONOMÍA Y ASTROFÍSICA'],
                'grado_id_inicial' => $grado_ids['5P'],
                'grado_id_final' => $grado_ids['5P'],
                'nombre' => '5P',
                'descripcion' => 'Nivel para 5to Primaria',
                'estado' => true,
            ],
            [
                'area_id' => $area_ids['ASTRONOMÍA Y ASTROFÍSICA'],
                'grado_id_inicial' => $grado_ids['6P'],
                'grado_id_final' => $grado_ids['6P'],
                'nombre' => '6P',
                'descripcion' => 'Nivel para 6to Primaria',
                'estado' => true,
            ],
            [
                'area_id' => $area_ids['ASTRONOMÍA Y ASTROFÍSICA'],
                'grado_id_inicial' => $grado_ids['1S'],
                'grado_id_final' => $grado_ids['1S'],
                'nombre' => '1S',
                'descripcion' => 'Nivel para 1ro Secundaria',
                'estado' => true,
            ],
            [
                'area_id' => $area_ids['ASTRONOMÍA Y ASTROFÍSICA'],
                'grado_id_inicial' => $grado_ids['2S'],
                'grado_id_final' => $grado_ids['2S'],
                'nombre' => '2S',
                'descripcion' => 'Nivel para 2do Secundaria',
                'estado' => true,
            ],
            [
                'area_id' => $area_ids['ASTRONOMÍA Y ASTROFÍSICA'],
                'grado_id_inicial' => $grado_ids['3S'],
                'grado_id_final' => $grado_ids['3S'],
                'nombre' => '3S',
                'descripcion' => 'Nivel para 3ro Secundaria',
                'estado' => true,
            ],
            [
                'area_id' => $area_ids['ASTRONOMÍA Y ASTROFÍSICA'],
                'grado_id_inicial' => $grado_ids['4S'],
                'grado_id_final' => $grado_ids['4S'],
                'nombre' => '4S',
                'descripcion' => 'Nivel para 4to Secundaria',
                'estado' => true,
            ],
            [
                'area_id' => $area_ids['ASTRONOMÍA Y ASTROFÍSICA'],
                'grado_id_inicial' => $grado_ids['5S'],
                'grado_id_final' => $grado_ids['5S'],
                'nombre' => '5S',
                'descripcion' => 'Nivel para 5to Secundaria',
                'estado' => true,
            ],
            [
                'area_id' => $area_ids['ASTRONOMÍA Y ASTROFÍSICA'],
                'grado_id_inicial' => $grado_ids['6S'],
                'grado_id_final' => $grado_ids['6S'],
                'nombre' => '6S',
                'descripcion' => 'Nivel para 6to Secundaria',
                'estado' => true,
            ],
            
            // BIOLOGÍA
            [
                'area_id' => $area_ids['BIOLOGÍA'],
                'grado_id_inicial' => $grado_ids['2S'],
                'grado_id_final' => $grado_ids['2S'],
                'nombre' => '2S',
                'descripcion' => 'Nivel para 2do Secundaria',
                'estado' => true,
            ],
            [
                'area_id' => $area_ids['BIOLOGÍA'],
                'grado_id_inicial' => $grado_ids['3S'],
                'grado_id_final' => $grado_ids['3S'],
                'nombre' => '3S',
                'descripcion' => 'Nivel para 3ro Secundaria',
                'estado' => true,
            ],
            [
                'area_id' => $area_ids['BIOLOGÍA'],
                'grado_id_inicial' => $grado_ids['4S'],
                'grado_id_final' => $grado_ids['4S'],
                'nombre' => '4S',
                'descripcion' => 'Nivel para 4to Secundaria',
                'estado' => true,
            ],
            [
                'area_id' => $area_ids['BIOLOGÍA'],
                'grado_id_inicial' => $grado_ids['5S'],
                'grado_id_final' => $grado_ids['5S'],
                'nombre' => '5S',
                'descripcion' => 'Nivel para 5to Secundaria',
                'estado' => true,
            ],
            [
                'area_id' => $area_ids['BIOLOGÍA'],
                'grado_id_inicial' => $grado_ids['6S'],
                'grado_id_final' => $grado_ids['6S'],
                'nombre' => '6S',
                'descripcion' => 'Nivel para 6to Secundaria',
                'estado' => true,
            ],
            
            // FÍSICA
            [
                'area_id' => $area_ids['FÍSICA'],
                'grado_id_inicial' => $grado_ids['4S'],
                'grado_id_final' => $grado_ids['4S'],
                'nombre' => '4S',
                'descripcion' => 'Nivel para 4to Secundaria',
                'estado' => true,
            ],
            [
                'area_id' => $area_ids['FÍSICA'],
                'grado_id_inicial' => $grado_ids['5S'],
                'grado_id_final' => $grado_ids['5S'],
                'nombre' => '5S',
                'descripcion' => 'Nivel para 5to Secundaria',
                'estado' => true,
            ],
            [
                'area_id' => $area_ids['FÍSICA'],
                'grado_id_inicial' => $grado_ids['6S'],
                'grado_id_final' => $grado_ids['6S'],
                'nombre' => '6S',
                'descripcion' => 'Nivel para 6to Secundaria',
                'estado' => true,
            ],
            
            // INFORMÁTICA
            [
                'area_id' => $area_ids['INFORMÁTICA'],
                'grado_id_inicial' => $grado_ids['5P'],
                'grado_id_final' => $grado_ids['6P'],
                'nombre' => 'Guacamayo',
                'descripcion' => 'Categoría para 5to a 6to Primaria',
                'estado' => true,
            ],
            [
                'area_id' => $area_ids['INFORMÁTICA'],
                'grado_id_inicial' => $grado_ids['1S'],
                'grado_id_final' => $grado_ids['3S'],
                'nombre' => 'Guanaco',
                'descripcion' => 'Categoría para 1ro a 3ro Secundaria',
                'estado' => true,
            ],
            [
                'area_id' => $area_ids['INFORMÁTICA'],
                'grado_id_inicial' => $grado_ids['1S'],
                'grado_id_final' => $grado_ids['3S'],
                'nombre' => 'Londra',
                'descripcion' => 'Categoría para 1ro a 3ro Secundaria',
                'estado' => true,
            ],
            [
                'area_id' => $area_ids['INFORMÁTICA'],
                'grado_id_inicial' => $grado_ids['4S'],
                'grado_id_final' => $grado_ids['6S'],
                'nombre' => 'Jucumari',
                'descripcion' => 'Categoría para 4to a 6to Secundaria',
                'estado' => true,
            ],
            [
                'area_id' => $area_ids['INFORMÁTICA'],
                'grado_id_inicial' => $grado_ids['1S'],
                'grado_id_final' => $grado_ids['3S'],
                'nombre' => 'Bufeo',
                'descripcion' => 'Categoría para 1ro a 3ro Secundaria',
                'estado' => true,
            ],
            [
                'area_id' => $area_ids['INFORMÁTICA'],
                'grado_id_inicial' => $grado_ids['4S'],
                'grado_id_final' => $grado_ids['6S'],
                'nombre' => 'Puma',
                'descripcion' => 'Categoría para 4to a 6to Secundaria',
                'estado' => true,
            ],
            
            // MATEMÁTICAS
            [
                'area_id' => $area_ids['MATEMÁTICA'],
                'grado_id_inicial' => $grado_ids['1S'],
                'grado_id_final' => $grado_ids['1S'],
                'nombre' => 'Primer Nivel',
                'descripcion' => 'Nivel para 1ro Secundaria',
                'estado' => true,
            ],
            [
                'area_id' => $area_ids['MATEMÁTICA'],
                'grado_id_inicial' => $grado_ids['2S'],
                'grado_id_final' => $grado_ids['2S'],
                'nombre' => 'Segundo Nivel',
                'descripcion' => 'Nivel para 2do Secundaria',
                'estado' => true,
            ],
            [
                'area_id' => $area_ids['MATEMÁTICA'],
                'grado_id_inicial' => $grado_ids['3S'],
                'grado_id_final' => $grado_ids['3S'],
                'nombre' => 'Tercer Nivel',
                'descripcion' => 'Nivel para 3ro Secundaria',
                'estado' => true,
            ],
            [
                'area_id' => $area_ids['MATEMÁTICA'],
                'grado_id_inicial' => $grado_ids['4S'],
                'grado_id_final' => $grado_ids['4S'],
                'nombre' => 'Cuarto Nivel',
                'descripcion' => 'Nivel para 4to Secundaria',
                'estado' => true,
            ],
            [
                'area_id' => $area_ids['MATEMÁTICA'],
                'grado_id_inicial' => $grado_ids['5S'],
                'grado_id_final' => $grado_ids['5S'],
                'nombre' => 'Quinto Nivel',
                'descripcion' => 'Nivel para 5to Secundaria',
                'estado' => true,
            ],
            [
                'area_id' => $area_ids['MATEMÁTICA'],
                'grado_id_inicial' => $grado_ids['6S'],
                'grado_id_final' => $grado_ids['6S'],
                'nombre' => 'Sexto Nivel',
                'descripcion' => 'Nivel para 6to Secundaria',
                'estado' => true,
            ],
            
            // QUÍMICA
            [
                'area_id' => $area_ids['QUÍMICA'],
                'grado_id_inicial' => $grado_ids['2S'],
                'grado_id_final' => $grado_ids['2S'],
                'nombre' => '2S',
                'descripcion' => 'Nivel para 2do Secundaria',
                'estado' => true,
            ],
            [
                'area_id' => $area_ids['QUÍMICA'],
                'grado_id_inicial' => $grado_ids['3S'],
                'grado_id_final' => $grado_ids['3S'],
                'nombre' => '3S',
                'descripcion' => 'Nivel para 3ro Secundaria',
                'estado' => true,
            ],
            [
                'area_id' => $area_ids['QUÍMICA'],
                'grado_id_inicial' => $grado_ids['4S'],
                'grado_id_final' => $grado_ids['4S'],
                'nombre' => '4S',
                'descripcion' => 'Nivel para 4to Secundaria',
                'estado' => true,
            ],
            [
                'area_id' => $area_ids['QUÍMICA'],
                'grado_id_inicial' => $grado_ids['5S'],
                'grado_id_final' => $grado_ids['5S'],
                'nombre' => '5S',
                'descripcion' => 'Nivel para 5to Secundaria',
                'estado' => true,
            ],
            [
                'area_id' => $area_ids['QUÍMICA'],
                'grado_id_inicial' => $grado_ids['6S'],
                'grado_id_final' => $grado_ids['6S'],
                'nombre' => '6S',
                'descripcion' => 'Nivel para 6to Secundaria',
                'estado' => true,
            ],
            
            // ROBÓTICA
            [
                'area_id' => $area_ids['ROBÓTICA'],
                'grado_id_inicial' => $grado_ids['5P'],
                'grado_id_final' => $grado_ids['6P'],
                'nombre' => 'Builders P',
                'descripcion' => 'Categoría para 5to a 6to Primaria',
                'estado' => true,
            ],
            [
                'area_id' => $area_ids['ROBÓTICA'],
                'grado_id_inicial' => $grado_ids['1S'],
                'grado_id_final' => $grado_ids['6S'],
                'nombre' => 'Builders S',
                'descripcion' => 'Categoría para 1ro a 6to Secundaria',
                'estado' => true,
            ],
            [
                'area_id' => $area_ids['ROBÓTICA'],
                'grado_id_inicial' => $grado_ids['5P'],
                'grado_id_final' => $grado_ids['6P'],
                'nombre' => 'Lego P',
                'descripcion' => 'Categoría para 5to a 6to Primaria',
                'estado' => true,
            ],
            [
                'area_id' => $area_ids['ROBÓTICA'],
                'grado_id_inicial' => $grado_ids['1S'],
                'grado_id_final' => $grado_ids['6S'],
                'nombre' => 'Lego S',
                'descripcion' => 'Categoría para 1ro a 6to Secundaria',
                'estado' => true,
            ],
        ];

        // Agregar timestamps a cada registro
        foreach ($niveles_categorias as &$nivel) {
            $nivel['created_at'] = now();
            $nivel['updated_at'] = now();
        }

        DB::table('nivel_categoria')->insert($niveles_categorias);
    }
}
