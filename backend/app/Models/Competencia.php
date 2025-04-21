<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Area;
use App\Models\Cronograma;

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
     * Get related registration schedule from cronograma.
     */
    public function inscripcion()
    {
        return $this->hasOne(Cronograma::class, 'competencia_id')
                    ->where('tipo_evento', 'inscripcion');
    }

    /**
     * Get related competition schedule from cronograma.
     */
    public function competencia()
    {
        return $this->hasOne(Cronograma::class, 'competencia_id')
                    ->where('tipo_evento', 'competencia');
    }

    public function cronograma()
    {
        return $this->hasOne(Cronograma::class, 'competencia_id');
    }
}
