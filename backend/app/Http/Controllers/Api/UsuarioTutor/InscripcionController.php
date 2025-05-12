<?php

namespace App\Http\Controllers\Api\UsuarioTutor;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use Illuminate\Support\Facades\DB;

class InscripcionController extends Controller
{
    public function inscripcionGrupal(Request $request)
{
    // Validar el archivo
    $request->validate([
        'archivo' => 'required|mimes:xlsx,xls'
    ]);

    // Iniciar transacción
    DB::beginTransaction();

    try {
        $archivo = $request->file('archivo');
        $spreadsheet = IOFactory::load($archivo->getRealPath());

        // Obtener datos
        $tutores = $this->obtenerDatosTutor($spreadsheet);
        list($competidores, $errores) = $this->obtenerDatosCompetidores($spreadsheet);
        $relacion = $this->obtenerDatosRelacion($spreadsheet);

        // Validar que haya datos mínimos
        if (empty($competidores) || empty($tutores) || empty($relacion)) {
            throw new \Exception("El archivo no contiene los datos mínimos requeridos");
        }

        // Relacionar datos
        $relacion_tutor_competidor = $this->relacionarCompetidoresConTutores($competidores, $tutores, $relacion);

        // Guardar en BD
        $guardadoExitoso = $this->guardarCompetidoresTutores($relacion_tutor_competidor);

        if (!$guardadoExitoso) {
            throw new \Exception("Error al guardar los datos en la base de datos");
        }

        // Confirmar transacción si todo sale bien
        DB::commit();

        return response()->json([
            'success' => empty($errores),
            'total_competidores' => count($competidores),
            'competidores' => $competidores,
            'tutores' => $tutores,
            'relacion' => $relacion,
            'relacion_tutor_competidor' => $relacion_tutor_competidor,
            'message' => empty($errores) 
                ? 'Archivo procesado correctamente' 
                : 'Se procesó el archivo con algunos errores',
            'errores' => $errores
        ]);

    } catch (\Exception $e) {
        // Revertir transacción en caso de error
        DB::rollBack();

        \Log::error('Error en inscripcionGrupal: ' . $e->getMessage(), [
            'exception' => $e,
            'trace' => $e->getTraceAsString(),
            'request' => $request->all()
        ]);

        return response()->json([
            'success' => false,
            'message' => 'Error al procesar el archivo: ' . $e->getMessage(),
            'error_details' => config('app.debug') ? $e->getTraceAsString() : null
        ], 500);
    }
}
private function relacionarCompetidoresConTutores($competidores, $tutores, $relaciones)
{
    // Convertir a collections para mejor manejo
    $competidores = collect($competidores);
    $tutores = collect($tutores);
    $relaciones = collect($relaciones);

    // Primero agrupamos las relaciones por CI de tutor
    $relacionesPorTutor = $relaciones->groupBy('ci_tutor');

    // Construimos la estructura final
    $relacion_tutor_competidor = $tutores->map(function ($tutor) use ($relacionesPorTutor, $competidores) {
        $relacionesDelTutor = $relacionesPorTutor->get($tutor['ci'], collect());
        
        $competidoresRelacionados = $relacionesDelTutor->map(function ($relacion) use ($competidores) {
            $competidor = $competidores->firstWhere('cl', $relacion['ci_competidor']);
            return $competidor ? array_merge($competidor, [
                'nivel_responsabilidad' => $relacion['nivel_responsabilidad'],
                'relacion_competidor' => $relacion['relacion_competidor'],
                'responsable_de_pago' => $relacion['responsable_de_pago'],
                'area_especifica' => $relacion['area_especifica']
            ]) : null;
        })->filter()->values()->toArray();

        return [
            'tutor' => array_merge($tutor, [
                'nivel_responsabilidad' => $relacionesDelTutor->first()['nivel_responsabilidad'] ?? null,
                'relacion_competidor' => $relacionesDelTutor->first()['relacion_competidor'] ?? null,
                'responsable_de_pago' => $relacionesDelTutor->first()['responsable_de_pago'] ?? null,
                'area_especifica' => $relacionesDelTutor->first()['area_especifica'] ?? null,
                'competidores_Relacionados' => $competidoresRelacionados
            ])
        ];
    })->values()->toArray();

    return $relacion_tutor_competidor;
}
private function guardarCompetidoresTutores($relacion_tutor_competidor)
{
    // Iniciamos la transacción
    DB::beginTransaction();

    try {
        foreach ($relacion_tutor_competidor as $entrada) {
            $tutorData = $entrada['tutor'];
            $competidoresRelacionados = $tutorData['competidores_Relacionados'];

            // Guardar el tutor
            $tutor = \App\Models\Tutor::firstOrCreate(
                ['ci' => $tutorData['ci']],
                [
                    'nombres' => $tutorData['nombres'],
                    'apellidos' => $tutorData['apellidos'],
                    'correo_electronico' => $tutorData['correo_electronico'],
                    'telefono' => $tutorData['telefono'],
                    'estado' => '1',
                ]
            );

            foreach ($competidoresRelacionados as $competidorData) {
                // Procesamiento del nivel educativo
                preg_match('/primaria|secundaria/i', $competidorData['curso'], $matches);
                $nombreNivel = isset($matches[0]) ? ucfirst(strtolower($matches[0])) : null;
                
                if ($nombreNivel) {
                    $nivelEducativo = \App\Models\NivelEducativo::firstOrCreate(
                        ['nombre' => $nombreNivel]
                    );
                } else {
                    throw new \Exception("No se pudo determinar el nivel educativo para el curso: ".$competidorData['curso']);
                }

                // Procesamiento en transacción
                $ubicacion = \App\Models\Ubicacion::firstOrCreate(
                    ['departamento' => $competidorData['departamento'], 'provincia' => $competidorData['provincia']]
                );

                $grado = \App\Models\Grado::firstOrCreate(
                    ['nombre' => $competidorData['grado'], 'nivel_educativo' => $nivelEducativo->id],
                    [
                        'abreviatura' => $competidorData['abreviatura'],
                        'orden' => $competidorData['orden'],
                        'estado' => '1'
                    ]
                );

                $curso = \App\Models\Curso::firstOrCreate(
                    ['nombre' => $competidorData['curso'], 'grado' => $grado->id],
                    ['estado' => '1']
                );

                $colegio = \App\Models\Colegio::firstOrCreate(
                    ['nombre' => $competidorData['colegio']],
                    ['telefono' => '', 'ubicacion' => $ubicacion->id]
                );

                $competidor = \App\Models\Competidor::firstOrCreate(
                    ['ci' => $competidorData['ci']],
                    [
                        'nombres' => $competidorData['nombres'],
                        'apellidos' => $competidorData['apellidos'],
                        'fecha_nacimiento' => $competidorData['fecha_nacimiento'],
                        'estado' => 'Pendiente',
                        'colegio' => $colegio->id,
                        'curso' => $curso->id,
                        'ubicacion' => $ubicacion->id
                    ]
                );

                // Verificación de datos para competencias
                $area = \App\Models\Area::where('nombre', $competidorData['area'])->first();
                $nivelCategoria = \App\Models\NivelCategoria::where('nombre', $competidorData['categoria/nivel'])->first();
                $competencia = \App\Models\Competencia::where('nombre', $competidorData['competencia'])->first();

                if (!$area || !$nivelCategoria || !$competencia) {
                    throw new \Exception("Datos incompletos para competidor_competencia: CI:".$competidorData['ci']);
                }

                \App\Models\CompetidorCompetencia::create([
                    'competidor_id' => $competidor->id,
                    'competencia_id' => $competencia->id,
                    'area_id' => $area->id,
                    'nivel_categoria_id' => $nivelCategoria->id,
                    'boleta_id' => null,
                ]);

                // Relación tutor-competidor
                \App\Models\CompetidorTutor::firstOrCreate(
                    [
                        'ci_tutor' => $tutor->ci,
                        'ci_competidor' => $competidor->ci,
                    ],
                    [
                        'nivel_responsabilidad' => $competidorData['nivel_responsabilidad'] ?? null,
                        'relacion_competidor' => $competidorData['relacion_competidor'] ?? null,
                        'responsable_de_pago' => $competidorData['responsable_de_pago'] ?? null,
                        'area_especifica' => $competidorData['area_especifica'] ?? null,
                    ]
                );
            }
        }

        // Si todo sale bien, confirmamos la transacción
        DB::commit();
        return true;

    } catch (\Exception $e) {
        // Si hay algún error, hacemos rollback
        DB::rollBack();
        
        // Registramos el error en los logs
        \Log::error('Error en guardarCompetidoresTutores: '.$e->getMessage(), [
            'exception' => $e,
            'trace' => $e->getTraceAsString()
        ]);
        
        return false;
    }
}

private function obtenerDatosRelacion($spreadsheet)
{
    $worksheet = $spreadsheet->getSheetByName('Relación Competidor-Tutor'); 
    $datos = $worksheet->toArray();

    // Eliminar las dos filas de encabezado (más seguro usar array_slice)
    $datos= array_slice($datos, 2);
    
    $relacion = [];
    $errores = [];

    foreach ($datos as $fila => $datos_relacion) {
        if (empty(array_filter($datos_relacion))) {
            continue;
        }
         // Validar que todos los campos obligatorios estén presentes
        if (empty($datos_relacion[0]) || empty($datos_relacion[1]) || empty($datos_relacion[2]) || 
            empty($datos_relacion[3]) || empty($datos_relacion[4]) || empty($datos_relacion[5])) {
            continue; // Omitir tutor si algún dato obligatorio falta
        }

        $relacion[] = [
             'numero' => $datos_relacion[0] ?? null,
            'ci_competidor' => $datos_relacion[1] ?? null,
            'ci_tutor' => $datos_relacion[2],
            'nivel_responsabilidad' => $datos_relacion[3],
            'relacion_competidor' => $datos_relacion[4],
            'responsable_de_pago' => $datos_relacion[5],
            'area_especifica' => $datos_relacion[6] ?? null,
        ];
    }


    return $relacion;
}
private function obtenerDatosCompetidores($spreadsheet) {
    $worksheet = $spreadsheet->getSheetByName('Competidores');
    $datos = $worksheet->toArray();

    // Eliminar las dos filas de encabezado (más seguro usar array_slice)
    $datos = array_slice($datos, 2);
    
    $competidores = [];
    $errores = [];

    foreach ($datos as $fila => $datosCompetidor) {
        try {
            // Limpiar valores NULL o strings vacíos
            $datosCompetidor = array_map(function($item) {
                return is_null($item) || $item === '' ? null : $item;
            }, $datosCompetidor);

            // Verificar si la fila está realmente vacía (todos los valores son null)
            if (empty(array_filter($datosCompetidor, function($v) { return $v !== null; }))) {
                continue;
            }

            // DEBUG: Ver los datos que se están procesando
            // \Log::debug("Procesando fila ".($fila+3).": ", $datosCompetidor);

            // Validar campos obligatorios (solo los realmente necesarios)
            $camposObligatorios = [
                1 => 'CI',
                2 => 'Nombres', 
                3 => 'Apellidos',
                4 => 'Fecha Nacimiento',
                5 => 'Colegio',
                6 => 'Curso',
                7 => 'Departamento',
                8 => 'Provincia',
                9 => 'Área 1',
                10 => 'Categoría/Nivel 1'
            ];

            $faltantes = [];
            foreach ($camposObligatorios as $index => $campo) {
                if (empty($datosCompetidor[$index])) {
                    $faltantes[] = $campo;
                }
            }

            if (!empty($faltantes)) {
                throw new \Exception("Faltan campos obligatorios: " . implode(', ', $faltantes));
            }

            $competidor = [
                'numero' => $datosCompetidor[0] ?? null,
                'cl' => $datosCompetidor[1],
                'nombres' => $datosCompetidor[2],
                'apellidos' => $datosCompetidor[3],
                'fecha_nacimiento' => $this->formatearFecha($datosCompetidor[4]),
                'colegio' => $datosCompetidor[5],
                'curso' => $datosCompetidor[6],
                'departamento' => $datosCompetidor[7],
                'provincia' => $datosCompetidor[8],
                'area' => $datosCompetidor[9],
                'categoria/nivel' => $datosCompetidor[10],
                'area2' => $datosCompetidor[11] ?? null,
                'categoria/nivel2' => $datosCompetidor[12] ?? null,
            ];

            if (!$this->validarFecha($competidor['fecha_nacimiento'])) {
                throw new \Exception("Formato de fecha inválido");
            }

            $competidores[] = $competidor;

        } catch (\Exception $e) {
            $errores[] = [
                'fila' => $fila + 3, // +3 porque eliminamos 2 filas de encabezado
                'error' => $e->getMessage(),
                'datos' => $datosCompetidor
            ];
        }
    }

    return [$competidores, $errores];
}
private function obtenerDatosTutor($spreadsheet)
{
    $worksheet = $spreadsheet->getSheetByName('Tutores');
    $datosTutor = $worksheet->toArray();

    // Eliminar la fila de encabezados si existe
    array_shift($datosTutor);
    array_shift($datosTutor);

    $tutores = [];

    foreach ($datosTutor as $fila => $datos) {
        if (empty(array_filter($datos))) {
            continue;
        }
         // Validar que todos los campos obligatorios estén presentes
        if (empty($datos[0]) || empty($datos[1]) || empty($datos[2]) || 
            empty($datos[3]) || empty($datos[4]) || empty($datos[5])) {
            continue; // Omitir tutor si algún dato obligatorio falta
        }

        $tutores[] = [
             'numero' => $datos[0] ?? null,
            'ci' => $datos[1] ?? null,
            'nombres' => $datos[2],
            'apellidos' => $datos[3],
            'correo_electronico' => $datos[4],
            'telefono' => $datos[5],
        ];
    }

    return $tutores;
}
private function formatearFecha($fecha)
{
        // Intenta convertir diferentes formatos de fecha
        if (is_numeric($fecha)) {
            // Para fechas en formato Excel
            return \PhpOffice\PhpSpreadsheet\Shared\Date::excelToDateTimeObject($fecha)->format('Y-m-d');
        }
        
        // Intenta parsear el formato dd/mm/YYYY
        $fechaParts = explode('/', $fecha);
        if (count($fechaParts) === 3) {
            return sprintf('%04d-%02d-%02d', $fechaParts[2], $fechaParts[1], $fechaParts[0]);
        }
        
        return $fecha;
}   
private function validarFecha($fecha)
{
        $d = \DateTime::createFromFormat('Y-m-d', $fecha);
        return $d && $d->format('Y-m-d') === $fecha;
}  
}
