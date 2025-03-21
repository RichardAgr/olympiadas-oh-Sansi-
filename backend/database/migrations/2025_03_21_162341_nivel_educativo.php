<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class NivelEducativo extends Migration{
    public function up(){
        Schema::create('nivel_educativo', function (Blueprint $table) {
            $table->id('nivel_educativo_id');
            $table->string('nombre', 50);
            $table->string('abreviatura', 20);
            $table->integer('orden');
            $table->boolean('estado');
            $table->timestamps();
            
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_general_ci';
            $table->engine = 'InnoDB';
        });
    }

    public function down(){
        Schema::dropIfExists('nivel_educativo');
    }
}
