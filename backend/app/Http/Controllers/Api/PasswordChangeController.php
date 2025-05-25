<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use App\Models\Admin;
use App\Models\Tutor;
use App\Models\ResponsableGestion;

class PasswordChangeController extends Controller
{
    public function cambiarPassword(Request $request)
    {
        // Validar entrada
        $request->validate([
            'password_actual' => 'required',
            'password_nueva' => 'required|confirmed|min:6',
        ]);

        // Obtener usuario autenticado (usando Sanctum)
        $usuario = $request->user();

        if (!$usuario) {
            return response()->json(['mensaje' => 'Usuario no autenticado.'], 401);
        }

        // Log para depuración
        Log::info('Cambio de contraseña solicitado por usuario', [
            'id' => $usuario->id,
            'email' => $usuario->correo_electronico ?? $usuario->email ?? 'N/A'
        ]);

        // Verificar contraseña actual
        if (!Hash::check($request->password_actual, $usuario->password)) {
            return response()->json(['mensaje' => 'Contraseña actual incorrecta.'], 401);
        }

        // Actualizar contraseña
        $usuario->password = Hash::make($request->password_nueva);
        $usuario->save();

        return response()->json(['mensaje' => 'Contraseña actualizada correctamente.']);
    }
}
