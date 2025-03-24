<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TablaDatosHU2Controller;
use App\Http\Controllers\NivelCategoriaController;
use App\Http\Controllers\GradoController;

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

//obtener areas por relacion categoria y grados
Route::get('/areaCategoriaGrado', [TablaDatosHU2Controller::class, 'obtenerAreasCategoriaGrados']);
Route::get('/categoriaDatos', [NivelCategoriaController::class, 'DatosCategoria']);

// Eliminar una categoría y sus grados asociados
Route::delete('/categorias/{id}', [NivelCategoriaController::class, 'eliminarCategoria']);

// Eliminar un grado específico de una categoría
Route::put('/categorias/{categoriaId}/eliminarGrados', [GradoController::class, 'eliminarGradosdeCategoria']);