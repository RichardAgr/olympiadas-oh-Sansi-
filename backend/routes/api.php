<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AreaController;
use App\Http\Controllers\apiK\CronogramaController;

// Ruta para obtener el usuario autenticado (si usas auth)
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Rutas RESTful para las áreas de competencia
Route::apiResource('areas', AreaController::class);

Route::get('/areasRegistras', [CronogramaController::class, 'getEventosCronograma']);