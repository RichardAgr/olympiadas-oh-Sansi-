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
    public function registrarTutor(Request $request)
{
    // Validación
    $request->validate([
        'nombres' => 'required|string|max:100',
        'apellidos' => 'required|string|max:100',
        'correo_electronico' => 'required|email|unique:tutor,correo_electronico',
        'telefono' => 'required|string|max:15',
        'ci' => 'required|string|max:15|unique:tutor,ci',
        'password' => 'required|string|min:6|confirmed',
    ], [
        'correo_electronico.unique' => 'Este correo ya está registrado.',
        'ci.unique' => 'Este número de C.I. ya existe.',
        'password.confirmed' => 'Las contraseñas no coinciden.'
    ]);

    // Crear tutor (se hashea automáticamente gracias al setPasswordAttribute del modelo)
    $tutor = \App\Models\Tutor::create([
        'nombres' => $request->nombres,
        'apellidos' => $request->apellidos,
        'correo_electronico' => $request->correo_electronico,
        'telefono' => $request->telefono,
        'ci' => $request->ci,
        'estado' => 1, // Activo por defecto
        'password' => $request->password
    ]);

    return response()->json([
        'mensaje' => 'Registro exitoso',
        'usuario' => $tutor
    ], 201);
}

}

