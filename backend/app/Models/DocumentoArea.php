<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DocumentoArea extends Model
{
    use HasFactory;
    protected $table = 'documento_area';
    protected $primaryKey = 'documento_area_id';
    protected $fillable = [
        'area_id',
        'url_pdf',
        'fecha_creacion',
        'estado'
    ];

    public $timestamps = false;

    public function area()
    {
        return $this->belongsTo(Area::class, 'area_id', 'area_id');
    }
}
