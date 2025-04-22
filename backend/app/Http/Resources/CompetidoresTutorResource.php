<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Http\Resources\Json\JsonResource;

class CompetidoresTutorResource extends JsonResource{
    public function toArray(Request $request): array{
        $estudiantes = new Collection();
        
        foreach ($this->competidores as $competidor) {
            if ($competidor->competencias && $competidor->competencias->isNotEmpty()) {
                foreach ($competidor->competencias as $competencia) {

                    $nombreArea = 'No especificada';

                    if ($competencia && $competencia->area) {
                        $nombreArea = $competencia->area->nombre;
                    }
                    
                    $estudiantes->push([
                        'id' => $competidor->competidor_id,
                        'nombre' => $competidor->nombres . ' ' . $competidor->apellidos,
                        'colegio' => $competidor->colegio ? $competidor->colegio->nombre : 'No especificado',
                        'curso' => $competidor->curso ? 
                            ($competidor->curso->grado ? 
                                $competidor->curso->nombre . ' ' . $competidor->curso->grado->nombre : 
                                $competidor->curso->nombre) : 
                            'No especificado',
                        'competencia' => $nombreArea,
                    ]);
                }
            } else {
                // Si el competidor no tiene competencias, agregarlo de todas formas
                $estudiantes->push([
                    'id' => $competidor->competidor_id,
                    'nombre' => $competidor->nombres . ' ' . $competidor->apellidos,
                    'colegio' => $competidor->colegio ? $competidor->colegio->nombre : 'No especificado',
                    'curso' => $competidor->curso ? 
                        ($competidor->curso->grado ? 
                            $competidor->curso->nombre . ' ' . $competidor->curso->grado->nombre : 
                            $competidor->curso->nombre) : 
                        'No especificado',
                    'competencia' => 'No inscrito',
                ]);
            }
        }
        
        return [
            'data' => [
                'estudiantes' => $estudiantes,
            ]
        ];
    }
}
