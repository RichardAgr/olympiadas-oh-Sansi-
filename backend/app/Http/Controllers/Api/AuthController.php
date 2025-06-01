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
        // Validación de entrada
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

        // Intentar login como Admin
        $admin = Admin::where('correo_electronico', $correo)->first();
        if ($admin && Hash::check($clave, $admin->password)) {
            $token = $admin->createToken('auth_token')->plainTextToken;
            return response()->json([
                'token' => $token,
                'rol' => 'admin',  
                'usuario' => [
                    'id' => $admin->id,
                    'nombre' => $admin->nombre,  
                    'correo_electronico' => $admin->correo_electronico
                ]
            ]);
        }

        // Intentar login como Tutor
        $tutor = Tutor::where('correo_electronico', $correo)->first();
        if ($tutor && Hash::check($clave, $tutor->password)) {
            $token = $tutor->createToken('auth_token')->plainTextToken;
            return response()->json([
                'token' => $token,
                'rol' => 'tutor',  
                'usuario' => [
                    'tutor_id' => $tutor->tutor_id,
                    'nombres' => $tutor->nombres,
                    'apellidos' => $tutor->apellidos,
                    'correo_electronico' => $tutor->correo_electronico
                ]
            ]);
        }

        // Intentar login como ResponsableGestion
        $responsable = ResponsableGestion::where('correo_electronico', $correo)->first();
        if ($responsable && Hash::check($clave, $responsable->password)) {
            $token = $responsable->createToken('auth_token')->plainTextToken;
            return response()->json([
                'token' => $token,
                'rol' => 'responsable',  
                'usuario' => [
                    'id' => $responsable->id,
                    'nombres' => $responsable->nombres,
                    'apellidos' => $responsable->apellidos,
                    'correo_electronico' => $responsable->correo_electronico
                ]
            ]);
        }

        // Si ninguno coincide
        return response()->json(['mensaje' => 'Credenciales inválidas'], 401);
    }

    public function registrarTutor(Request $request)
    {
        // Validación completa
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

        // Crear tutor (password será hasheado automáticamente por el mutator)
        $tutor = Tutor::create([
            'nombres' => $request->nombres,
            'apellidos' => $request->apellidos,
            'correo_electronico' => $request->correo_electronico,
            'telefono' => $request->telefono,
            'ci' => $request->ci,
            'estado' => 1,
            'password' => $request->password
        ]);

        return response()->json([
            'mensaje' => 'Registro exitoso',
            'usuario' => $tutor
        ], 201);
    }

    public function logout(Request $request)
    {
        // Revocar todos los tokens para el usuario autenticado
        $request->user()->tokens()->delete();

        return response()->json([
            'mensaje' => 'Sesión cerrada exitósamente.'
        ]);
    }

    public function updatePassword(Request $request)
    {
        // Validar los campos ingresados
        $request->validate([
            'current_password' => 'required',
            'new_password' => [
                'required',
                'string',
                'min:8',
                'regex:/[A-Z]/', 
                'regex:/[0-9]/', 
                'regex:/[@$!%*#?&]/', 
                'different:current_password',
                'confirmed'
            ],
        ], [
            'new_password.regex' => 'La nueva contraseña debe contener al menos una mayúscula, un número y un símbolo.',
            'new_password.different' => 'La nueva contraseña debe ser diferente de la actual.',
            'new_password.confirmed' => 'La nueva contraseña y la confirmación no coinciden.'
        ]);

        $usuario = $request->user();

        // Verificar la contraseña actual
        if (!Hash::check($request->current_password, $usuario->password)) {
            return response()->json(['mensaje' => 'La contraseña actual es incorrecta.'], 422);
        }

        // Actualizar la contraseña
        $usuario->password = $request->new_password;
        $usuario->save();

        return response()->json(['mensaje' => 'Contraseña actualizada con éxito.']);
    }
}
