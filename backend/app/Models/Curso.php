<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Curso extends Model
{
    protected $table = 'curso';
    protected $primaryKey = 'curso_id';
    
    protected $fillable = [
        'grado_id',
        'nombre',
        'estado',
    ];

    // Relaciones
    public function grado()
    {
        return $this->belongsTo(Grado::class, 'grado_id', 'grado_id');
    }

    public function competidores()
    {
        return $this->hasMany(Competidor::class, 'curso_id', 'curso_id');
    }
}
