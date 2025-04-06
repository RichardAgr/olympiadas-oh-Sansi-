<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NivelCategoria extends Model
{
    use HasFactory;

    protected $table = 'nivel_categoria';
    protected $primaryKey = 'nivel_categoria_id';

    protected $fillable = [
        'grado_id_inicial',
        'grado_id_final',
        'area_id',
        'nombre',
        'descripcion',
        'estado'
    ];

    // Relaciones
    public function gradoInicial()
    {
        return $this->belongsTo(Grado::class, 'grado_id_inicial', 'grado_id');
    }

    public function gradoFinal()
    {
        return $this->belongsTo(Grado::class, 'grado_id_final', 'grado_id');
    }

    public function area()
    {
        return $this->belongsTo(Area::class, 'area_id', 'area_id');
    }
}
