<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class PasswordResetController extends Controller
{
    public function enviarCodigo(Request $request)
    {
        $request->validate(['correo_electronico' => 'required|email']);

        // 🔍 Buscar usuario en cada tabla por separado
        $tutor = DB::table('tutor')->where('correo_electronico', $request->correo_electronico)->first();
        $responsable = DB::table('responsable_gestion')->where('correo_electronico', $request->correo_electronico)->first();
        $admin = DB::table('admin')->where('correo_electronico', $request->correo_electronico)->first();

        $usuario = $tutor ?? $responsable ?? $admin;

        if (!$usuario) {
            return response()->json(['mensaje' => 'Correo electrónico no encontrado.'], 404);
        }

        // 🔐 Generar código aleatorio
        $codigo = random_int(100000, 999999);

        DB::table('password_resets')->updateOrInsert(
            ['correo_electronico' => $request->correo_electronico],
            [
                'token' => $codigo,
                'created_at' => now(),
                'intentos' => 0
            ]
        );

        // 📧 Simular el envío del código por correo
        Log::info("Código de recuperación enviado a {$request->correo_electronico}: $codigo");

        return response()->json(['mensaje' => 'Código de recuperación enviado al correo electrónico.']);
    }

    public function verificarCodigo(Request $request)
    {
        $request->validate([
            'correo_electronico' => 'required|email',
            'token' => 'required'
        ]);

        $reset = DB::table('password_resets')->where('correo_electronico', $request->correo_electronico)->first();

        if (!$reset || $reset->intentos >= 5) {
            return response()->json(['mensaje' => 'Código inválido o cuenta bloqueada.'], 403);
        }

        if (Carbon::parse($reset->created_at)->addHour()->isPast()) {
            return response()->json(['mensaje' => 'Código expirado.'], 403);
        }

        if ($reset->token != $request->token) {
            DB::table('password_resets')->where('correo_electronico', $request->correo_electronico)->increment('intentos');
            return response()->json(['mensaje' => 'Código incorrecto.'], 401);
        }

        return response()->json(['mensaje' => 'Código verificado correctamente.']);
    }

    public function resetearPassword(Request $request)
    {
        $request->validate([
            'correo_electronico' => 'required|email',
            'token' => 'required',
            'password' => 'required|confirmed|min:6'
        ]);

        $reset = DB::table('password_resets')->where('correo_electronico', $request->correo_electronico)->first();

        if (!$reset || $reset->token != $request->token) {
            return response()->json(['mensaje' => 'Token inválido.'], 401);
        }

        // 🔍 Determinar modelo donde está el usuario
        $usuario = \App\Models\Tutor::where('correo_electronico', $request->correo_electronico)->first() ??
                   \App\Models\ResponsableGestion::where('correo_electronico', $request->correo_electronico)->first() ??
                   \App\Models\Admin::where('correo_electronico', $request->correo_electronico)->first();

        if (!$usuario) {
            return response()->json(['mensaje' => 'Usuario no encontrado.'], 404);
        }

        // 🔑 Actualizar contraseña con Hash seguro
        $usuario->password = Hash::make($request->password);
        $usuario->save();

        // 🧹 Eliminar el código usado
        DB::table('password_resets')->where('correo_electronico', $request->correo_electronico)->delete();

        return response()->json(['mensaje' => 'Contraseña restablecida correctamente.']);
    }
}
