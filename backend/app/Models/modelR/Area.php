<?php

namespace App\Models\modelR;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Area extends Model
{
    use HasFactory;
    protected $table = 'area';
    protected $primaryKey = 'area_id';
    protected $fillable = [
        'nombre',
        'descripcion',
        'costo',
        'estado'
    ];
    protected $casts = [
        'estado' => 'boolean',
        'costo' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];
    
    public function nivelesCategoria()
    {
        return $this->hasMany(NivelCategoria::class, 'area_id', 'area_id');
    }
    
    public function cronogramas()
    {
        return $this->hasMany(Cronograma::class, 'area_id', 'area_id');
    }
}
