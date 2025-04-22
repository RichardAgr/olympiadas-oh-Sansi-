<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PagoResource extends JsonResource{

    public function toArray(Request $request): array{
        $imagen = $this->imagen_manual;
        
        return [
            'boleta_id' => $this->boleta_id,
            'numero_boleta' => $this->numero_boleta,
            'tutor' => [
                'tutor_id' => $this->tutor->tutor_id,
                'ci' => $this->tutor->ci,
                'nombres' => $this->tutor->nombres,
                'apellidos' => $this->tutor->apellidos,
            ],
            'fecha_emision' => $this->fecha_emision ? $this->fecha_emision->format('Y-m-d') : null,
            'fecha_pago' => $this->fecha_pago ? $this->fecha_pago->format('Y-m-d') : null,
            'monto_total' => (float) $this->monto_total,
            'estado' => $this->estado ? 'Pagado' : 'Pendiente',
            'imagen_boleta' => $imagen ? [
                'imagen_id' => $imagen->imagen_id,
                'ruta_imagen' => $imagen->ruta_imagen,
            ] : null,
        ];
    }
}
