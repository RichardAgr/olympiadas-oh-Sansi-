<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class Colegio extends Migration{
    public function up(){
        Schema::create('colegio', function (Blueprint $table) {
            $table->id('colegio_id');
            $table->unsignedBigInteger('ubicacion_id');
            $table->string('nombre', 100);
            $table->string('telefono', 10);
            $table->timestamps();
            
            $table->foreign('ubicacion_id')
                  ->references('ubicacion_id')
                  ->on('ubicacion')
                  ->onDelete('cascade');

            $table->index('ubicacion_id');
            $table->index('nombre');
            
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_general_ci';
            $table->engine = 'InnoDB';
        });
    }

    public function down(){
        Schema::dropIfExists('colegio');
    }
}
