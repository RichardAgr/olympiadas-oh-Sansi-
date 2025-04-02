<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ResponsableGestion;
use Illuminate\Validation\ValidationException;

class ResponsableGestionController extends Controller
{
    /**
     * Mostrar todos los responsables de gestión.
     * GET /api/responsables
     */
    public function index()
    {
        $responsables = ResponsableGestion::all();
        return response()->json($responsables, 200);
    }

    /**
     * Registrar un nuevo responsable de gestión.
     * POST /api/responsables
     */
    public function store(Request $request)
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

    /**
     * Mostrar un responsable de gestión específico.
     * GET /api/responsables/{id}
     */
    public function show($id)
    {
        try {
            $responsable = ResponsableGestion::findOrFail($id);
            return response()->json($responsable, 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Responsable no encontrado',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * Modificar un responsable existente.
     * PUT /api/responsables/{id}
     */
    public function update(Request $request, $id)
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

    /**
     * Eliminar un responsable.
     * DELETE /api/responsables/{id}
     */
    public function destroy($id)
    {
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
