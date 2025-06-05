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

    public function registrarResponsableGestion(Request $request)
    {
        try {
            // Validar la entrada
            $request->validate([
                'nombres' => 'required|string|max:100',
                'apellidos' => 'required|string|max:100',
                'ci' => 'required|string|max:20|unique:responsable_gestion,ci',
                'correo_electronico' => 'required|email|max:100',
                'telefono' => 'required|string|max:100',
            ]);

            // Asignar automáticamente la fecha de asignación
            $fechaAsignacion = now(); // Laravel helpers proporcionan `now()` para obtener la fecha y hora actual

            // Crear el registro
            $responsable = ResponsableGestion::create([
                'ci' => $request->ci,
                'nombres' => $request->nombres,
                'apellidos' => $request->apellidos,
                'correo_electronico' => $request->correo_electronico,
                'telefono' => $request->telefono,
                'fecha_asignacion' => $fechaAsignacion, // Asignamos la fecha aquí
                'estado' => true, 
            ]);

            // Respuesta de éxito
            return response()->json([
                'message' => 'Responsable registrado con éxito',
                'responsable' => $responsable
            ], 201);
            
        }  catch (\Exception $e) {
            \Log::error('Error registering responsable: ' . $e->getMessage()); 
    
            return response()->json([
                'message' => 'Hubo un error al registrar al responsable',
                'error' => $e->getMessage(),
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

    use Illuminate\Support\Facades\Hash;

    public function verMiPerfil($id)
    {
        try {
            $responsable = ResponsableGestion::find($id);

            if (!$responsable) {
                return response()->json([
                    'success' => false,
                    'message' => 'Responsable de Gestión no encontrado'
                ], 404);
            }

            return response()->json([
                'responsable_id' => $responsable->responsable_id,
                'nombres' => $responsable->nombres,
                'apellidos' => $responsable->apellidos,
                'correo_electronico' => $responsable->correo_electronico,
                'telefono' => $responsable->telefono,
                'ci' => $responsable->ci,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener el perfil',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function cambiarPassword(Request $request, $id)
    {
        $request->validate([
            'password_actual' => 'required|string',
            'password' => 'required|string|min:6|confirmed',
        ]);

        $responsable = ResponsableGestion::find($id);
        if (!$responsable) {
            return response()->json(['success' => false, 'message' => 'Responsable de Gestión no encontrado.'], 404);
        }

        if (!Hash::check($request->password_actual, $responsable->password)) {
            return response()->json(['success' => false, 'message' => 'La contraseña actual es incorrecta.'], 401);
        }

        $responsable->password = Hash::make($request->password);
        $responsable->save();

        return response()->json(['success' => true, 'message' => 'Contraseña actualizada correctamente.']);
    }

}
