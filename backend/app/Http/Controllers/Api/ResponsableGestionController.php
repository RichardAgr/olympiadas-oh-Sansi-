<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ResponsableGestion;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class ResponsableGestionController extends Controller{
    public function obtenerResponsableGestion(){
        $responsables = ResponsableGestion::all();
        return response()->json($responsables, 200);
    }

    public function registrarResponsableGestion(Request $request): JsonResponse {
        try {
            // Validar los datos de entrada
            $validated = $request->validate([
                'nombres' => 'required|string|max:255',
                'apellidos' => 'required|string|max:255',
                'ci' => 'required|string|max:20|unique:responsable,ci',
                'correo_electronico' => 'required|email|max:255|unique:responsable,correo',
                'telefono' => 'required|string|max:20'
            ]);
            $responsableId = DB::table('responsable')->insertGetId([
                'nombre' => strtoupper(trim($validated['nombres'])), 
                'apellido' => strtoupper(trim($validated['apellidos'])), 
                'ci' => trim($validated['ci']),
                'correo' => strtolower(trim($validated['correo_electronico'])), 
                'telefono' => trim($validated['telefono']),
                'estado' => 1, // Por defecto activo
                'created_at' => now(),
                'updated_at' => now()
            ]);

            $responsable = DB::table('responsable')
                ->select([
                    'responsable_id',
                    'nombre',
                    'apellido',
                    'ci',
                    'correo',
                    'telefono',
                    'estado',
                    'created_at',
                    'updated_at'
                ])
                ->where('responsable_id', $responsableId)
                ->first();

            $responsableFormatted = [
                'responsable_id' => $responsable->responsable_id,
                'nombres' => $responsable->nombre,
                'apellidos' => $responsable->apellido,
                'ci' => $responsable->ci,
                'correo_electronico' => $responsable->correo,
                'telefono' => $responsable->telefono,
                'estado' => (bool) $responsable->estado,
                'estado_texto' => $responsable->estado ? 'Activo' : 'Inactivo',
                'created_at' => $responsable->created_at,
                'updated_at' => $responsable->updated_at
            ];

            return response()->json([
                'message' => 'Responsable registrado exitosamente',
                'data' => $responsableFormatted
            ], 201); // 201 Created

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'error' => 'Datos de entrada inválidos',
                'details' => $e->errors()
            ], 422);

        } catch (\Illuminate\Database\QueryException $e) {
            if ($e->getCode() == 23000) { 
                $errorMessage = 'Ya existe un responsable con ';
                if (strpos($e->getMessage(), 'ci') !== false) {
                    $errorMessage .= 'ese número de CI';
                } elseif (strpos($e->getMessage(), 'correo') !== false) {
                    $errorMessage .= 'ese correo electrónico';
                } else {
                    $errorMessage .= 'esos datos';
                }
                
                return response()->json([
                    'error' => $errorMessage
                ], 409); // Conflict
            }

            Log::error('Error de base de datos al crear responsable: ' . $e->getMessage());

            return response()->json([
                'error' => 'Error de base de datos'
            ], 500);

        } catch (Exception $e) {
            Log::error('Error al crear responsable: ' . $e->getMessage(), [
                'request_data' => $request->all(),
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ]);

            return response()->json([
                'error' => 'Error interno del servidor'
            ], 500);
        }
    }

    public function obtenerDatosRespGestionId(int $responsableId): JsonResponse{
       try {
            $responsable = DB::table('responsable_gestion')
                ->select([
                    'responsable_id',
                    'nombres',
                    'apellidos',
                    'ci',
                    'correo_electronico',
                    'telefono',
                    'estado',
                    'created_at',
                    'updated_at'
                ])
                ->where('responsable_id', $responsableId)
                ->first();

            if (!$responsable) {
                return response()->json([
                    'error' => 'Responsable no encontrado'
                ], 404);
            }

            $data = $this->formatResponsable($responsable);

            return response()->json([
                'message' => 'Responsable obtenido exitosamente',
                'data' => $data
            ], 200);
        } catch (Exception $e) {
            Log::error('Error al obtener el responsable: ' . $e->getMessage());

            return response()->json([
                'error' => 'Error interno del servidor'
            ], 500);
        }
    }

        private function formatResponsable($responsable): array
    {
        return [
            'responsable_id' => (int)$responsable->responsable_id,
            'nombre' => (string)$responsable->nombres,
            'apellido' => (string)$responsable->apellidos,
            'ci' => (string)$responsable->ci,
            'correo' => (string)$responsable->correo_electronico,
            'telefono' => (string)$responsable->telefono,
            'estado' => (bool)$responsable->estado,
            'created_at' => (string)$responsable->created_at,
            'updated_at' => (string)$responsable->updated_at,
        ];
    }


    public function editarResponsableGestion(Request $request, $id)
    {
        try {
            $responsable = ResponsableGestion::findOrFail($id);

            // Validar cambios sin los campos no deseados
            $request->validate([
                'ci' => 'required|string|max:20|unique:responsable_gestion,ci,' . $id . ',responsable_id',
                'nombres' => 'required|string|max:100',
                'apellidos' => 'required|string|max:100',
                'correo_electronico' => 'required|email|max:100',
            ]);

            // Actualizamos el responsable
            $responsable->update($request->all());

            return response()->json([
                'message' => 'Responsable actualizado correctamente',
                'responsable' => $responsable
            ]);
        } catch (ValidationException $e) {
            // Manejar errores de validación
            return response()->json([
                'message' => 'Error en los datos enviados.',
                'errors' => $e->errors()
            ], 422);  // Error de validación
        } catch (\Exception $e) {
            // Manejar cualquier otro error
            return response()->json([
                'message' => 'Hubo un error al actualizar al responsable.',
                'error' => $e->getMessage()
            ], 500);  // Error interno
        }
    }

    public function eliminarResponsableGestion($id){
        try {
            $responsable = ResponsableGestion::findOrFail($id);
            $responsable->delete();

            return response()->json([
                'message' => 'Responsable eliminado exitosamente'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Hubo un error al eliminar al responsable',
                'error' => $e->getMessage()
            ], 500); // Error interno
        }
    }
}
