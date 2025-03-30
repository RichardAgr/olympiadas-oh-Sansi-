<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Area extends Model
{
    use HasFactory;

    // Nombre de la tabla (si no sigue la convención plural)
    protected $table = 'area';

    // Si la clave primaria no es 'id'
    protected $primaryKey = 'area_id';

    // Si no quieres que otros campos se llenen accidentalmente
    protected $fillable = [
        'nombre',
    ];
}
