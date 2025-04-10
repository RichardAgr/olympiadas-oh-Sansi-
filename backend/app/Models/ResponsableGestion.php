<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ResponsableGestion extends Model
{
    use HasFactory;

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
    ];

    public $timestamps = true; 
}
