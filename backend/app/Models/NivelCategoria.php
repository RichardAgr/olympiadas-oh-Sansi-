<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NivelCategoria extends Model
{
    use HasFactory;
    protected $table = 'nivel_categoria';
    protected $primaryKey = 'nivel_categoria_id';
    protected $fillable = ['area_id', 'nombre', 'descripcion', 'grado_id_inicial', 'grado_id_final'];
    
    public function area()
    {
        return $this->belongsTo(Area::class, 'area_id', 'area_id');
    }
    
    public function gradoMinimo()
    {
        return $this->belongsTo(Grado::class, 'grado_id_inicial', 'grado_id');
    }
    
    public function gradoMaximo()
    {
        return $this->belongsTo(Grado::class, 'grado_id_final', 'grado_id');
    }
    
    public function inscripciones()
    {
        return $this->hasMany(CompetidorCompetencia::class, 'nivel_categoria_id', 'nivel_categoria_id');
    }
}
