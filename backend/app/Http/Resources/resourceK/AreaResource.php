<?php

namespace App\Http\Resources\resourceK;

use Illuminate\Http\Resources\Json\JsonResource;

class AreaResource extends JsonResource{

    public function toArray($request){
        $formattedData = [];

        foreach ($this->nivelesCategoria as $nivelCategoria) {
            foreach ($this->cronogramas as $cronograma) {
                $formattedData[] = [
                    'area' => $this->nombre,
                    'nivel_categoria' => $nivelCategoria->nombre,
                    'grado' => $nivelCategoria->gradoMinimo ? $nivelCategoria->gradoMinimo->nombre : null,
                    'costo' => $this->costo,
                    'fecha_inicio' => $cronograma->fecha_inicio,
                    'fecha_fin' => $cronograma->fecha_fin,
                    'descripcion' => $cronograma->descripcion,
                    'tipo_evento' => $cronograma->tipo_evento,
                ];
            }
        }

        return [
            'success' => true,
            'data' => $formattedData
        ];
    }
}
