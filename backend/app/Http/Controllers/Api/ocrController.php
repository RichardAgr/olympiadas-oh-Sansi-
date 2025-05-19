<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use thiagoalessio\TesseractOCR\TesseractOCR;
use Illuminate\Support\Facades\Storage;

class OcrController extends Controller
{
    public function extraerTexto(Request $request)
{
    if (!$request->hasFile('boleta')) {
        return response()->json(['error' => 'No se ha enviado ninguna imagen'], 400);
    }

    $request->validate([
        'boleta' => 'required|file|mimes:jpeg,jpg,png,bmp,tiff,webp|max:5120'
    ]);

    $file = $request->file('boleta');

    try {
        $path = $file->storeAs('ocr_temp', uniqid() . '.' . $file->getClientOriginalExtension(), 'local');
        $localPath = storage_path("app/{$path}");

        $ocr = new TesseractOCR($localPath);
        $ocr->executable('C:\Program Files\Tesseract-OCR\tesseract.exe')
            ->lang('spa')
            ->psm(6);

        $texto = $ocr->run();

        Storage::disk('local')->delete($path);

        // Extraer campos con expresiones regulares
        preg_match('/Nombre[:\s]+(.+)/i', $texto, $matchNombre);
        preg_match('/Nro\.?\s*(\d+)/i', $texto, $matchNro); 
        preg_match('/Total[:\s]+([\d,.]+)/i', $texto, $matchTotal);

        $nombre = isset($matchNombre[1]) ? preg_replace('/^[—–\-]+\s*/u', '', $matchNombre[1]) : 'No encontrado';
        $nro = $matchNro[1] ?? 'No encontrado';
        $total = $matchTotal[1] ?? 'No encontrado';

        return response()->json([
            'success' => true,
            'nombre' => trim($nombre),
            'nro' => $nro,
            'total' => $total,
            'texto_completo' => $texto // opcional para depuración
        ]);
    } catch (\Exception $e) {
        if (isset($path)) {
            Storage::disk('local')->delete($path);
        }

        return response()->json([
            'error' => 'Error al procesar la imagen: ' . $e->getMessage()
        ], 500);
    }
    }
}
