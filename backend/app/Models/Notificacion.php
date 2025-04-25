<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notificacion extends Model
{
    use HasFactory;

    protected $table = 'notificacion';
    protected $primaryKey = 'notificacion_id';
    
    protected $fillable = [
        'responsable_id',
        'tutor_id',
        'competidor_id',
        'asunto',
        'mensaje',
        'fecha_envio',
        'estado',
    ];

    protected $casts = [
        'fecha_envio' => 'date',
    ];

    // Relaciones
    public function responsable()
    {
        return $this->belongsTo(ResponsableGestion::class, 'responsable_id', 'responsable_id');
    }

    public function tutor()
    {
        return $this->belongsTo(Tutor::class, 'tutor_id', 'tutor_id');
    }

    public function competidor()
    {
        return $this->belongsTo(Competidor::class, 'competidor_id', 'competidor_id');
    }
}
