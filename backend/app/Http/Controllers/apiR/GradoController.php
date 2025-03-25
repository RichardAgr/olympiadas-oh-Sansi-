<?php

namespace App\Http\Controllers\apiR;

use App\Models\modelR\Grado;
use App\Models\modelR\NivelCategoria;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;

class GradoController extends Controller{
    public function eliminarGradosdeCategoria($id){
        try {

            DB::beginTransaction();
            
            $categoria = DB::table('nivel_categoria')
                ->where('nivel_categoria_id', $id)
                ->first();
                
            if (!$categoria) {
                return response()->json([
                    'success' => false,
                    'message' => 'Categoría no encontrada'
                ], Response::HTTP_NOT_FOUND);
            }
            
            $gradoInicialId = $categoria->grado_id_inicial;
            $gradoFinalId = $categoria->grado_id_final;
            
            $gradoInicial = DB::table('grado')
                ->where('grado_id', $gradoInicialId)
                ->first();
                
            $gradoFinal = DB::table('grado')
                ->where('grado_id', $gradoFinalId)
                ->first();
                
            if (!$gradoInicial || !$gradoFinal) {
                return response()->json([
                    'success' => false,
                    'message' => 'Uno o ambos grados del rango no fueron encontrados'
                ], Response::HTTP_NOT_FOUND);
            }

            DB::table('nivel_categoria')
                ->where('nivel_categoria_id', $id)
                ->update([
                    'estado' => 0 // Asumiendo que tienes un campo 'estado'
                ]);
            
            // Actualizar el grado inicial
            DB::table('grado')
                ->where('grado_id', $gradoInicialId)
                ->update([
                    'nombre' => '------',
                    'estado' => 0 // Asumiendo que tienes un campo 'estado'
                ]);
                
            // Si el grado final es diferente del inicial, actualizarlo también
            if ($gradoFinalId != $gradoInicialId) {
                DB::table('grado')
                    ->where('grado_id', $gradoFinalId)
                    ->update([
                        'nombre' => '------',
                        'estado' => 0
                    ]);
            }
            
            // Si hay grados intermedios en el rango, actualizarlos también
            if ($gradoInicialId < $gradoFinalId) {
                DB::table('grado')
                    ->whereBetween('grado_id', [$gradoInicialId + 1, $gradoFinalId - 1])
                    ->update([
                        'nombre' => '------',
                        'estado' => 0
                    ]);
            }
            
            // Confirmar la transacción
            DB::commit();
            
            // Registrar la acción en el log
            Log::info('Grados de categoría marcados como eliminados', [
                'nivel_categoria_id' => $id,
                'grado_inicial_id' => $gradoInicialId,
                'grado_final_id' => $gradoFinalId,
                'usuario_id' => auth()->check() ? auth()->id() : 'sistema',
                'timestamp' => now()
            ]);
            
            return response()->json([
                'success' => true,
                'message' => 'Grados de la categoría marcados como eliminados correctamente'
            ], Response::HTTP_OK);
            
        } catch (\Exception $e) {
            // Revertir la transacción en caso de error
            DB::rollBack();
            
            // Registrar el error
            Log::error('Error al marcar grados de categoría como eliminados: ' . $e->getMessage(), [
                'nivel_categoria_id' => $id,
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Error al marcar los grados de la categoría como eliminados',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
