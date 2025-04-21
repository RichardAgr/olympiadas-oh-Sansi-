<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Tutor;
use App\Http\Resources\CompetidoresTutorResource;
use Illuminate\Http\Request;

class TutorController extends Controller{
    public function competidores($tutorId){
        $tutor = Tutor::findOrFail($tutorId);
        
        $tutor->load([
            'competidores.colegio',
            'competidores.curso.grado',
            'competidores.competencias.area'
        ]);
        
        return new CompetidoresTutorResource($tutor);
    }
}
