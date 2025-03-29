<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\apiK\AreaControllerK;
use App\Http\Controllers\AreaController;

// Ruta para obtener el usuario autenticado (si usas auth)
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Rutas RESTful para las áreas de competencia
Route::apiResource('areas', AreaController::class);

Route::get('/areasRegistradas', [AreaControllerK::class, 'getEventosCronograma']);