<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cronograma extends Model
{
    use HasFactory;

    protected $table = 'cronograma';

    // Si estás utilizando 'id' como clave primaria
    protected $primaryKey = 'cronograma_id';

    public $timestamps = true; // La tabla tiene created_at y updated_at

    protected $fillable = [
        'competencia_id',
        'area_id', // Relación con área
        'nombre_evento', // Nombre del evento
        'descripcion', // Descripción del evento
        'fecha_inicio', // Fecha de inicio
        'fecha_fin', // Fecha de fin
        'tipo_evento', // Tipo de evento
        'anio_olimpiada', // Año de la olimpiada
    ];

    // Relación con el modelo Area
    public function area()
    {
        return $this->belongsTo(Area::class, 'area_id', 'id');
    }

    // Relación con el modelo Competencia
    public function competencia()
    {
        return $this->belongsTo(Competencia::class, 'competencia_id', 'id');
    }


}
