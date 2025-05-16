<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use App\Services\OcrSpaceService;

class OcrPagoController extends Controller{
    protected $ocrService;

    public function __construct(OcrSpaceService $ocrService)
    {
        $this->ocrService = $ocrService;
    }

    public function processReceipt(Request $request){
        $validator = Validator::make($request->all(), [
            'image' => 'required|image|mimes:jpeg,png,jpg,webp|max:10240',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validación fallida',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $image = $request->file('image');
            $tempPath = $image->getRealPath();
            
            Log::debug('Procesando imagen OCR', [
                'name' => $image->getClientOriginalName(),
                'size' => $image->getSize(),
                'mime' => $image->getMimeType()
            ]);

            // Procesar directamente desde el archivo temporal
            $receiptData = $this->ocrService->processReceipt($tempPath);

            if ($receiptData['success'] ?? false) {
                $path = Storage::disk('public')->putFile('receipts', $image);
                /* $receiptData['image_path'] = $path; */
            }

            return response()->json($receiptData);

        } catch (\Exception $e) {
            Log::error('Error en OcrPagoController: '.$e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Error al procesar el comprobante',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}