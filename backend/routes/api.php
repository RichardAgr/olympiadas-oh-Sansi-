<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AreaController;
use App\Http\Controllers\Api\ResponsableGestionController;
use App\Http\Controllers\Api\EventoController;
use App\Http\Controllers\Api\NivelEducativoController;
use App\Http\Controllers\Api\GradoController;
use App\Http\Controllers\Api\NivelCategoriaController;


Route::get('/evento/fechas', [EventoController::class, 'index']);
Route::post('/evento/fechas', [EventoController::class, 'store']);
Route::delete('/evento/fechas', [EventoController::class, 'destroy']);




// Rutas RESTful para las áreas de competencia
Route::apiResource('areas', AreaController::class);

Route::get('/areasRegistradas', [AreaController::class, 'getEventosCronograma']);
//Rutas RESTful para responsables de gestión
Route::apiResource('responsables', ResponsableGestionController::class);

Route::apiResource('niveles-educativos', NivelEducativoController::class);
Route::apiResource('grados', GradoController::class);
Route::apiResource('nivel-categorias', NivelCategoriaController::class);