<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tutor extends Model
{
    use HasFactory;

    protected $table = 'tutor';
    protected $primaryKey = 'tutor_id';
    public $timestamps = true;

    protected $fillable = [
        'ci',
        'nombres',
        'apellidos',
        'correo_electronico',
        'telefono',
        'estado',
    ];

    // Relaciones

    public function colegio()
    {
        return $this->belongsTo(Colegio::class, 'colegio_id');
    }

    public function curso()
    {
        return $this->belongsTo(Curso::class, 'curso_id');
    }

    public function competidores()
    {
        return $this->belongsToMany(
            Competidor::class,
            'tutor_competidor',
            'tutor_id',
            'competidor_id'
        )->withTimestamps();
    }
}

