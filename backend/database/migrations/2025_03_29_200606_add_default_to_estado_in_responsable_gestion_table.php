<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddDefaultToEstadoInResponsableGestionTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('responsable_gestion', function (Blueprint $table) {
            $table->boolean('estado')->default(true)->change(); // Cambiar estado a 'true' por defecto
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('responsable_gestion', function (Blueprint $table) {
            $table->boolean('estado')->default(false)->change(); // Revertir al valor anterior si es necesario
        });
    }
}

