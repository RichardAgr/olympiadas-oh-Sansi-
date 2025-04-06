<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\apiK\AreaControllerK;
use App\Http\Controllers\Api\AreaController;
use App\Http\Controllers\Api\ResponsableGestionController;
use App\Http\Controllers\Api\EventoController;
use App\Http\Controllers\apiR\TablaDatosHU2Controller;
use App\Http\Controllers\apiR\NivelCategoriaControllerR;
use App\Http\Controllers\apiR\AreaCategoriaR;
use App\Http\Controllers\apiR\GradoControllerR;


Route::get('/evento/fechas', [EventoController::class, 'index']);
Route::post('/evento/fechas', [EventoController::class, 'store']);
Route::delete('/evento/fechas', [EventoController::class, 'destroy']);




// Rutas RESTful para las áreas de competencia
Route::apiResource('areas', AreaController::class);

Route::get('/areasRegistradas', [AreaControllerK::class, 'getEventosCronograma']);
//Rutas RESTful para responsables de gestión
Route::apiResource('responsables', ResponsableGestionController::class);



//obtener areas por relacion categoria y grados
Route::get('/areaCategoriaGrado', [TablaDatosHU2Controller::class, 'obtenerAreasCategoriaGrados']);
Route::get('/categoriaDatos/{id}', [NivelCategoriaControllerR::class, 'DatosCategoria']);
Route::put('/editCategoria/{id}', [NivelCategoriaControllerR::class, 'updateCategoria']);

// Eliminar una categoría y sus grados asociados
Route::delete('/categorias/{id}', [NivelCategoriaControllerR::class, 'eliminarCategoria']);
Route::post('/crearCategoria', [NivelCategoriaControllerR::class, 'store']);

// Eliminar un grado específico de una categoría
Route::put('/categorias/{categoriaId}/eliminarGrados', [GradoControllerR::class, 'eliminarGradosdeCategoria']);

//Editar grados de una categoria:
Route::put('/editarGrado/{id}', [NivelCategoriaControllerR::class, 'editarGrado']);

