<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Categoria;
use App\Models\Inscripcion;
use App\Models\NivelCategoria;
use App\Models\Cronograma;

class Area extends Model
{
    use HasFactory;

    protected $table = 'area';
    protected $primaryKey = 'area_id';

    protected $fillable = [
        'nombre',
        'descripcion',
        'costo',
        'estado',
    ];

    // Relación con Categoría (si usas este modelo)
    public function categorias()
    {
        return $this->hasMany(Categoria::class, 'area_id', 'area_id');
    }

    // Relación con Inscripciones
    public function inscripciones()
    {
        return $this->hasMany(Inscripcion::class, 'area_id', 'area_id');
    }

    // ✅ Relación con NivelCategoria (necesaria para /areasRegistradas)
    public function nivelCategoria()
    {
        return $this->hasMany(NivelCategoria::class, 'area_id', 'area_id');
    }

    // ✅ Relación con Cronograma (necesaria para /areasRegistradas)
    public function cronograma()
    {
        return $this->hasOne(Cronograma::class, 'area_id', 'area_id');
    }

    public function competencia()
    {
        return $this->hasOne(Competencia::class, 'area_id');
    }

}
