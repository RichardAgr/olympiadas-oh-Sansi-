<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Categoria;
use App\Models\Inscripcion;

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
        'foto'
    ];

    //  Relación con Categoría
    public function categorias()
    {
        return $this->hasMany(Categoria::class, 'area_id', 'area_id');
    }

    //  Relación con Inscripción
    public function inscripciones()
    {
        return $this->hasMany(Inscripcion::class, 'area_id', 'area_id');
    }
}
