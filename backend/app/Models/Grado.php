<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Grado extends Model
{
    use HasFactory;

    protected $table = 'grado';
    protected $primaryKey = 'grado_id';
    public $incrementing = true;
    public $timestamps = true;

    protected $fillable = [
        'nivel_educativo_id',
        'nombre',
        'abreviatura',
        'orden',
        'estado'
    ];

    /**
     * Relación con Nivel Educativo
     */
    public function nivelEducativo()
    {
        return $this->belongsTo(NivelEducativo::class, 'nivel_educativo_id', 'nivel_educativo_id');
    }

    /**
     * Relación con NivelCategoria como grado inicial
     */
    public function categoriasIniciales()
    {
        return $this->hasMany(NivelCategoria::class, 'grado_id_inicial', 'grado_id');
    }

    /**
     * Relación con NivelCategoria como grado final
     */
    public function categoriasFinales()
    {
        return $this->hasMany(NivelCategoria::class, 'grado_id_final', 'grado_id');
    }
}
