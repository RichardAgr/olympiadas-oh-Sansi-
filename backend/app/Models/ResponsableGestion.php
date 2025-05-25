<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;

class ResponsableGestion extends Authenticatable
{
    use HasFactory, HasApiTokens, Notifiable;

    protected $table = 'responsable_gestion';
    protected $primaryKey = 'responsable_id';

    protected $fillable = [
        'ci',
        'nombres',
        'apellidos',
        'correo_electronico',
        'telefono',
        'fecha_asignacion',
        'estado',
        'password'  
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    public $timestamps = true;

    
    public function setPasswordAttribute($value)
    {
        $this->attributes['password'] = \Hash::make($value);
    }
}

