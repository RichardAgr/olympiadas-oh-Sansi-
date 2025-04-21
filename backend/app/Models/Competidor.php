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

    // Relaciones

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

    public function tutores()
    {
        return $this->belongsToMany(
            Tutor::class,
            'tutor_competidor',
            'competidor_id',
            'tutor_id'
        )->withTimestamps();
    }

    public function competencias()
    {
        return $this->belongsToMany(
            Competencia::class,
            'competidor_competencia',
            'competidor_id',
            'competencia_id'
        )
        ->using(\App\Models\CompetidorCompetencia::class)
        ->withPivot(['fecha_inscripcion', 'area_id']) 
        ->withTimestamps();
    }
    
    
    // Accesor para nombre completo
    public function getNombreCompletoAttribute()
    {
        return "{$this->nombres} {$this->apellidos}";
    }
}
