<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder{
    public function run(){
        $this->call([
            ResponsableGestion::class,   
            NivelEducativo::class,      
            Ubicacion::class,            
            Competencia::class,           
            Area::class,                  
            Tutor::class,                
            Grado::class,                
            Colegio::class,           
            Curso::class,                
            NivelCategoria::class,        
            Competidor::class,              
            TutorCompetidor::class,      
            Boleta::class,
            CompetidorCompetencia::class, 
            Cronograma::class,
            ImagenBoleta::class,
            Notificacion::class,
        ]);
    }
}
