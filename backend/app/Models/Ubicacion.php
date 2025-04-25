<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ubicacion extends Model
{
    use HasFactory;

    protected $table = 'ubicacion';
    protected $primaryKey = 'ubicacion_id';
    
    protected $fillable = [
        'departamento',
        'provincia',
    ];

    // Relaciones
    public function colegios()
    {
        return $this->hasMany(Colegio::class, 'ubicacion_id', 'ubicacion_id');
    }

    public function competidores()
    {
        return $this->hasMany(Competidor::class, 'ubicacion_id', 'ubicacion_id');
    }
}
