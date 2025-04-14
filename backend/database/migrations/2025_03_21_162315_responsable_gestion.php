<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ResponsableGestion extends Migration{

    public function up(){
        Schema::create('responsable_gestion', function (Blueprint $table) {
            $table->id('responsable_id');
            $table->string('ci', 20);
            $table->string('nombres', 100);
            $table->string('apellidos', 100);
            $table->string('correo_electronico', 100);
            $table->string('telefono', 100);
            $table->date('fecha_asignacion');
            $table->boolean('estado');
            $table->timestamps();

            $table->index('ci');
            
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_general_ci';
            $table->engine = 'InnoDB';
        });
    }


    public function down(){
        Schema::dropIfExists('responsable_gestion');
    }
}
