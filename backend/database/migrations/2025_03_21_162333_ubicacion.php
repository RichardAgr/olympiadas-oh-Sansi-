<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class Ubicacion extends Migration
{
    public function up(){
        Schema::create('ubicacion', function (Blueprint $table) {
            $table->id('ubicacion_id');
            $table->string('departamento', 50);
            $table->string('provincia', 50);
            $table->timestamps();

            $table->index(['departamento', 'provincia']);
            
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_general_ci';
            $table->engine = 'InnoDB';
        });
    }

    public function down(){
        Schema::dropIfExists('ubicacion');
    }
}
