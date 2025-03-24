<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TablaDatosHU2Controller;
use App\Http\Controllers\NivelCategoriaController;


Route::get('/', function () {
    return view('welcome');
});

Route::get('/cate/{id}',[NivelCategoriaController::class,'DatosCategoria']);

