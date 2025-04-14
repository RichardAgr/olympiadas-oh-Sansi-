<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Curso extends Model
{
    protected $table = 'curso'; // 👈 This tells Laravel to stop looking for 'cursos'
    protected $primaryKey = 'curso_id';

    protected $fillable = [
        'nombre'
    ];

    public function competidores()
    {
        return $this->hasMany(Competidor::class, 'curso_id');
    }
}