<?php

namespace App\Models\modelK;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Cronograma extends Model{
    use HasFactory;

    protected $table = 'cronograma';
    protected $primaryKey = 'cronograma_id';
    
    protected $fillable = [
        'competencia_id',
        'area_id',
        'nombre_evento',
        'descripcion',
        'fecha_inicio',
        'fecha_fin',
        'tipo_evento',
        'anio_olimpiada'
    ];
    
    protected $casts = [
        'estado' => 'boolean',
        'costo' => 'float',
        'fecha_inicio' => 'datetime',
        'fecha_fin' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];
    
    public function competencia(){
        return $this->belongsTo(Competencia::class, 'competencia_id', 'competencia_id');
    }

    public function area(){
        return $this->belongsTo(Area::class, 'area_id', 'area_id');
    }
}
