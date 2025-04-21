<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Http\Resources\Json\JsonResource;

class CompetidoresTutorResource extends JsonResource{
    public function toArray(Request $request): array{
        $estudiantes = new Collection();
        
        foreach ($this->competidores as $competidor) {
            foreach ($competidor->competencias as $competencia) {
                $estudiantes->push([
                    'id' => $competidor->competidor_id,
                    'nombre' => $competidor->nombres . ' ' . $competidor->apellidos,
                    'colegio' => $competidor->colegio->nombre,
                    'curso' => $competidor->curso->nombre,
                    'competencia' => $competencia->area->nombre,
                ]);
            }
            
            if ($competidor->competencias->isEmpty()) {
                $estudiantes->push([
                    'id' => $competidor->competidor_id,
                    'nombre' => $competidor->nombres . ' ' . $competidor->apellidos,
                    'colegio' => $competidor->colegio->nombre,
                    'curso' => $competidor->curso->nombre,
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
