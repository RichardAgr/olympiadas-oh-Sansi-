<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;

class Admin extends Authenticatable
{
    use HasApiTokens, Notifiable;

    protected $table = 'admin';

    protected $fillable = ['nombre', 'correo_electronico', 'password'];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    
    public function setPasswordAttribute($value)
    {
        $this->attributes['password'] = \Hash::make($value);
    }
}
