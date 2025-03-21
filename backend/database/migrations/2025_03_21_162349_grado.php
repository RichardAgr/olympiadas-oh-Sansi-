<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class Grado extends Migration{
    public function up(){
        Schema::create('grado', function (Blueprint $table) {
            $table->id('grado_id');
            $table->unsignedBigInteger('nivel_educativo_id');
            $table->string('nombre', 50);
            $table->string('abreviatura', 20);
            $table->integer('orden');
            $table->boolean('estado');
            $table->timestamps();
            
            $table->foreign('nivel_educativo_id')
                  ->references('nivel_educativo_id')
                  ->on('nivel_educativo')
                  ->onDelete('cascade');
            
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_general_ci';
            $table->engine = 'InnoDB';
        });
    }

    public function down(){
        Schema::dropIfExists('grado');
    }
}
