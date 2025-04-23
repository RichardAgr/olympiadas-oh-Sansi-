<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TutorCompetidor extends Model
{
    use HasFactory;
    protected $table = 'tutor_competidor';
    protected $primaryKey = 'competidor_tutor';

    protected $fillable = [
        'competidor_id',
        'tutor_id',
        'nivel_respansabilidad',
        'realcion_competidor'
    ];

    public function competidor()
    {
        return $this->belongsTo(Competidor::class, 'competidor_id', 'competidor_id');
    }

    public function tutor()
    {
        return $this->belongsTo(Tutor::class, 'tutor_id', 'tutor_id');
    }
}
