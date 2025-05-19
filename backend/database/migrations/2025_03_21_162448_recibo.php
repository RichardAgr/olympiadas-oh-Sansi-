<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration{

    public function up(): void{
        Schema::create('recibo', function (Blueprint $table) {
            $table->id('recibo_id');
            $table->unsignedBigInteger('tutor_id');
            $table->string('numero_recibo', 20);
            $table->decimal('monto_total', 10, 2);
            $table->date('fecha_emision');
            $table->text('ruta_pdf');
            $table->string('estado', 20)->default('Pendiente');
            $table->timestamps();

            $table->foreign('tutor_id')
                  ->references('tutor_id')
                  ->on('tutor')
                  ->onDelete('cascade');

            $table->index('tutor_id');
            $table->index('numero_recibo');

            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_general_ci';
            $table->engine = 'InnoDB';
        });        


    }

    public function down(): void{
        Schema::dropIfExists('recibo');
    }
};
