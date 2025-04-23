<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AreaController;
use App\Http\Controllers\Api\ResponsableGestionController;
use App\Http\Controllers\Api\EventoController;
use App\Http\Controllers\Api\NivelEducativoController;
use App\Http\Controllers\Api\GradoController;
use App\Http\Controllers\Api\NivelCategoriaController;
use App\Http\Controllers\Api\BoletaController;
use App\Http\Controllers\Api\TutorController;
use App\Http\Controllers\Api\CompetidorController;
use App\Http\Controllers\Api\NotificacionController;
use App\Http\Controllers\Api\EstadisticasController;

Route::get('/evento/fechas', [EventoController::class, 'listarFechasEvento']);
Route::get('/evento/fechas/{area_id}/{tipo}', [EventoController::class, 'obtenerFechaPorTipo']);
Route::get('/evento/fechas', [EventoController::class, 'index']);
Route::post('/evento/fechas', [EventoController::class, 'store']);
Route::delete('/evento/fechas', [EventoController::class, 'destroy']);


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

Route::get('/pagos', [BoletaController::class, 'index']);

Route::get('/tutores/{tutorId}/competidores', [TutorController::class, 'competidoresTutor']);
Route::get('/tutoresInformacion', [TutorController::class, 'obtenerInformacionTutores']);
Route::put('/tutores/{id}/estado', [TutorController::class, 'actualizarEstadoTutor']);

Route::get('/competidores', [CompetidorController::class, 'index']);
Route::get('/informacionCompetidores/{id}/competidor', [CompetidorController::class, 'getDetallesCompetidor']);
Route::put('/competidor/{id}/estado', [CompetidorController::class, 'actualizarEstadoCompetidor']);
Route::get('/detallesCompetidor', [CompetidorController::class, 'obtenerDetallesCompetidor']);


Route::post('/notificaciones', [NotificacionController::class, 'crearNotificacion']);

Route::get('/estadisticasRespoGestion', [EstadisticasController::class, 'obtenerEstadisticasGenerales']);

