<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ReciboDetalle extends Model
{
    use HasFactory;

    protected $table = 'recibo_detalle';
    protected $primaryKey = 'recibo_detalle_id';
    public $timestamps = false;

    protected $fillable = [
        'recibo_id',
        'competidor_id',
        'estado'
    ];

    // Relación con Recibo
    public function recibo()
    {
        return $this->belongsTo(Recibo::class, 'recibo_id', 'recibo_id');
    }

    // Relación con Competidor
    public function competidor()
    {
        return $this->belongsTo(Competidor::class, 'competidor_id', 'competidor_id');
    }

    // Relación con CompetidorCompetencia
    public function inscripciones()
    {
        return $this->hasMany(CompetidorCompetencia::class, 'recibo_detalle_id', 'recibo_detalle_id');
    }
}
