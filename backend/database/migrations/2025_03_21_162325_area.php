<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class Area extends Migration{

    public function up(){
        Schema::create('area', function (Blueprint $table) {
            $table->id('area_id');
            $table->integer('costo');
            $table->string('nombre', 50);
            $table->text('descripcion');
            $table->boolean('estado');
            $table->timestamps();

            $table->index('nombre');
            
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_general_ci';
            $table->engine = 'InnoDB';
        });
    }

    public function down(){
        Schema::dropIfExists('area');
    }
}
