<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Recibo extends Model{
    use HasFactory;

    protected $table = 'recibo';
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

}
