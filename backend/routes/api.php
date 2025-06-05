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
use App\Http\Controllers\Api\DatosExcel;
use App\Http\Controllers\Api\DocumentoController;
use App\Http\Controllers\Api\UsuarioTutor\CompetidorController as UsuarioTutorCompetidorController;
use App\Http\Controllers\Api\VideoController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PasswordResetController;
use App\Http\Controllers\Api\HomePage\AreasController;

// Rutas públicas
Route::post('/login', [AuthController::class, 'login']);
Route::post('/registrar-tutor', [AuthController::class, 'registrarTutor']);
Route::post('/password/email', [PasswordResetController::class, 'enviarCodigo']);
Route::post('/password/verify', [PasswordResetController::class, 'verificarCodigo']);
Route::post('/password/reset', [PasswordResetController::class, 'resetearPassword']);
Route::get('/Mostrarvideos', [VideoController::class, 'mostrarDetalleVideo']);
Route::get('/areasCategoriasGrados', [AreaController::class, 'getAreasWithCategoriasGrados']);
// DocumentosHome
    Route::post('/documentos/tipoPortal', [DocumentoController::class, 'guardarDocumentos']);
    Route::get('/documentos/{type}/{id}', [DocumentoController::class, 'getDocumento']);
    Route::delete('/documentos/{type}/{id}', [DocumentoController::class, 'deleteDocumento']);
//DocumentosHome Convocatoria
Route::get('/documento-convocatoria/{año_competencia}/descargar', [DocumentoController::class, 'descargarDocumentoConvocatoria']);
//DocumentosHome Areas
Route::get('/documentos-areas/{id_area}', [AreasController::class, 'obtenerDocumentacionPorArea']);
// Rutas protegidas con Sanctum
//Route::middleware('auth:sanctum')->group(function() {
    // Logout
    Route::post('/logout', [AuthController::class, 'logout']);
    //responsable de gestion
    Route::get('/datosResponsableGestion', [ResponsableGestionController::class, 'obtenerResponsableGestion']);
    Route::get('/datosResponsableId/{responsableId}', [ResponsableGestionController::class, 'obtenerDatosRespGestionId']);
    Route::delete('/eliminarResponsableGestion/{id}', [ResponsableGestionController::class, 'eliminarResponsableGestion']);
    Route::put('/editarResponsableGestion/{id}', [ResponsableGestionController::class, 'editarResponsableGestion']);
    Route::post('/registrarResponGestion', [ResponsableGestionController::class, 'registrarResponsableGestion']);
    Route::get('/responsable/perfil/{id}', [ResponsableGestionController::class, 'verMiPerfil']);
    Route::post('/responsable/cambiar-password/{id}', [ResponsableGestionController::class, 'cambiarPassword']);

    // Eventos
    Route::get('/area/{areaId}/cronogramas', [EventoController::class, 'ObtenerCronogramasPorArea']);
    Route::get('/cronogramasAreas', [EventoController::class, 'ObtenerCronogramasPorArea2']);
    Route::put('/editarCronograma/{areaId}', [EventoController::class, 'EditarCronograma']);


    // Áreas
    Route::get('/areasRegistradas', [AreaController::class,'ObtenerAreasRegistradas']);
    Route::delete('/eliminarArea/{areaId}', [AreaController::class,'EliminarArea']);
    Route::get('/obtenerDatosArea/{areaId}', [AreaController::class,'DatosAreaId']);
    Route::post('/registrarArea', [AreaController::class,'RegistrarNuevaArea']);
    Route::get('/datosAreaCompleto', [AreaController::class,'DatosAreasCompleto']);
    Route::put('/actualizarArea/{areaId}', [AreaController::class,'actualizarArea']);
