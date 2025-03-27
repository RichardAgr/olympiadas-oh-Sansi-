<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\apiR\TablaDatosHU2Controller;
use App\Http\Controllers\apiR\NivelCategoriaController;
use App\Http\Controllers\apiR\AreaCategoria;
use App\Http\Controllers\apiR\GradoController;

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

//obtener areas por relacion categoria y grados
Route::get('/areaCategoriaGrado', [TablaDatosHU2Controller::class, 'obtenerAreasCategoriaGrados']);
Route::get('/categoriaDatos/{id}', [NivelCategoriaController::class, 'DatosCategoria']);
Route::put('/editCategoria/{id}', [NivelCategoriaController::class, 'updateCategoria']);

// Eliminar una categoría y sus grados asociados
Route::delete('/categorias/{id}', [NivelCategoriaController::class, 'eliminarCategoria']);
Route::post('/crearCategoria', [NivelCategoriaController::class, 'store']);

// Eliminar un grado específico de una categoría
Route::put('/categorias/{categoriaId}/eliminarGrados', [GradoController::class, 'eliminarGradosdeCategoria']);

//Editar grados de una categoria:
Route::put('/editarGrado/{id}', [NivelCategoriaController::class, 'editarGrado']);
