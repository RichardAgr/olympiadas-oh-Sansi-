<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use App\Models\Admin;
use App\Models\Tutor;
use App\Models\ResponsableGestion;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        // Validación con mensajes personalizados
        $request->validate([
            'correo_electronico' => 'required|email',
            'password' => 'required'
        ], [
            'correo_electronico.required' => 'El correo electrónico es obligatorio.',
            'correo_electronico.email' => 'Formato de correo no válido.',
            'password.required' => 'La contraseña es obligatoria.'
        ]);

        $correo = $request->correo_electronico;
        $clave = $request->password;

        // ADMIN
        $admin = Admin::where('correo_electronico', $correo)->first();
        if ($admin && Hash::check($clave, $admin->password)) {
            $token = $admin->createToken('auth_token')->plainTextToken;
            return response()->json([
                'token' => $token,
                'rol' => 'admin',
                'usuario' => $admin
            ]);
        }

        // TUTOR
        $tutor = Tutor::where('correo_electronico', $correo)->first();
        if ($tutor) {
            Log::info('Tutor encontrado', ['correo' => $tutor->correo_electronico]);
        }

        if ($tutor && Hash::check($clave, $tutor->password)) {
            $token = $tutor->createToken('auth_token')->plainTextToken;
            return response()->json([
                'token' => $token,
                'rol' => 'tutor',
                'usuario' => $tutor
            ]);
        }

        // RESPONSABLE
        $responsable = ResponsableGestion::where('correo_electronico', $correo)->first();
        if ($responsable && Hash::check($clave, $responsable->password)) {
            $token = $responsable->createToken('auth_token')->plainTextToken;
            return response()->json([
                'token' => $token,
                'rol' => 'responsable',
                'usuario' => $responsable
            ]);
        }

        //Si no coincide ningún usuario
        return response()->json(['mensaje' => 'Credenciales inválidas'], 401);
    }
}

