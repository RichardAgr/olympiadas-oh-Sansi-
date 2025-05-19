<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration{
    public function up(): void{
        Schema::create('documento_area', function (Blueprint $table) {
            $table->id('documento_area_id');
            $table->foreignId('area_id')->constrained('area', 'area_id');
            $table->text('url_pdf')->nullable();
            $table->date('fecha_creacion');
            $table->boolean('estado')->default(true);
            $table->timestamps();

            // Índices
            $table->index('area_id');
            
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_general_ci';
            $table->engine = 'InnoDB';
        });
    }

    public function down(): void{
        Schema::dropIfExists('documento_area');
    }
};
