<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tutor extends Model
{
    use HasFactory;

    protected $table = 'notificacion';
    protected $primaryKey = 'notificacion_id';
    
    protected $fillable = [
        'responsable_id',
        'tutor_id',
        'competidor_id',
        'asunto',
        'mensaje',
        'fecha_envio',
        'estado',
    ];

    protected $casts = [
        'fecha_envio' => 'date',
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
