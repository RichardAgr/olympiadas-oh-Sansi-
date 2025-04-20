<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class Tutor extends Migration{
    public function up(){
        Schema::create('tutor', function (Blueprint $table) {
            $table->id('tutor_id');
            $table->string('ci', 20);
            $table->string('nombres', 100);
            $table->string('apellidos', 100);
            $table->string('correo_electronico', 100);
            $table->string('telefono', 100);
            $table->boolean('estado');
            $table->timestamps();

            $table->index('ci');
            $table->index(['apellidos', 'nombres']);
            $table->index('correo_electronico');
            
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_general_ci';
            $table->engine = 'InnoDB';
        });
    }

    public function down(){
        Schema::dropIfExists('tutor');
    }
}
