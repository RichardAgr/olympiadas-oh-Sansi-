<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class TutorCompetidor extends Migration{
    public function up(){
        Schema::create('tutor_competidor', function (Blueprint $table) {
            $table->id('competidor_tutor');
            $table->unsignedBigInteger('competidor_id');
            $table->unsignedBigInteger('tutor_id');
            $table->string('nivel_respansabilidad', 50);
            $table->string('realcion_competidor', 50);
            $table->timestamps();
            
            $table->foreign('competidor_id')
                  ->references('competidor_id')
                  ->on('competidor')
                  ->onDelete('cascade');
                  
            $table->foreign('tutor_id')
                  ->references('tutor_id')
                  ->on('tutor')
                  ->onDelete('cascade');
            
            $table->index('competidor_id');
            $table->index('tutor_id');
            
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_general_ci';
            $table->engine = 'InnoDB';
        });
    }

    public function down(){
        Schema::dropIfExists('tutor_competidor');
    }
}
