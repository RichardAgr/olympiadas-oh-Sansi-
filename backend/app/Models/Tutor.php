<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tutor extends Model
{
    use HasFactory;

    protected $table = 'tutor';
    protected $primaryKey = 'tutor_id';
    
    protected $fillable = [
        'ci',
        'nombres',
        'apellidos',
        'correo_electronico',
        'telefono',
        'estado',
    ];

    // Relaciones
    public function competidores()
    {
        return $this->belongsToMany(Competidor::class, 'tutor_competidor', 'tutor_id', 'competidor_id')
                    ->withPivot('nivel_respansabilidad', 'realcion_competidor');
    }

    public function boletas()
    {
        return $this->hasMany(Boleta::class, 'tutor_id', 'tutor_id');
    }

    public function notificaciones()
    {
        return $this->hasMany(Notificacion::class, 'tutor_id', 'tutor_id');
    }
}
