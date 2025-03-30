<?php

use App\Models\Area;
use App\Models\Cronograma;
use App\Models\Competencia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CronogramaController;
use App\Http\Controllers\CompetenciaController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});


Route::post('/cronograma', [CronogramaController::class, 'store']);
Route::post('/competencia', [CompetenciaController::class, 'store']);
Route::get('/areas', function () {
    return response()->json(Area::all());  // Devuelve un JSON con todas las áreas
});
Route::get('/areas/{area_id}', function ($area_id) {
    $area = Area::find($area_id);  // Buscar área por su ID

    if (!$area) {
        return response()->json(['message' => 'Área no encontrada'], 404);  // Si no se encuentra, devuelve error 404
    }

    return response()->json($area);  // Devuelve el área en formato JSON
});

// Obtener fechas de inscripción (cronograma)
Route::get('/cronograma/{area_id}', function ($area_id) {
    $cronograma = Cronograma::where('area_id', $area_id)->first();
    if (!$cronograma) {
        return response()->json(['message' => 'Sin fecha de inscripción registrada'], 404);
    }
    return response()->json($cronograma);
});

// Obtener fecha de competencia
Route::get('/competencia/{area_id}', function ($area_id) {
    $competencia = Competencia::where('area_id', $area_id)->first();
    if (!$competencia) {
        return response()->json(['message' => 'Sin fecha de competencia registrada'], 404);
    }
    return response()->json($competencia);
});
