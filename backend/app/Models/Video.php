<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Video extends Model
{
    use HasFactory;
    
    protected $table = 'video_tutorial';

    protected $primaryKey = 'video_id';

    public $incrementing = true;

    protected $keyType = 'int';

    public $timestamps = true;

    protected $fillable = [
        'tipo_video',
        'url_video',
        'fecha_creacion',
        'estado',
    ];

    
    protected $casts = [
        'estado' => 'boolean',
        'fecha_creacion' => 'date',
    ];
}
