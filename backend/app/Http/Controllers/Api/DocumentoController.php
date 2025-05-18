<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\DocumentoArea;
use App\Models\DocumentoConvocatoria;
use App\Models\Area;
use App\Models\Competencia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class DocumentoController extends Controller{
public function guardarDocumentos(Request $request){
    try {
            $validator = Validator::make($request->all(), [
                'id' => 'required|integer',
                'secure_url' => 'required|url',
                'type' => 'required|string|in:area,convocatoria',
                'uploadedAt' => 'required|date'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Error de validación',
                    'errors' => $validator->errors()
                ], 422);
            }

            DB::beginTransaction();

            if ($request->type === 'area') {
                $area = Area::find($request->id);
                if (!$area) {
                    return response()->json([
                        'success' => false,
                        'message' => 'El área especificada no existe'
                    ], 404);
                }

                $documento = DocumentoArea::where('area_id', $request->id)->first();
                
                if ($documento) {
                    $documento->url_pdf = $request->secure_url;
                    $documento->fecha_creacion = $request->uploadedAt;
                    $documento->save();
                    
                    $mensaje = 'Documento de área actualizado correctamente';
                } else {
                    $documento = new DocumentoArea();
                    $documento->area_id = $request->id;
                    $documento->url_pdf = $request->secure_url;
                    $documento->fecha_creacion = $request->uploadedAt;
                    $documento->estado = true;
                    $documento->save();
                    
                    $mensaje = 'Documento de área guardado correctamente';
                }

                DB::commit();

                return response()->json([
                    'success' => true,
                    'message' => $mensaje,
                    'data' => $documento
                ], 200);
            } elseif ($request->type === 'convocatoria') {
                $competencia = Competencia::find($request->id);
                if (!$competencia) {
                    return response()->json([
                        'success' => false,
                        'message' => 'La competencia especificada no existe'
                    ], 404);
                }

                $documento = DocumentoConvocatoria::where('competencia_id', $request->id)->first();
                
                if ($documento) {
                    $documento->url_pdf = $request->secure_url;
                    $documento->fecha_creacion = $request->uploadedAt;
                    $documento->save();
                    
                    $mensaje = 'Documento de convocatoria actualizado correctamente';
                } else {
                    // Crear un nuevo documento
                    $documento = new DocumentoConvocatoria();
                    $documento->competencia_id = $request->id;
                    $documento->url_pdf = $request->secure_url;
                    $documento->fecha_creacion = $request->uploadedAt;
                    $documento->estado = true;
                    $documento->save();
                    
                    $mensaje = 'Documento de convocatoria guardado correctamente';
                }

                DB::commit();

                return response()->json([
                    'success' => true,
                    'message' => $mensaje,
                    'data' => $documento
                ], 200);
            }

            // Si llegamos aquí, algo salió mal con el tipo
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Tipo de documento no válido'
            ], 400);

        } catch (Exception $e) {
            DB::rollBack();
            
            Log::error('Error al guardar documento: ' . $e->getMessage(), [
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al guardar el documento',
                'error' => $e->getMessage()
            ], 500);
        }
}

public function getDocumento($type, $id){
    try {
            if ($type === 'area') {
                $documento = DocumentoArea::where('area_id', $id)
                    ->select('documento_area_id', 'area_id', 'url_pdf', 'fecha_creacion', 'estado')
                    ->first();
                
                if (!$documento) {
                    return response()->json([
                        'success' => false,
                        'message' => 'No se encontró documento para el área especificada'
                    ], 404);
                }
            
                return response()->json([
                    'success' => true,
                    'data' => $documento
                ]);
            } elseif ($type === 'convocatoria') {
                $documento = DocumentoConvocatoria::where('competencia_id', $id)
                    ->select('documento_convocatoria_id', 'competencia_id', 'url_pdf', 'fecha_creacion', 'estado')
                    ->first();
                
                if (!$documento) {
                    return response()->json([
                        'success' => false,
                        'message' => 'No se encontró documento para la competencia especificada'
                    ], 404);
                }
            
                return response()->json([
                    'success' => true,
                    'data' => $documento
                ]);
            }

            return response()->json([
                'success' => false,
                'message' => 'Tipo de documento no válido'
            ], 400);
        } catch (Exception $e) {
            Log::error('Error al obtener documento: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener el documento',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
