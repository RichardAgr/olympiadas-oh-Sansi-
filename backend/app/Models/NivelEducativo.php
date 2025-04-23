<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NivelEducativo extends Model
{
    use HasFactory;
    protected $table = 'nivel_educativo';
    protected $primaryKey = 'nivel_educativo_id';
    
    protected $fillable = [
        'nombre',
        'abreviatura',
        'orden',
        'estado',
    ];

    // Relaciones
    public function grados()
    {
        return $this->hasMany(Grado::class, 'nivel_educativo_id', 'nivel_educativo_id');
    }
}
