<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;

class Tutor extends Authenticatable
{
    use HasFactory, HasApiTokens, Notifiable;

    protected $table = 'tutor';
    protected $primaryKey = 'tutor_id';

    protected $fillable = [
        'ci',
        'nombres',
        'apellidos',
        'correo_electronico',
        'telefono',
        'estado',
        'password', 
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    
    public function setPasswordAttribute($value)
    {
        $this->attributes['password'] = \Hash::make($value);
    }

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
