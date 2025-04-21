<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class Curso extends Migration{
    public function up(){
        Schema::create('curso', function (Blueprint $table) {
            $table->id('curso_id');
            $table->unsignedBigInteger('grado_id');
            $table->string('nombre', 50);
            $table->boolean('estado');
            $table->timestamps();
            
            $table->foreign('grado_id')
                  ->references('grado_id')
                  ->on('grado')
                  ->onDelete('cascade');

            $table->index('grado_id');
            
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_general_ci';
            $table->engine = 'InnoDB';
        });
    }

    public function down(){
        Schema::dropIfExists('curso');
    }
}
