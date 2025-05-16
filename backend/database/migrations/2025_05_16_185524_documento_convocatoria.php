<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration{
    public function up(): void{
        Schema::create('documento_convocatoria', function (Blueprint $table) {
            $table->id('documento_convocatoria_id');
            $table->foreignId('competencia_id')->constrained('competencia', 'competencia_id');
            $table->text('url_pdf');
            $table->date('fecha_creacion');
            $table->boolean('estado')->default(true);
            $table->timestamps();

            // Índices
            $table->index('competencia_id');
            
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_general_ci';
            $table->engine = 'InnoDB';
        });
    }

    public function down(): void{
        Schema::dropIfExists('documento_convocatoria');
    }
};
