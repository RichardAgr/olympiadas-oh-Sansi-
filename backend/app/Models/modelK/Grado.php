<?php

namespace App\Models\modelK;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Grado extends Model{
    use HasFactory;
    protected $table = 'grado';
    protected $primaryKey = 'grado_id';
    protected $fillable = [
        'nivel_educativo_id',
        'nombre',
        'abreviatura',
    ];

    protected $casts = [
        'estado' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    public function nivelEducativo(){
        return $this->belongsTo(NivelEducativo::class, 'nivel_educativo_id', 'nivel_educativo_id');
    }

    public function cursos(){
        return $this->hasMany(Curso::class, 'grado_id', 'grado_id');
    }
}
