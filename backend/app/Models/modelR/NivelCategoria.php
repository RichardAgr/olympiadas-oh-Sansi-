<?php

namespace App\Models\modelR;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NivelCategoria extends Model
{
    use HasFactory;
    protected $table = 'nivel_categoria';
    protected $primaryKey = 'nivel_categoria_id';
    protected $fillable = [
        'area_id',
        'nombre',
        'descripcion',
        'grado_id_inicial',
        'grado_id_final'];

        protected $casts = [
            'estado' => 'boolean',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
            'deleted_at' => 'datetime',
        ];
    
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
    
    public function grados()
    {
        return $this->belongsToMany(Grado::class, 'categoria_grado', 'nivel_categoria_id', 'grado_id');
    }
}
