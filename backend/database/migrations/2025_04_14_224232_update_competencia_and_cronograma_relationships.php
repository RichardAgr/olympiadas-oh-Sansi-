<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateCompetenciaAndCronogramaRelationships extends Migration
{
    public function up()
    {
        // ✅ Add area_id to competencia (if not already added in migrations)
        Schema::table('competencia', function (Blueprint $table) {
            if (!Schema::hasColumn('competencia', 'area_id')) {
                $table->unsignedBigInteger('area_id')->nullable()->after('updated_at');
                $table->foreign('area_id')->references('area_id')->on('area')->onDelete('cascade');
            }
        });

        // ✅ Make competencia_id in cronograma nullable
        Schema::table('cronograma', function (Blueprint $table) {
            $table->unsignedBigInteger('competencia_id')->nullable()->change();
        });
    }

    public function down()
    {
        Schema::table('cronograma', function (Blueprint $table) {
            $table->unsignedBigInteger('competencia_id')->nullable(false)->change();
        });

        Schema::table('competencia', function (Blueprint $table) {
            $table->dropForeign(['area_id']);
            $table->dropColumn('area_id');
        });
    }
}
