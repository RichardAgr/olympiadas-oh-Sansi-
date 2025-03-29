<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateResponsableGestionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('responsable_gestions', function (Blueprint $table) {
            $table->id('responsable_id');
            $table->string('ci', 20)->unique();
            $table->string('nombres', 100);
            $table->string('apellidos', 100);
            $table->string('correo_electronico', 100);
            $table->string('telefono', 100);
            $table->date('fecha_asignacion')->default(now());  // Establece el valor por defecto a la fecha actual
            $table->boolean('estado')->default(true);  // Valor por defecto de estado a 'true'
            $table->timestamps();
            
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_general_ci';
            $table->engine = 'InnoDB';
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('responsable_gestions');
    }
}
