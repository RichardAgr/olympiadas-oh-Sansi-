<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class NivelCategoria extends Migration{
    public function up(){
        Schema::create('nivel_categoria', function (Blueprint $table) {
            $table->id('nivel_categoria_id');
            $table->unsignedBigInteger('grado_id_inicial')->nullable();
            $table->unsignedBigInteger('grado_id_final')->nullable();
            $table->unsignedBigInteger('area_id');
            $table->string('nombre', 50);
            $table->text('descripcion');
            $table->boolean('estado');
            $table->timestamps();
            
            $table->foreign('grado_id_inicial')
                  ->references('grado_id')
                  ->on('grado')
                  ->onDelete('cascade');
                  
            $table->foreign('grado_id_final')
                  ->references('grado_id')
                  ->on('grado')
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
        Schema::dropIfExists('nivel_categoria');
    }
}
