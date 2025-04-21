<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AreaController;
use App\Http\Controllers\Api\ResponsableGestionController;
use App\Http\Controllers\Api\EventoController;
use App\Http\Controllers\Api\NivelEducativoController;
use App\Http\Controllers\Api\GradoController;
use App\Http\Controllers\Api\NivelCategoriaController;
use App\Http\Controllers\Api\CompetidorController;
use App\Http\Controllers\Api\TutorController;

Route::get('/competidores', [CompetidorController::class, 'index']);
Route::get('/evento/fechas', [EventoController::class, 'listarFechasEvento']);
Route::get('/evento/fechas/{area_id}/{tipo}', [EventoController::class, 'obtenerFechaPorTipo']);
Route::get('/evento/fechas', [EventoController::class, 'index']);
Route::post('/evento/fechas', [EventoController::class, 'store']);


// Ruta para obtener el usuario autenticado (si usas auth)
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Rutas RESTful para las áreas de competencia
Route::apiResource('areas', AreaController::class);


Route::get('/areasRegistradas', [AreaController::class, 'getEventosCronograma']);
//Rutas RESTful para responsables de gestión
Route::apiResource('responsables', ResponsableGestionController::class);

Route::apiResource('niveles-educativos', NivelEducativoController::class);
Route::apiResource('grados', GradoController::class);
Route::apiResource('nivel-categorias', NivelCategoriaController::class);
Route::get('/competidores', [CompetidorController::class, 'index']);
Route::get('/tutores', [TutorController::class, 'index']);

Route::get('/tutores', [TutorController::class, 'index']);
Route::put('/tutores/estado/masivo', [TutorController::class, 'actualizarEstadoMasivo']);
Route::put('/tutores/{id}/estado', [TutorController::class, 'cambiarEstado']);
Route::get('/tutores/exportar', [TutorController::class, 'exportar']);
