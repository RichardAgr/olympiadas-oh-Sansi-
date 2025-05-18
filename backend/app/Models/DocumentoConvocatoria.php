<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DocumentoConvocatoria extends Model
{
    use HasFactory;
    protected $table = 'documento_convocatoria';
    protected $primaryKey = 'documento_convocatoria_id';

    protected $fillable = [
        'competencia_id',
        'url_pdf',
        'fecha_creacion',
        'estado'
    ];
    public $timestamps = false;

    public function competencia()
    {
        return $this->belongsTo(Competencia::class, 'competencia_id', 'competencia_id');
    }
}
