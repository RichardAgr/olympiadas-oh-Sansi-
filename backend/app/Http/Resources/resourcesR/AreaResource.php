<?php

namespace App\Http\Resources\resourcesR;

use Illuminate\Http\Resources\Json\JsonResource;

class AreaResource extends JsonResource{
    public function toArray($request){
        return [
            'area_id' => $this->area_id,
            'nombre_area' => $this->nombre,
            'descripcion' => $this->descripcion,
            'costo'=>$this->costo,
            'niveles_categoria' => NivelCategoriaResource::collection($this->nivelesCategoria)
        ];
    }
}

class NivelCategoriaResource extends JsonResource
{
    public function toArray($request)
    {
        // Obtener los IDs de los grados que están en el rango
        $gradosAplicables = [];
        for ($i = $this->grado_id_inicial; $i <= $this->grado_id_final; $i++) {
            $gradosAplicables[] = $i;
        }

         // Verificar si el grado mínimo es igual al grado máximo
    if ($this->grado_id_inicial == $this->grado_id_final) {
        $rangoGrados = $this->gradoMinimo->nombre;
    } else {
        $rangoGrados = $this->gradoMinimo->nombre . ' a ' . $this->gradoMaximo->nombre;
    }
        
        return [
            'nivel_categoria_id' => $this->nivel_categoria_id,
            'nombre_categoria' => $this->nombre,
            'descripcion' => $this->descripcion,
            'grado_minimo' => [
                'grado_id' => $this->gradoMinimo->grado_id,
                'nombre_grado' => $this->gradoMinimo->nombre,
                'nivel_educativo' => [
                    'nivel_educativo_id' => $this->gradoMinimo->nivelEducativo->nivel_educativo_id,
                    'nombre_nivel' => $this->gradoMinimo->nivelEducativo->nombre
                ]
            ],
            'grado_maximo' => [
                'grado_id' => $this->gradoMaximo->grado_id,
                'nombre_grado' => $this->gradoMaximo->nombre,
                'nivel_educativo' => [
                    'nivel_educativo_id' => $this->gradoMaximo->nivelEducativo->nivel_educativo_id,
                    'nombre_nivel' => $this->gradoMaximo->nivelEducativo->nombre
                ]
            ],

            'rango_grados' => $rangoGrados,
            'grados_aplicables_ids' => $gradosAplicables
        ];
    }
}
