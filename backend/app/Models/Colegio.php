<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Colegio extends Model
{
    use HasFactory;
    protected $table = 'colegio';
    protected $primaryKey = 'colegio_id';
    
    protected $fillable = [
        'ubicacion_id',
        'nombre',
        'telefono',
    ];

    // Relaciones
    public function ubicacion()
    {
        return $this->belongsTo(Ubicacion::class, 'ubicacion_id', 'ubicacion_id');
    }

    public function competidores()
    {
        return $this->hasMany(Competidor::class, 'colegio_id', 'colegio_id');
    }
}
