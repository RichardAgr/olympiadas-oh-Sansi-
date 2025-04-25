<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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
        return $this->belongsTo(Colegio::class, 'colegio_id', 'colegio_id');
    }

    public function curso()
    {
        return $this->belongsTo(Curso::class, 'curso_id', 'curso_id');
    }

    public function ubicacion()
    {
        return $this->belongsTo(Ubicacion::class, 'ubicacion_id', 'ubicacion_id');
    }

    public function tutores()
    {
        return $this->belongsToMany(Tutor::class, 'tutor_competidor', 'competidor_id', 'tutor_id')
                    ->withPivot('nivel_respansabilidad', 'realcion_competidor');
    }

    public function competencias()
    {
        return $this->belongsToMany(Competencia::class, 'competidor_competencia', 'competidor_id', 'competencia_id')
                    ->withPivot('area_id', 'nivel_categoria_id', 'boleta_id', 'fecha_inscripcion');
    }

    public function notificaciones()
    {
        return $this->hasMany(Notificacion::class, 'competidor_id', 'competidor_id');
    }

    public function tutorCompetidores()
    {
        return $this->hasMany(TutorCompetidor::class, 'competidor_id', 'competidor_id');
    }

    public function competidorCompetencias()
{
    return $this->hasMany(CompetidorCompetencia::class, 'competidor_id', 'competidor_id');
}

}
