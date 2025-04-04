<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Area;

class Competencia extends Model
{
    use HasFactory;

    // Table name (in case Laravel tries pluralizing it)
    protected $table = 'competencia';

    // Mass assignable fields
    protected $fillable = [
        'area_id',
        'nombre_competencia',
        'descripcion',
        'fecha_inicio',
        'fecha_fin',
        'estado',
    ];

    // Cast dates as Carbon instances
    protected $casts = [
        'fecha_inicio' => 'date',
        'fecha_fin' => 'date',
    ];

    /**
     * A competition belongs to an area.
     */
    public function area()
    {
        return $this->belongsTo(Area::class, 'area_id');
    }
}
