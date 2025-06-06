<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ResponsableGestion;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Mail;

class ResponsableGestionController extends Controller
{
    public function obtenerResponsableGestion()
    {
        $responsables = ResponsableGestion::all()->map(function ($responsable) {
            $responsable->ya_enviado = !empty($responsable->password);
            return $responsable;
        });

        return response()->json($responsables, 200);
    }

    public function registrarResponsableGestion(Request $request)
    {
        try {
            $request->validate([
                'nombres' => 'required|string|max:100',
                'apellidos' => 'required|string|max:100',
                'ci' => 'required|string|max:20|unique:responsable_gestion,ci',
                'correo_electronico' => 'required|email|max:100',
                'telefono' => 'required|string|max:100',
            ]);

            $passwordPlano = Str::random(10);

            $responsable = ResponsableGestion::create([
                'ci' => $request->ci,
                'nombres' => $request->nombres,
                'apellidos' => $request->apellidos,
                'correo_electronico' => $request->correo_electronico,
                'telefono' => $request->telefono,
                'fecha_asignacion' => now(),
                'estado' => true,
                'password' => Hash::make($passwordPlano),
            ]);

            Log::info("Contraseña enviada a {$responsable->correo_electronico}: {$passwordPlano}");

            try {
                Mail::raw(
                    "Hola {$responsable->nombres},\n\nTus credenciales de acceso a O! SanSi son:\nUsuario: {$responsable->correo_electronico}\nContraseña: {$passwordPlano}\n\nTe recomendamos cambiarla al iniciar sesión.",
                    function ($message) use ($responsable) {
                        $message->to($responsable->correo_electronico)
                                ->subject('Credenciales de acceso - O! SanSi');
                    }
                );
            } catch (\Exception $e) {
                Log::error("Error enviando correo a {$responsable->correo_electronico}: " . $e->getMessage());
            }

            return response()->json([
                'message' => 'Responsable registrado con éxito',
                'responsable' => $responsable
            ], 201);

        } catch (\Exception $e) {
            Log::error('Error al registrar responsable: ' . $e->getMessage());

            return response()->json([
                'message' => 'Hubo un error al registrar al responsable',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function obtenerDatosRespGestionId(int $responsableId): JsonResponse
    {
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
                return response()->json(['error' => 'Responsable no encontrado'], 404);
            }

            return response()->json([
                'message' => 'Responsable obtenido exitosamente',
                'data' => $this->formatResponsable($responsable)
            ]);
        } catch (\Exception $e) {
            Log::error('Error al obtener el responsable: ' . $e->getMessage());
            return response()->json(['error' => 'Error interno del servidor'], 500);
        }
    }

    private function formatResponsable($responsable): array
    {
        return [
            'responsable_id' => (int) $responsable->responsable_id,
            'nombre' => (string) $responsable->nombres,
            'apellido' => (string) $responsable->apellidos,
            'ci' => (string) $responsable->ci,
            'correo' => (string) $responsable->correo_electronico,
            'telefono' => (string) $responsable->telefono,
            'estado' => (bool) $responsable->estado,
            'created_at' => (string) $responsable->created_at,
            'updated_at' => (string) $responsable->updated_at,
        ];
    }

    public function editarResponsableGestion(Request $request, $id)
    {
        try {
            $responsable = ResponsableGestion::findOrFail($id);

            $request->validate([
                'ci' => 'required|string|max:20|unique:responsable_gestion,ci,' . $id . ',responsable_id',
                'nombres' => 'required|string|max:100',
                'apellidos' => 'required|string|max:100',
                'correo_electronico' => 'required|email|max:100',
            ]);

            $responsable->update($request->all());

            return response()->json([
                'message' => 'Responsable actualizado correctamente',
                'responsable' => $responsable
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Error en los datos enviados.',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Hubo un error al actualizar al responsable.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function eliminarResponsableGestion($id)
    {
        try {
            $responsable = ResponsableGestion::findOrFail($id);
            $responsable->delete();

            return response()->json(['message' => 'Responsable eliminado exitosamente']);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Hubo un error al eliminar al responsable',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function verMiPerfil($id)
    {
        try {
            $responsable = ResponsableGestion::find($id);

            if (!$responsable) {
                return response()->json(['success' => false, 'message' => 'Responsable de Gestión no encontrado'], 404);
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
        try {
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
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar contraseña.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function reenviarCredenciales($id)
    {
        try {
            $responsable = ResponsableGestion::findOrFail($id);
            $passwordPlano = Str::random(10);
            $responsable->password = Hash::make($passwordPlano);
            $responsable->save();

            Mail::raw(
                "Hola {$responsable->nombres},\n\nTus nuevas credenciales de acceso a O! SanSi son:\nUsuario: {$responsable->correo_electronico}\nContraseña: {$passwordPlano}\n\nTe recomendamos cambiarla al iniciar sesión.",
                function ($message) use ($responsable) {
                    $message->to($responsable->correo_electronico)
                            ->subject('Nuevas credenciales de acceso - O! SanSi');
                }
            );

            return response()->json(['message' => 'Credenciales enviadas con éxito.']);
        } catch (\Exception $e) {
            Log::error('Error al reenviar credenciales: ' . $e->getMessage());

            return response()->json([
                'message' => 'Error al enviar las credenciales.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function cambiarEstadoResponsable($id)
    {
        try {
            $responsable = ResponsableGestion::findOrFail($id);
            $responsable->estado = !$responsable->estado;
            $responsable->save();

            if (!$responsable->estado) {
                Mail::raw(
                    "Hola {$responsable->nombres},\n\nTu cuenta en O! SanSi ha sido desactivada. Ya no puedes iniciar sesión en la plataforma.",
                    function ($message) use ($responsable) {
                        $message->to($responsable->correo_electronico)
                                ->subject('Cuenta desactivada - O! SanSi');
                    }
                );
            } else {
                $passwordPlano = Str::random(10);
                $responsable->password = Hash::make($passwordPlano);
                $responsable->save();

                Mail::raw(
                    "Hola {$responsable->nombres},\n\nTu cuenta ha sido reactivada. Tus nuevas credenciales son:\nUsuario: {$responsable->correo_electronico}\nContraseña: {$passwordPlano}\n\nTe recomendamos cambiarla al iniciar sesión.",
                    function ($message) use ($responsable) {
                        $message->to($responsable->correo_electronico)
                                ->subject('Cuenta reactivada - O! SanSi');
                    }
                );
            }

            return response()->json(['message' => 'Estado actualizado correctamente.']);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al cambiar el estado.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
