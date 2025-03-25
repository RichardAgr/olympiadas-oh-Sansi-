<?php

namespace App\Http\Resources\resourcesR;

use Illuminate\Http\Resources\Json\JsonResource;

class GradoResource extends JsonResource{
    public function toArray($request){
        [
            'id' => $this->grado_id,
            'nombre' => $this->nombre,
            'abreviatura' => $this->abreviatura,
            'orden' => $this->orden,
            'nivel_educativo' => $this->whenLoaded('nivelEducativo', function () {
                return [
                    'id' => $this->nivelEducativo->nivel_educativo_id,
                    'nombre' => $this->nivelEducativo->nombre,
                    'abreviatura' => $this->nivelEducativo->abreviatura,
                ];
            }),
            'estado' => $this->estado,
        ];
    }
}
