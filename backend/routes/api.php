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
use App\Http\Controllers\Api\OcrPagoController;
use App\Http\Controllers\Api\ReciboController;
use App\Http\Controllers\Api\UsuarioTutor\CompetidorController as UsuarioTutoCompetidorController;


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

//Inscribir manual
Route::post('/tutor/{tutor_id}/inscribir-competidor', [TutorController::class, 'inscribirCompetidor']);
Route::get('/tutor/competidor/datos-competencia', [TutorController::class, 'getOpcionesCompetencia']);
Route::post('/tutor/{tutor_id}/registrar-tutores', [TutorController::class, 'registrarTutores']);
Route::post('/tutor/{tutor_id}/boleta/generar', [BoletaController::class, 'generarBoleta']);
Route::get('/tutor/{tutor_id}/boleta/generar', [BoletaController::class, 'generarBoletaDesdeQuery']);

Route::get('/tutores/{id}/competidores-filtrados', [TutorController::class, 'competidoresFiltrados']);
Route::post('/tutores/{tutor_id}/competidor', [TutorController::class, 'inscribirCompetidor']);
//Route::post('/boleta/generar', [BoletaController::class, 'generarBoleta']);
Route::post('/boleta/generar/{competidorId}', [BoletaController::class, 'generarBoleta']);

Route::get('/tutores/{idTutor}/competidoresTutor', [TutorController::class, 'competidoresFiltrados']);


Route::get('/competidores', [CompetidorController::class, 'index']);
Route::get('/informacionCompetidores/{id}/competidor', [CompetidorController::class, 'getDetallesCompetidor']);
Route::put('/competidor/{id}/estado', [CompetidorController::class, 'actualizarEstadoCompetidor']);
Route::get('/detallesCompetidor', [CompetidorController::class, 'obtenerDetallesCompetidor']);

Route::get('/competidor/{id}', [CompetidorController::class, 'getDetallesCompetidor']);
Route::put('/competidor/{id}', [CompetidorController::class, 'update']);

Route::put('/tutor/competidor/{competidor_id}', [TutorController::class, 'actualizarDatosCompetidor']);
Route::get('/tutor/{id}/boletas', [BoletaController::class, 'boletasPorTutor']);



Route::post('/notificaciones', [NotificacionController::class, 'crearNotificacion']);

Route::get('/estadisticasRespoGestion', [EstadisticasController::class, 'obtenerEstadisticasGenerales']);


// Rutas para el Tutor
Route::get('/tutor/perfil/{id}', [TutorController::class, 'verPerfilTutor']);
Route::get('/VerMiPerfil/{idTutor}/Tutor', [TutorController::class, 'VerMiPerfil']);
Route::put('/tutor/ActualizarMiPerfil/{id}', [TutorController::class, 'ActualizarMiPerfil']);
Route::get('/tutor/VerNotificaciones/{id}/Notificaciones',[NotificacionController::class, 'VerNotificacionesTutor']);
Route ::post('/tutor/{id_tutor}/cambiarEstadoNotificacion/{id_notificacion}', [NotificacionController::class, 'cambiarEstadoNotificacion']);
Route ::put('/tutor/editarCompetidor/{id_competidor}', [UsuarioTutoCompetidorController::class, 'editarCompetidor']);
Route::post('/comprobante/procesar', [App\Http\Controllers\Api\BoletaPagoController::class, 'procesarComprobante']);

//OCR
Route::post('/processReceipt', [OcrPagoController::class, 'processReceipt']);
Route::post('/boletas/GuardarDatosOcr', [BoletaController::class, 'procesarBoletaOCR']);

