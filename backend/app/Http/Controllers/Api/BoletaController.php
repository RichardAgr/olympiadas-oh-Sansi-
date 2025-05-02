<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ImagenBoleta;
use App\Models\Boleta;
use App\Models\Tutor;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class BoletaController extends Controller
{
    public function index()
    {
        $boletas = Boleta::with(['tutor'])->get();

        foreach ($boletas as $boleta) {
            $imagen = ImagenBoleta::where('boleta_id', $boleta->boleta_id)
                ->orderBy('fecha_subida', 'desc')
                ->first();

            $boleta->imagen_manual = $imagen;
        }

        return response()->json($boletas);
    }

    /**HU-015 - Ver boletas de pago generadas por un tutor específico
     */
    public function boletasPorTutor($id)
    {
        try {
            $tutor = Tutor::find($id);

            if (!$tutor) {
                return response()->json([
                    'success' => false,
                    'message' => 'Tutor no encontrado'
                ], 404);
            }

            // Obtener las boletas del tutor
            $boletas = DB::table('boleta as b')
                ->leftJoin('imagen_boleta as ib', 'b.boleta_id', '=', 'ib.boleta_id')
                ->leftJoin('competidor_competencia as cc', 'b.boleta_id', '=', 'cc.boleta_id')
                ->leftJoin('area as a', 'cc.area_id', '=', 'a.area_id')
                ->select(
                    'b.boleta_id',
                    DB::raw('IFNULL(a.nombre, "Área no disponible") as area'),
                    'b.numero_boleta as numero_comprobante',
                    'b.monto_total as monto',
                    'b.fecha_pago',
                    'ib.ruta_imagen as imagen_url',
                    DB::raw('COUNT(DISTINCT cc.competidor_id) as cantidad_competidores')
                )
                ->where('b.tutor_id', $id)
                ->groupBy(
                    'b.boleta_id',
                    'a.nombre',
                    'b.numero_boleta',
                    'b.monto_total',
                    'b.fecha_pago',
                    'ib.ruta_imagen'
                )
                ->orderBy('b.fecha_pago', 'desc')
                ->get();

            return response()->json([
                'tutor' => [
                    'nombre_completo' => $tutor->nombres . ' ' . $tutor->apellidos
                ],
                'boletas' => $boletas
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener las boletas del tutor',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
