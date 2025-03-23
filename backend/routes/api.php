<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TablaDatosHU2Controller;

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

//obtener areas por relacion categoria y grados
Route::get('/areaCategoriaGrado', [TablaDatosHU2Controller::class, 'obtenerAreasCategoriaGrados']);
