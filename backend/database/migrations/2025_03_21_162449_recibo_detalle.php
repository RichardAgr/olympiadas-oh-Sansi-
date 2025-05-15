<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration{

    public function up(): void    {
        Schema::create('recibo_detalle', function (Blueprint $table) {
            $table->id('recibo_detalle_id');
            $table->unsignedBigInteger('recibo_id');
            $table->unsignedBigInteger('competidor_id');
            $table->string('estado', 20);
            $table->timestamps();

            $table->foreign('recibo_id')
                  ->references('recibo_id')
                  ->on('recibo')
                  ->onDelete('cascade');

            $table->foreign('competidor_id')
                  ->references('competidor_id')
                  ->on('competidor')
                  ->onDelete('cascade');

            $table->index(['recibo_id', 'competidor_id']);

            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_general_ci';
            $table->engine = 'InnoDB';
        });
    }

    public function down(): void{
        Schema::dropIfExists('recibo_detalle');
    }
};
