<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class CompetidorCompetencia extends Pivot
{
    protected $table = 'competidor_competencia';
    protected $primaryKey = 'competidor_competencia_id';
    public $timestamps = true;

    protected $fillable = [
        'competidor_id',
        'competencia_id',
        'area_id',
        'fecha_inscripcion',
    ];

    public function area()
    {
        return $this->belongsTo(Area::class, 'area_id');
    }

    public function competencia()
    {
        return $this->belongsTo(Competencia::class, 'competencia_id');
    }

    public function competidor()
    {
        return $this->belongsTo(Competidor::class, 'competidor_id');
    }
}
