<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration{
    public function up(): void{
            Schema::create('video_tutorial', function (Blueprint $table) {
            $table->id('video_id');
            $table->string('tipo_video', 20); 
            $table->text('url_video');
            $table->date('fecha_creacion');
            $table->boolean('estado')->default(true);
            $table->timestamps();

            $table->index('tipo_video');
            
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_general_ci';
            $table->engine = 'InnoDB';
        });
    }

    public function down(): void{
        Schema::dropIfExists('video_tutorial');
    }
};
