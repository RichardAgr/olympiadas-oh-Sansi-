<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration{
    public function up(): void{
        Schema::create('notificacion', function (Blueprint $table) {
            $table->id('notificacion_id');
            $table->unsignedBigInteger('responsable_id');
            $table->unsignedBigInteger('tutor_id');
            $table->unsignedBigInteger('competidor_id')->nullable();
            $table->text('asunto');
            $table->text('mensaje');
            $table->date('fecha_envio');
            $table->boolean('estado')->default(true);
            $table->timestamps();
            
            $table->foreign('responsable_id')
                  ->references('responsable_id')
                  ->on('responsable_gestion')
                  ->onDelete('cascade');
                  
            $table->foreign('tutor_id')
                  ->references('tutor_id')
                  ->on('tutor')
                  ->onDelete('cascade');
                  
            $table->foreign('competidor_id')
                  ->references('competidor_id')
                  ->on('competidor')
                  ->onDelete('cascade');
            
            $table->index('responsable_id');
            $table->index('tutor_id');
            $table->index('competidor_id');
            $table->index('fecha_envio');
            
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_general_ci';
            $table->engine = 'InnoDB';
        });
    }

    public function down(): void{
        Schema::dropIfExists('notificacion');
    }
};
