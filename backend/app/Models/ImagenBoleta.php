<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ImagenBoleta extends Model
{
    use HasFactory;
    protected $table = 'imagen_boleta';
    protected $primaryKey = 'imagen_id';
    
    protected $fillable = [
        'boleta_id',
        'ruta_imagen',
        'fecha_subida',
        'estado',
    ];

    protected $casts = [
        'fecha_subida' => 'date',
    ];

    // Relaciones
    public function boleta()
    {
        return $this->belongsTo(Boleta::class, 'boleta_id', 'boleta_id');
    }
}
