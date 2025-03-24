<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class NivelCategoriaResource extends JsonResource{
    public function toArray($request){
        $rangoGrados = '';
        if ($this->gradoInicial && $this->gradoFinal) {
            if ($this->gradoInicial->grado_id === $this->gradoFinal->grado_id) {
                $rangoGrados = $this->gradoInicial->nombre;
            } else {
                $rangoGrados = $this->gradoInicial->nombre . ' a ' . $this->gradoFinal->nombre;
            }
        }

        return [
            'id' => $this->nivel_categoria_id,
            'nombre' => $this->nombre,
            'descripcion' => $this->descripcion,
            'estado' => $this->estado,
            'area_id' => $this->area_id,
            'area_nombre' => $this->area ? $this->area->nombre : null,
            'grado_inicial_id' => $this->grado_id_inicial,
            'grado_inicial_nombre' => $this->gradoInicial ? $this->gradoInicial->nombre : null,
            'grado_final_id' => $this->grado_id_final,
            'grado_final_nombre' => $this->gradoFinal ? $this->gradoFinal->nombre : null,
            'rango_grados' => $rangoGrados,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    
    }
}
