<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Competidor;
use App\Models\CompetidorCompetencia;
use App\Models\TutorCompetidor;
use App\Models\Area;
use Carbon\Carbon;
use Illuminate\Http\Request;

class CompetidorController extends Controller{
    public function index(Request $request){
        $competidores = Competidor::select('competidor_id', 'nombres', 'apellidos', 'estado')
            ->get();

        $data = [];

        foreach ($competidores as $competidor) {
            $areas = CompetidorCompetencia::where('competidor_id', $competidor->competidor_id)
                ->join('area', 'competidor_competencia.area_id', '=', 'area.area_id')
                ->pluck('area.nombre')
                ->unique()
                ->implode(', ');

            $data[] = [
                'competidor_id' => $competidor->competidor_id,
                'nombre_completo' => $competidor->nombres . ' ' . $competidor->apellidos,
                'area_competencia' => $areas ?: 'No asignada',
                'estado' => $competidor->estado
            ];
        }

        return response()->json(['data' => $data]);
    }

    public function getDetallesCompetidor($id)    {
        $competidor = Competidor::with([
            'colegio.ubicacion',
            'curso',
            'tutorCompetidores.tutor',
            'competidorCompetencias.area',
            'competidorCompetencias.boleta.imagenes'
        ])->find($id);

        // Si no se encuentra el competidor, devolver error 404
        if (!$competidor) {
            return response()->json(['error' => 'Competidor no encontrado'], 404);
        }

        // Obtener el área del competidor (tomamos la primera si hay varias)
        $area = $competidor->competidorCompetencias->first() ? 
                $competidor->competidorCompetencias->first()->area->nombre : 
                'No asignada';

        $fechaNacimiento = Carbon::parse($competidor->fecha_nacimiento)->format('d/m/y');

        // Obtener la ruta de la imagen de la boleta
        $rutaImagen = null;
        foreach ($competidor->competidorCompetencias as $competidorCompetencia) {
            if ($competidorCompetencia->boleta && $competidorCompetencia->boleta->imagenes->isNotEmpty()) {
                $rutaImagen = $competidorCompetencia->boleta->imagenes->first()->ruta_imagen;
                break;
            }
        }

        // Si no se encuentra ninguna imagen, usar un valor por defecto
        if (!$rutaImagen) {
            $rutaImagen = 'https://i.ibb.co/svnPKS1b/boleta1.jpg';
        }

        $informacionCompetidor = [
            'id' => $competidor->competidor_id,
            'nombres' => $competidor->nombres,
            'apellidos' => $competidor->apellidos,
            'ci' => $competidor->ci,
            'fecha_nacimiento' => $fechaNacimiento,
            'colegio' => $competidor->colegio->nombre,
            'curso' => $competidor->curso->nombre,
            'departamento' => $competidor->colegio->ubicacion->departamento,
            'provincia' => $competidor->colegio->ubicacion->provincia,
            'area' => $area,
            'estado' => $competidor->estado,
            'ruta_imagen' => $rutaImagen
        ];

        // Construir la información de los tutores
        $tutores = [];
        foreach ($competidor->tutorCompetidores as $tutorCompetidor) {
            $tutor = $tutorCompetidor->tutor;
            
            $tipo = $tutorCompetidor->nivel_respansabilidad === 'Principal' ? 'Principal' : 'Secundario';
            
            $tutores[] = [
                'id_tutor' => $tutor->tutor_id,
                'tipo' => $tipo,
                'nombre' => $tutor->nombres . ' ' . $tutor->apellidos,
                'relacion' => $tutorCompetidor->realcion_competidor,
                'telefono' => $tutor->telefono,
                'correo' => $tutor->correo_electronico,
            ];
        }

        $response = [
                    'informacion_competidor' => $informacionCompetidor,
                    'tutores' => $tutores,
        ];

        return response()->json($response);
    }
}
