<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ImagenBoleta extends Migration{
    public function up(): void{
        Schema::create('imagen_boleta', function (Blueprint $table) {
            $table->id('imagen_id');
            $table->unsignedBigInteger('boleta_id');
            $table->text('ruta_imagen');
            $table->date('fecha_subida');
            $table->boolean('estado')->default(true);
            $table->timestamps();
            
            $table->foreign('boleta_id')
                  ->references('boleta_id')
                  ->on('boleta')
                  ->onDelete('cascade');
            
            $table->index('boleta_id');
            
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_general_ci';
            $table->engine = 'InnoDB';
        });
    }

    public function down(): void{
        Schema::dropIfExists('imagen_boleta');
    }
};
