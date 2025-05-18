<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder{
    public function run(){
        $this->call([
            ResponsableGestion::class,   
            //Boleta::class,
            NivelEducativo::class,      
            Grado::class,                
            //NivelCategoria::class,        
            //Competencia::class,           
            //Ubicacion::class,            
            //CompetidorCompetencia::class, 
            //Area::class,                  
            //Tutor::class,                
            //Colegio::class,           
            //Curso::class,                
            //TutorCompetidor::class,      
            //Notificacion::class,
            //Competidor::class,              
            //ImagenBoleta::class,
            //Cronograma::class,
        ]);
    }
}
