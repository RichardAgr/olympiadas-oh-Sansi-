<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CompetidorCompetencia extends Migration{
    public function up(){
        Schema::create('competidor_competencia', function (Blueprint $table) {
            $table->id('competidor_competencia_id');
            $table->unsignedBigInteger('competidor_id');
            $table->unsignedBigInteger('competencia_id');
            $table->unsignedBigInteger('area_id');
            $table->unsignedBigInteger('nivel_categoria_id');
            $table->unsignedBigInteger('boleta_id')->nullable();
            $table->date('fecha_inscripcion');
            $table->timestamps();
            
            $table->foreign('competidor_id')
                  ->references('competidor_id')
                  ->on('competidor')
                  ->onDelete('cascade');
                  
            $table->foreign('competencia_id')
                  ->references('competencia_id')
                  ->on('competencia')
                  ->onDelete('cascade');
                  
            $table->foreign('area_id')
                  ->references('area_id')
                  ->on('area')
                  ->onDelete('cascade');
                  
            $table->foreign('nivel_categoria_id')
                  ->references('nivel_categoria_id')
                  ->on('nivel_categoria')
                  ->onDelete('cascade');

            $table->foreign('boleta_id')
                  ->references('boleta_id')
                  ->on('boleta')
                  ->onDelete('cascade');
            
            $table->index('competidor_id');
            $table->index('competencia_id');
            $table->index('area_id');
            $table->index('nivel_categoria_id');
            $table->index('boleta_id');
            $table->index('fecha_inscripcion');

            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_general_ci';
            $table->engine = 'InnoDB';
        });
    }

    public function down(){
        Schema::dropIfExists('competidor_competencia');
    }
}
