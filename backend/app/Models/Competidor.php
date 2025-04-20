<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Competidor extends Model
{
    use HasFactory;

    protected $table = 'competidor';
    protected $primaryKey = 'competidor_id';

    protected $fillable = [
        'colegio_id',
        'curso_id',
        'ubicacion_id',
        'nombres',
        'apellidos',
        'ci',
        'fecha_nacimiento',
        'estado',
    ];

    protected $casts = [
        'fecha_nacimiento' => 'date',
    ];


    public function colegio()
    {
        return $this->belongsTo(Colegio::class, 'colegio_id');
    }

    public function curso()
    {
        return $this->belongsTo(Curso::class, 'curso_id');
    }

    public function ubicacion()
    {
        return $this->belongsTo(Ubicacion::class, 'ubicacion_id');
    }

    public function getNombreCompletoAttribute()
    {
        return "{$this->nombres} {$this->apellidos}";
    }
}
