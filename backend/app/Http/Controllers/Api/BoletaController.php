<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ImagenBoleta;
use App\Models\Boleta;
use App\Models\Tutor;
use App\Models\CompetidorCompetencia;
use App\Models\TutorCompetidor;
use App\Models\Competidor;
use App\Http\Resources\PagoCollection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;
use Illuminate\Http\Request;

class BoletaController extends Controller{
    public function index()
    {
        $boletas = Boleta::with(['tutor'])->get();
        foreach ($boletas as $boleta) {
            $imagen = ImagenBoleta::where('boleta_id', $boleta->boleta_id)
                ->orderBy('fecha_subida', 'desc')
                ->first();
            
            // Asignar la imagen a la boleta
            $boleta->imagen_manual = $imagen;
        }

        // Devolver la colección formateada como JSON
        return new PagoCollection($boletas);
    }

    public function boletasPorTutor($id){
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

     public function procesarBoletaOCR(Request $request)
    {
        try {
            // Validar los datos de entrada
            $request->validate([
                'fechaPago' => 'required|string',
                'imageUrl' => 'required|url',
                'montoPagado' => 'required|numeric',
                'nombreCompleto' => 'required|string',
                'numeroComprobante' => 'required|string',
            ]);

            // Iniciar transacción para asegurar la integridad de los datos
            DB::beginTransaction();

            // 1. Buscar al tutor por nombre completo
            $nombreCompleto = trim($request->nombreCompleto);
            
            // Intentar diferentes estrategias para encontrar al tutor
            $tutor = $this->buscarTutor($nombreCompleto);

            // Si no se encuentra el tutor, devolver error
            if (!$tutor) {
                DB::rollBack();
                return response()->json([
                    'success' => false,
                    'message' => 'No se encontró un tutor con el nombre proporcionado: ' . $nombreCompleto,
                    'data' => null
                ], 404);
            }

            // 2. Verificar si ya existe una boleta con el mismo número
            $boletaExistente = Boleta::where('numero_boleta', $request->numeroComprobante)->first();
            if ($boletaExistente) {
                DB::rollBack();
                return response()->json([
                    'success' => false,
                    'message' => 'Ya existe una boleta registrada con el número: ' . $request->numeroComprobante,
                    'data' => null
                ], 409);
            }

            // 3. Crear la boleta
            $fechaPago = Carbon::createFromFormat('d-m-Y', $request->fechaPago);
            
            $boleta = new Boleta();
            $boleta->tutor_id = $tutor->tutor_id;
            $boleta->numero_boleta = $request->numeroComprobante;
            $boleta->nombre_pagador = $request->nombreCompleto;
            $boleta->monto_total = $request->montoPagado;
            $boleta->fecha_pago = $fechaPago;
            $boleta->estado = true;
            $boleta->save();

            // 4. Guardar la imagen de la boleta
            $imagenBoleta = new ImagenBoleta();
            $imagenBoleta->boleta_id = $boleta->boleta_id;
            $imagenBoleta->ruta_imagen = $request->imageUrl;
            $imagenBoleta->fecha_subida = now();
            $imagenBoleta->estado = true;
            $imagenBoleta->save();

            // 5. Obtener los competidores relacionados con el tutor
            $competidoresIds = TutorCompetidor::where('tutor_id', $tutor->tutor_id)
                ->pluck('competidor_id')
                ->toArray();

            if (empty($competidoresIds)) {
                Log::warning("El tutor ID {$tutor->tutor_id} no tiene competidores asociados");
            } else {
                // 6. Actualizar la boleta_id en los registros de competidor_competencia
                $competidoresActualizados = CompetidorCompetencia::whereIn('competidor_id', $competidoresIds)
                    ->whereNull('boleta_id') // Solo actualizar los que no tienen boleta asignada
                    ->update(['boleta_id' => $boleta->boleta_id]);
                
                if ($competidoresActualizados == 0) {
                    Log::info("No se encontraron inscripciones pendientes de pago para los competidores del tutor");
                }
            }

            // Confirmar la transacción
            DB::commit();

            // Obtener información de los competidores actualizados para la respuesta
            $competidoresInfo = [];
            if (!empty($competidoresIds)) {
                $competidores = Competidor::whereIn('competidor_id', $competidoresIds)->get();
                foreach ($competidores as $competidor) {
                    $inscripciones = CompetidorCompetencia::where('competidor_id', $competidor->competidor_id)
                        ->where('boleta_id', $boleta->boleta_id)
                        ->count();
                    
                    $competidoresInfo[] = [
                        'id' => $competidor->competidor_id,
                        'nombre' => $competidor->nombres . ' ' . $competidor->apellidos,
                        'ci' => $competidor->ci,
                        'inscripciones_actualizadas' => $inscripciones
                    ];
                }
            }

            return response()->json([
                'success' => true,
                'message' => 'Boleta procesada correctamente',
                'data' => [
                    'boleta' => [
                        'id' => $boleta->boleta_id,
                        'numero' => $boleta->numero_boleta,
                        'monto' => $boleta->monto_total,
                        'fecha_pago' => $boleta->fecha_pago->format('d-m-Y')
                    ],
                    'tutor' => [
                        'id' => $tutor->tutor_id,
                        'nombre' => $tutor->nombres . ' ' . $tutor->apellidos,
                        'ci' => $tutor->ci
                    ],
                    'competidores' => $competidoresInfo,
                    'imagen' => [
                        'id' => $imagenBoleta->imagen_id,
                        'url' => $imagenBoleta->ruta_imagen
                    ]
                ]
            ], 200);

        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Error de validación',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error al procesar boleta OCR: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al procesar la boleta',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Busca un tutor utilizando diferentes estrategias basadas en el nombre completo
     * Adaptado para el formato "Nombre Apellido1 Apellido2"
     *
     * @param string $nombreCompleto
     * @return Tutor|null
     */
    private function buscarTutor($nombreCompleto)
    {
        // Estrategia 1: Buscar por nombre completo exacto (concatenando nombres y apellidos)
        $tutor = Tutor::whereRaw("CONCAT(nombres, ' ', apellidos) = ?", [$nombreCompleto])
            ->where('estado', true)
            ->first();

        if ($tutor) {
            Log::info("Tutor encontrado por coincidencia exacta: {$nombreCompleto}");
            return $tutor;
        }

        // Estrategia 2: Dividir el nombre según el formato "Nombre Apellido1 Apellido2"
        $partes = explode(' ', $nombreCompleto);
        
        if (count($partes) >= 2) {
            // El primer elemento es el nombre, el resto son apellidos
            $nombre = $partes[0];
            $apellidos = implode(' ', array_slice($partes, 1));
            
            $tutor = Tutor::where('nombres', $nombre)
                ->where('apellidos', $apellidos)
                ->where('estado', true)
                ->first();
                
            if ($tutor) {
                Log::info("Tutor encontrado por nombre '{$nombre}' y apellidos '{$apellidos}'");
                return $tutor;
            }
            
            // Estrategia 3: Buscar con LIKE para manejar posibles variaciones
            $tutor = Tutor::where('nombres', 'LIKE', "{$nombre}%")
                ->where('apellidos', 'LIKE', "{$apellidos}%")
                ->where('estado', true)
                ->first();
                
            if ($tutor) {
                Log::info("Tutor encontrado por coincidencia parcial: nombre '{$nombre}%' y apellidos '{$apellidos}%'");
                return $tutor;
            }
            
            // Estrategia 4: Buscar con LIKE en ambas direcciones (más flexible)
            $tutor = Tutor::where(function($query) use ($nombre, $apellidos) {
                    $query->where('nombres', 'LIKE', "%{$nombre}%")
                          ->where('apellidos', 'LIKE', "%{$apellidos}%");
                })
                ->where('estado', true)
                ->first();
                
            if ($tutor) {
                Log::info("Tutor encontrado por coincidencia flexible: nombre '%{$nombre}%' y apellidos '%{$apellidos}%'");
                return $tutor;
            }
        }
        
        // Estrategia 5: Buscar por CI si el nombre parece un número de documento
        if (preg_match('/^\d+$/', $nombreCompleto)) {
            $tutor = Tutor::where('ci', $nombreCompleto)
                ->where('estado', true)
                ->first();
                
            if ($tutor) {
                Log::info("Tutor encontrado por CI: {$nombreCompleto}");
                return $tutor;
            }
        }
        
        // Estrategia 6: Última opción - buscar cualquier coincidencia parcial en nombres o apellidos
        $tutor = Tutor::where(function($query) use ($nombreCompleto) {
                $query->where('nombres', 'LIKE', "%{$nombreCompleto}%")
                      ->orWhere('apellidos', 'LIKE', "%{$nombreCompleto}%")
                      ->orWhere('ci', 'LIKE', "%{$nombreCompleto}%");
            })
            ->where('estado', true)
            ->first();
            
        if ($tutor) {
            Log::info("Tutor encontrado por coincidencia general: '%{$nombreCompleto}%'");
        } else {
            Log::warning("No se encontró ningún tutor para: {$nombreCompleto}");
        }
        
        return $tutor;
    }
}
