<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class Boleta  extends Migration{
    public function up(): void{
        Schema::create('boleta', function (Blueprint $table) {
            $table->id('boleta_id');
            $table->unsignedBigInteger('tutor_id');
            $table->string('numero_boleta', 50);
            $table->string('nombre_pagador', 100);
            $table->decimal('monto_total', 10, 2);
            $table->date('fecha_emision');
            $table->date('fecha_pago')->nullable();
            $table->boolean('estado');
            $table->timestamps();
            
            $table->foreign('tutor_id')
                  ->references('tutor_id')
                  ->on('tutor')
                  ->onDelete('cascade');
            
            $table->index('tutor_id');
            $table->index('numero_boleta');
            $table->index(['fecha_emision', 'fecha_pago']);
            
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_general_ci';
            $table->engine = 'InnoDB';
        });
    }

    public function down(): void{
        Schema::dropIfExists('boleta');
    }
};
