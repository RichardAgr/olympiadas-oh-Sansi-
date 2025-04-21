<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Area;
use App\Models\Cronograma;
use App\Models\Competidor;

class Competencia extends Model
{
    use HasFactory;

    protected $table = 'competencia';
    protected $primaryKey = 'competencia_id';

    protected $fillable = [
        'area_id',
        'nombre_competencia',
        'descripcion',
        'fecha_inicio',
        'fecha_fin',
        'estado',
    ];

    protected $casts = [
        'fecha_inicio' => 'date',
        'fecha_fin' => 'date',
    ];

    /**
     * Una competencia pertenece a un área.
     */
    public function area()
    {
        return $this->belongsTo(Area::class, 'area_id');
    }

    /**
     * Relación con cronograma tipo inscripción.
     */
    public function inscripcion()
    {
        return $this->hasOne(Cronograma::class, 'competencia_id')
                    ->where('tipo_evento', 'inscripcion');
    }

    /**
     * Relación con cronograma tipo competencia.
     */
    public function competencia()
    {
        return $this->hasOne(Cronograma::class, 'competencia_id')
                    ->where('tipo_evento', 'competencia');
    }

    /**
     * Relación genérica con cronograma.
     */
    public function cronograma()
    {
        return $this->hasOne(Cronograma::class, 'competencia_id');
    }

    /**
     * Relación muchos a muchos con competidores.
     */
    public function competidores()
    {
        return $this->belongsToMany(
            Competidor::class,
            'competidor_competencia',
            'competencia_id',
            'competidor_id'
        )->withPivot(['fecha_inscripcion'])->withTimestamps();
    }
}
