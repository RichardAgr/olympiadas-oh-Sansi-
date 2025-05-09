<?php

namespace App\Http\Controllers\Api\UsuarioTutor;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Spreadsheet;

class InscripcionController extends Controller
{
    public function inscripcionGrupal(Request $request)
{
    $request->validate([
        'archivo' => 'required|mimes:xlsx,xls'
    ]);

    $archivo = $request->file('archivo');
    $spreadsheet = IOFactory::load($archivo->getRealPath());

    // Obtener datos de tutores una sola vez
    $tutores = $this->obtenerDatosTutor($spreadsheet);
    // Obtener datos de competidores
    list($competidores, $errores) = $this->obtenerDatosCompetidores($spreadsheet);

    return response()->json([
        'success' => empty($errores),
        'total_competidores' => count($competidores),
        'competidores' => $competidores,
        'tutores' => $tutores,
        'message' => empty($errores) 
            ? 'Archivo procesado correctamente' 
            : 'Se procesó el archivo con algunos errores'
    ]);
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
