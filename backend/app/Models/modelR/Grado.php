<?php

namespace App\Models\modelR;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Grado extends Model
{
    use HasFactory;
    protected $table = 'grado';
    protected $primaryKey = 'grado_id';
    protected $fillable = [
        'nivel_educativo_id',
        'nombre',
        'abreviatura',
    ];

    protected $casts = [
        'estado' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    public function nivelEducativo()
    {
        return $this->belongsTo(NivelEducativo::class, 'nivel_educativo_id', 'nivel_educativo_id');
    }

    public function cursos()
    {
        return $this->hasMany(Curso::class, 'grado_id', 'grado_id');
    }
    
    public function competidores()
    {
        return $this->hasMany(Competidor::class, 'grado_id', 'grado_id');
    }
    
    public function nivelCategoriasMinimo()
    {
        return $this->hasMany(NivelCategoria::class, 'grado_id_inicial', 'grado_id');
    }
    
    public function nivelCategoriasMaximo()
    {
        return $this->hasMany(NivelCategoria::class, 'grado_id_final', 'grado_id');
    }

    public function nivelesCategoria()
    {
        return $this->belongsToMany(NivelCategoria::class, 'categoria_grado', 'grado_id', 'nivel_categoria_id');
    }
}
