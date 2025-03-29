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
        'area_id',
        'nivel_categoria_id',
        'nombre',
        'descripcion',
        'fecha_inicio',
        'fecha_fin',
        'costo',
        'tipo_evento',
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
    
    public function area(){
        return $this->belongsTo(Area::class, 'area_id', 'area_id');
    }
    
    public function nivelCategoria(){
        return $this->belongsTo(NivelCategoria::class, 'nivel_categoria_id', 'nivel_categoria_id');
    }
    
    public function scopeActivos($query){
        return $query->where('estado', true);
    }
    
    public function scopeProximos($query){
        return $query->where('fecha_inicio', '>', now());
    }
    
    public function scopeEnCurso($query){
        return $query->where('fecha_inicio', '<=', now())
                     ->where('fecha_fin', '>=', now());
    }

    public function scopeFinalizados($query){
        return $query->where('fecha_fin', '<', now());
    }
    
    public function scopePorTipoEvento($query, $tipo){
        return $query->where('tipo_evento', $tipo);
    }
}
