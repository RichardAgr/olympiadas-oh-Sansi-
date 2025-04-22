<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Boleta extends Model{
    use HasFactory;

    protected $table = 'boleta';
    protected $primaryKey = 'boleta_id';
    
    protected $fillable = [
        'tutor_id',
        'numero_boleta',
        'nombre_pagador',
        'monto_total',
        'fecha_emision',
        'fecha_pago',
        'estado',
    ];

    protected $casts = [
        'fecha_emision' => 'date',
        'fecha_pago' => 'date',
    ];

    // Relaciones
    public function tutor()
    {
        return $this->belongsTo(Tutor::class, 'tutor_id', 'tutor_id');
    }

    public function imagenes()
    {
        return $this->hasMany(ImagenBoleta::class, 'boleta_id', 'boleta_id');
    }

    public function inscripciones()
    {
        return $this->hasMany(CompetidorCompetencia::class, 'boleta_id', 'boleta_id');
    }
}
