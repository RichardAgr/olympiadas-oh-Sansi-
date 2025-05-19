<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Recibo extends Model{
    use HasFactory;

    protected $table = 'RECIBO';
    protected $primaryKey = 'recibo_id';
    public $timestamps = false;

    protected $fillable = [
        'tutor_id',
        'numero_recibo',
        'monto_total',
        'fecha_emision',
        'ruta_pdf',
        'estado'
    ];

    // Relación con Tutor
    public function tutor()
    {
        return $this->belongsTo(Tutor::class, 'tutor_id', 'tutor_id');
    }

    // Relación con Boleta
    public function boletas()
    {
        return $this->hasMany(Boleta::class, 'recibo_id', 'recibo_id');
    }

    // Relación con ReciboDetalle
    public function detalles()
    {
        return $this->hasMany(ReciboDetalle::class, 'recibo_id', 'recibo_id');
    }
}