/*     Route::get('/areasRegistradas', [AreaController::class, 'getEventosCronograma']); */

    // Niveles
    Route::apiResource('niveles-educativos', NivelEducativoController::class);
    Route::apiResource('grados', GradoController::class);
    Route::apiResource('nivel-categorias', NivelCategoriaController::class);

    // Tutor
    Route::get('/tutores/{tutorId}/competidoresTutor', [TutorController::class, 'competidoresTutor']);
    Route::get('/tutoresInformacion', [TutorController::class, 'obtenerInformacionTutores']);
    Route::put('/tutores/{id}/estado', [TutorController::class, 'actualizarEstadoTutor']);
    Route::post('/tutor/{tutor_id}/inscribir-competidor', [TutorController::class, 'inscribirCompetidor']);
    Route::get('/tutor/competidor/datos-competencia', [TutorController::class, 'getOpcionesCompetencia']);
    Route::post('/tutor/{tutor_id}/registrar-tutores', [TutorController::class, 'registrarTutores']);
    Route::put('/tutor/competidor/{competidor_id}', [TutorController::class, 'actualizarDatosCompetidor']);
    Route::post('/tutor/{id}/cambiar-password', [TutorController::class, 'cambiarPassword']);
    Route::get('/tutor/perfil/{id}', [TutorController::class, 'verPerfilTutor']);
    Route::get('/VerMiPerfil/{idTutor}/Tutor', [TutorController::class, 'VerMiPerfil']);
    Route::put('/tutor/ActualizarMiPerfil/{id}', [TutorController::class, 'ActualizarMiPerfil']);
    Route::get('/tutor/VerNotificaciones/{id}/Notificaciones',[NotificacionController::class, 'VerNotificacionesTutor']);
    Route::post('/tutor/{id_tutor}/cambiarEstadoNotificacion/{id_notificacion}', [NotificacionController::class, 'cambiarEstadoNotificacion']);
    Route::get('/datosTutor/{id_tutor}', [TutorController::class, 'datosTutor']);
    Route::get('/tutores/{id}/competidores-filtrados', [TutorController::class, 'competidoresFiltrados']);

    // Boletas
    Route::get('/pagos', [BoletaController::class, 'index']);
    Route::post('/tutor/{tutor_id}/boleta/generar', [BoletaController::class, 'generarBoleta']);
    Route::get('/tutor/{tutor_id}/boleta/generar', [BoletaController::class, 'generarBoletaDesdeQuery']);
    Route::post('/boleta/generar/{competidorId}', [BoletaController::class, 'generarBoleta']);
    Route::get('/tutor/{id}/boletas', [BoletaController::class, 'boletasPorTutor']);
    Route::post('/comprobante/procesar', [App\Http\Controllers\Api\BoletaPagoController::class, 'procesarComprobante']);
    Route::post('/boletas/pagoInscripcion', [BoletaController::class, 'procesarPagoOCR']);

    // Competidores
    Route::get('/competidores', [CompetidorController::class, 'index']);
    Route::get('/informacionCompetidores/{id}/competidor', [CompetidorController::class, 'getDetallesCompetidor']);
    Route::put('/competidor/{id}/estado', [CompetidorController::class, 'actualizarEstadoCompetidor']);
    Route::get('/detallesCompetidor', [CompetidorController::class, 'obtenerDetallesCompetidor']);
    Route::get('/competidor/{id}', [CompetidorController::class, 'getDetallesCompetidor']);
    Route::put('/competidor/{id}', [CompetidorController::class, 'update']);
    Route::post('/tutores/{tutor_id}/competidor', [TutorController::class, 'inscribirCompetidor']);
    Route::put('/tutor/editarCompetidor/{id_competidor}', [UsuarioTutorCompetidorController::class, 'editarCompetidor']);

    // Notificaciones
    Route::get('/notificaciones/{id_tutor}', [NotificacionController::class, 'contarNotificacionesActivas']);
    Route::post('/notificaciones', [NotificacionController::class, 'crearNotificacion']);

    // Estadísticas
    Route::get('/estadisticasRespoGestion', [EstadisticasController::class, 'obtenerEstadisticasGenerales']);

    // OCR
    Route::post('/processReceipt', [OcrPagoController::class, 'processReceipt']);

    // Recibos
    Route::post('/guardarDatos/recibos', [ReciboController::class, 'registrarRecibo']);
    Route::post('/guardarDatos/recibosInscripcionManual', [ReciboController::class, 'registrarReciboInscripcionManual']);
    Route::get('/recibos/tutor/{tutorId}', [ReciboController::class, 'obtenerRecibosPorTutor']);

    // Excel
    Route::post('/guardarDatos/excel', [DatosExcel::class, 'procesarExcel']);
    
    
    // Videos Admin
    Route::post('/Guardarvideos', [VideoController::class, 'crearVideo']);
    Route::delete('/Eliminarvideos/{tipo_video}', [VideoController::class, 'eliminarVideo']);

//});