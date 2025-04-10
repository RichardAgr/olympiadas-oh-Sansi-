<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class Competencia extends Migration{
    public function up(){
        Schema::create('competencia', function (Blueprint $table) {
            $table->id('competencia_id');
            $table->string('nombre_competencia', 50);
            $table->text('descripcion');
            $table->date('fecha_inicio');
            $table->boolean('estado');
            $table->timestamps();

            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_general_ci';
            $table->engine = 'InnoDB';
            
            $table->index('nombre_competencia');
        });
    }

    public function down(){
        Schema::dropIfExists('competencia');
    }
}
