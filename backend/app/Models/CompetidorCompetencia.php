<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CompetidorCompetencia extends Model
{
    use HasFactory;
    protected $table = 'competidor_competencia';
    protected $primaryKey = 'competidor_competencia_id';
    
    protected $fillable = [
        'competidor_id',
        'competencia_id',
        'area_id',
        'nivel_categoria_id',
        'boleta_id',
        'fecha_inscripcion',
    ];

    protected $casts = [
        'fecha_inscripcion' => 'date',
    ];

    // Relaciones
    public function competidor()
    {
        return $this->belongsTo(Competidor::class, 'competidor_id', 'competidor_id');
    }

    public function competencia()
    {
        return $this->belongsTo(Competencia::class, 'competencia_id', 'competencia_id');
    }

    public function area()
    {
        return $this->belongsTo(Area::class, 'area_id', 'area_id');
    }

    public function nivelCategoria()
    {
        return $this->belongsTo(NivelCategoria::class, 'nivel_categoria_id', 'nivel_categoria_id');
    }

    public function boleta()
    {
        return $this->belongsTo(Boleta::class, 'boleta_id', 'boleta_id');
    }
}
