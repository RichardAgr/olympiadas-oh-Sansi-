<?php

namespace App\Http\Controllers\Api\HomePage;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Area; // Assuming you have an Area model
use App\Models\DocumentoArea;

class AreasController extends Controller
{
    public function LinkDocumentoArea($id_area)
{
    // Buscar el área por su ID
    $area = Area::find($id_area);

    if (!$area) {
        return response()->json(['error' => 'Área no encontrada'], 404);
    }

    // Buscar el primer documento asociado al área
    $documento = DocumentoArea::where('area_id', $id_area)->first();

    if (!$documento) {
        return response()->json(['error' => 'No se encontraron documentos para esta área'], 404);
    }

    // Retornar solo el nombre del área y una sola URL
    return response()->json([
        'area' => $area->nombre,
        'url_pdf' => $documento->url_pdf
    ]);
}

}
