<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class Competidor extends Seeder{
    public function run(){
        $colegios = DB::table('colegio')->get();
        $cursos = DB::table('curso')->get();
        $ubicaciones = DB::table('ubicacion')->get();

        if ($cursos->isEmpty() || $colegios->isEmpty() || $ubicaciones->isEmpty()) {
            echo "Error: No hay cursos, colegios o ubicaciones disponibles. Asegúrate de ejecutar primero los seeders correspondientes.\n";
            return;
        }

        $getColegioId = function($nombre) use ($colegios) {
            $colegio = $colegios->where('nombre', $nombre)->first();
            return $colegio ? $colegio->colegio_id : $colegios->first()->colegio_id;
        };

        $getCursoId = function($nombre) use ($cursos) {
            $curso = $cursos->where('nombre', $nombre)->first();
            return $curso ? $curso->curso_id : $cursos->first()->curso_id;
        };

        $getUbicacionId = function($departamento, $provincia) use ($ubicaciones) {
            $ubicacion = $ubicaciones->where('departamento', $departamento)
                                     ->where('provincia', $provincia)
                                     ->first();
            return $ubicacion ? $ubicacion->ubicacion_id : $ubicaciones->first()->ubicacion_id;
        };

        $estados = ['Pendiente', 'Habilitado', 'Deshabilitado'];

        $competidores = [
            [
                'colegio_id' => $getColegioId('Unidad Educativa Nueva Esperanza'),
                'curso_id' => $getCursoId('6ro Secundaria A'),
                'ubicacion_id' => $getUbicacionId('Cochabamba', 'Cercado'),
                'nombres' => 'Fresia Grety',
                'apellidos' => 'Ticona Plata',
                'ci' => '14268363',
                'fecha_nacimiento' => Carbon::parse('2007-06-06'),
                'estado' => $estados[array_rand($estados)],
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'colegio_id' => $getColegioId('Santo Domingo Savio A'),
                'curso_id' => $getCursoId('5to Primaria A'),
                'ubicacion_id' => $getUbicacionId('Cochabamba', 'Cercado'),
                'nombres' => 'Dayra',
                'apellidos' => 'Damian Grageda',
                'ci' => '15582477',
                'fecha_nacimiento' => Carbon::parse('2014-06-30'),
                'estado' => $estados[array_rand($estados)],
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'colegio_id' => $getColegioId('Colegio San Agustín'),
                'curso_id' => $getCursoId('4to Secundaria B'),
                'ubicacion_id' => $getUbicacionId('Cochabamba', 'Cercado'),
                'nombres' => 'Carlos Alberto',
                'apellidos' => 'Mendoza Quiroga',
                'ci' => '14567890',
                'fecha_nacimiento' => Carbon::parse('2009-03-15'),
                'estado' => $estados[array_rand($estados)],
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'colegio_id' => $getColegioId('Unidad Educativa Simón Bolívar'),
                'curso_id' => $getCursoId('3ro Secundaria C'),
                'ubicacion_id' => $getUbicacionId('Cochabamba', 'Quillacollo'),
                'nombres' => 'Patricia',
                'apellidos' => 'Flores Rojas',
                'ci' => '14678901',
                'fecha_nacimiento' => Carbon::parse('2010-07-20'),
                'estado' => $estados[array_rand($estados)],
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'colegio_id' => $getColegioId('Colegio Don Bosco'),
                'curso_id' => $getCursoId('2do Secundaria A'),
                'ubicacion_id' => $getUbicacionId('Cochabamba', 'Sacaba'),
                'nombres' => 'Roberto Carlos',
                'apellidos' => 'Guzmán Torrico',
                'ci' => '14789012',
                'fecha_nacimiento' => Carbon::parse('2011-11-10'),
                'estado' => $estados[array_rand($estados)],
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'colegio_id' => $getColegioId('Colegio San Calixto'),
                'curso_id' => $getCursoId('1ro Secundaria B'),
                'ubicacion_id' => $getUbicacionId('La Paz', 'Murillo'),
                'nombres' => 'María José',
                'apellidos' => 'López Suárez',
                'ci' => '14890123',
                'fecha_nacimiento' => Carbon::parse('2012-05-25'),
                'estado' => $estados[array_rand($estados)],
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'colegio_id' => $getColegioId('Colegio Alemán'),
                'curso_id' => $getCursoId('6to Primaria C'),
                'ubicacion_id' => $getUbicacionId('La Paz', 'Murillo'),
                'nombres' => 'Fernando José',
                'apellidos' => 'Camacho Vargas',
                'ci' => '14901234',
                'fecha_nacimiento' => Carbon::parse('2013-09-18'),
                'estado' => $estados[array_rand($estados)],
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'colegio_id' => $getColegioId('Colegio La Salle'),
                'curso_id' => $getCursoId('5to Primaria B'),
                'ubicacion_id' => $getUbicacionId('Santa Cruz', 'Andrés Ibáñez'),
                'nombres' => 'Lucía',
                'apellidos' => 'Montaño Quiroga',
                'ci' => '15012345',
                'fecha_nacimiento' => Carbon::parse('2014-02-12'),
                'estado' => $estados[array_rand($estados)],
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'colegio_id' => $getColegioId('Unidad Educativa Santa Cruz'),
                'curso_id' => $getCursoId('4to Primaria A'),
                'ubicacion_id' => $getUbicacionId('Santa Cruz', 'Andrés Ibáñez'),
                'nombres' => 'Jorge Luis',
                'apellidos' => 'Pérez Rojas',
                'ci' => '15123456',
                'fecha_nacimiento' => Carbon::parse('2015-08-30'),
                'estado' => $estados[array_rand($estados)],
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'colegio_id' => $getColegioId('Colegio Nacional Bolívar'),
                'curso_id' => $getCursoId('3ro Primaria C'),
                'ubicacion_id' => $getUbicacionId('Oruro', 'Cercado'),
                'nombres' => 'Ana María',
                'apellidos' => 'Rodríguez Torrico',
                'ci' => '15234567',
                'fecha_nacimiento' => Carbon::parse('2016-04-05'),
                'estado' => $estados[array_rand($estados)],
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('competidor')->insert($competidores);
    }
}
