<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Area extends Model
{
    use HasFactory;

    protected $table = 'area'; // tabla singular
    protected $primaryKey = 'area_id'; // clave primaria personalizada

    protected $fillable = [
        'nombre',
        'descripcion',
        'costo',
        'estado',
        'foto'
    ];
}
