<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Carbon\Carbon;

class PasswordResetController extends Controller
{
    public function enviarCodigo(Request $request)
    {
        $request->validate(['correo_electronico' => 'required|email']);
        $usuario = DB::table('tutor')->where('correo_electronico', $request->correo_electronico)
                   ->union(DB::table('responsable_gestion')->where('correo_electronico', $request->correo_electronico))
                   ->union(DB::table('admin')->where('correo_electronico', $request->correo_electronico))
                   ->first();

        if (!$usuario) {
            return response()->json(['mensaje' => 'Correo no encontrado.'], 404);
        }

        $codigo = random_int(100000, 999999);
        DB::table('password_resets')->updateOrInsert(
            ['correo_electronico' => $request->correo_electronico],
            ['token' => $codigo, 'created_at' => now(), 'intentos' => 0]
        );

        // Simulación de envío por correo (implementa Mail::send para producción)
        // Mail::to($request->correo_electronico)->send(new ResetPasswordMail($codigo));
        \Log::info("Código de recuperación enviado a {$request->correo_electronico}: $codigo");

        return response()->json(['mensaje' => 'Código de recuperación enviado al correo.']);
    }

    public function verificarCodigo(Request $request)
    {
        $request->validate(['correo_electronico' => 'required|email', 'token' => 'required']);
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

        return response()->json(['mensaje' => 'Código verificado.']);
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

        // Determinar modelo a actualizar
        $usuario = \App\Models\Tutor::where('correo_electronico', $request->correo_electronico)->first() ??
                   \App\Models\ResponsableGestion::where('correo_electronico', $request->correo_electronico)->first() ??
                   \App\Models\Admin::where('correo_electronico', $request->correo_electronico)->first();

        if (!$usuario) {
            return response()->json(['mensaje' => 'Usuario no encontrado.'], 404);
        }

        $usuario->password = Hash::make($request->password);
        $usuario->save();
        DB::table('password_resets')->where('correo_electronico', $request->correo_electronico)->delete();

        return response()->json(['mensaje' => 'Contraseña restablecida correctamente.']);
    }
}
