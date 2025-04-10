<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class Cronograma extends Migration{
    public function up(){
        Schema::create('cronograma', function (Blueprint $table) {
            $table->id('cronograma_id');
            $table->unsignedBigInteger('competencia_id');
            $table->unsignedBigInteger('area_id')->nullable();
            $table->string('nombre_evento', 100);
            $table->text('descripcion');
            $table->date('fecha_inicio');
            $table->date('fecha_fin');
            $table->string('tipo_evento', 50);
            $table->integer('anio_olimpiada');
            $table->timestamps();
            
            $table->foreign('competencia_id')
                  ->references('competencia_id')
                  ->on('competencia')
                  ->onDelete('cascade');
                  
            $table->foreign('area_id')
                  ->references('area_id')
                  ->on('area')
                  ->onDelete('cascade');
            
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_general_ci';
            $table->engine = 'InnoDB';
        });
    }

    public function down(){
        Schema::dropIfExists('cronograma');
    }
}
