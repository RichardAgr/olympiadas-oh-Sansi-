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
        'competencia_id',
        'estado',
        'password', 
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Mutator para hashear automáticamente la contraseña
     */
    public function setPasswordAttribute($value)
    {
        // Solo si el valor no está ya hasheado (opcional)
        if (\Illuminate\Support\Facades\Hash::needsRehash($value)) {
            $this->attributes['password'] = \Hash::make($value);
        } else {
            $this->attributes['password'] = $value;
        }
    }

    // Relaciones existentes
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
