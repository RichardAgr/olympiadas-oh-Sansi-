<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class Competidor extends Migration{
    public function up(){
        Schema::create('competidor', function (Blueprint $table) {
            $table->id('competidor_id');
            $table->unsignedBigInteger('colegio_id');
            $table->unsignedBigInteger('curso_id');
            $table->unsignedBigInteger('ubicacion_id');
            $table->string('nombres', 100);
            $table->string('apellidos', 100);
            $table->string('ci', 20);
            $table->date('fecha_nacimiento');
            $table->string('estado', 30);
            $table->timestamps();
            
            $table->foreign('colegio_id')
                  ->references('colegio_id')
                  ->on('colegio')
                  ->onDelete('cascade');
                  
            $table->foreign('curso_id')
                  ->references('curso_id')
                  ->on('curso')
                  ->onDelete('cascade');
                  
            $table->foreign('ubicacion_id')
                  ->references('ubicacion_id')
                  ->on('ubicacion')
                  ->onDelete('cascade');
            
            $table->index('ci');
            $table->index(['apellidos', 'nombres']);
            $table->index('colegio_id');
            $table->index('curso_id');
            $table->index('ubicacion_id');
            
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_general_ci';
            $table->engine = 'InnoDB';
        });
    }

    public function down(){
        Schema::dropIfExists('competidor');
    }
}
