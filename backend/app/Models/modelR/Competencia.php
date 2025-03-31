<?php

namespace App\Models\modelR;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Competencia extends Model
{
    use HasFactory;
    protected $table = 'competencia';
    protected $primaryKey = 'competencia_id';
    
    protected $fillable = [
        'nivel_categoria_id',
        'nombre',
        'descripcion',
        'fecha_inicio',
        'fecha_fin',
        'costo',
    ];
    
    protected $casts = [
        'estado' => 'boolean',
        'fecha_inicio' => 'datetime',
        'fecha_fin' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];
}
