<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class PagoCollection extends ResourceCollection{
    public function toArray(Request $request): array{
        return [
            'data' => [
                'pagos' => PagoResource::collection($this->collection)
            ]
        ];
    
    }
}
