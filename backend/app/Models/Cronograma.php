<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Area;
use App\Models\Competencia;

class Cronograma extends Model
{
    use HasFactory;

    protected $table = 'cronograma';
    protected $primaryKey = 'cronograma_id';

    protected $fillable = [
        'area_id',
        'competencia_id',
        'nombre_evento',
        'descripcion',
        'fecha_inicio',
        'fecha_fin',
        'tipo_evento',
        'anio_olimpiada'
    ];

    protected $casts = [
        'fecha_inicio' => 'date',
        'fecha_fin' => 'date',
    ];

    public function area()
    {
        return $this->belongsTo(Area::class, 'area_id');
    }

    public function competencia()
    {
        return $this->belongsTo(Competencia::class, 'competencia_id');
    }
    
}
