<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Competencia extends Model
{
    use HasFactory;

    protected $table = 'competencia';

    protected $primaryKey = 'competencia_id'; // Definir la clave primaria correctamente

    public $timestamps = true; // La tabla tiene created_at y updated_at

    // Definir los campos que pueden ser asignados masivamente
    protected $fillable = [
        'competencia_id',
        'nombre_competencia',  // Campo nombre_competencia
        'descripcion',         // Añadir campo descripcion
        'fecha_inicio',        // Campo fecha_inicio
        'estado',
    ];

    // Se pueden agregar valores por defecto para los campos si es necesario
    protected $attributes = [
        'nombre_competencia' => 'Competencia Sin Nombre', // Valor predeterminado
        'descripcion' => 'Descripción no proporcionada',   // Valor predeterminado
        'estado' => '1',   // Valor predeterminado
    ];
}
