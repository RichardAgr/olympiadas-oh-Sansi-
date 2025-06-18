<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Area;
use App\Models\Colegio;
use App\Models\Competencia;
use App\Models\Competidor;
use App\Models\CompetidorCompetencia;
use App\Models\Curso;
use App\Models\Grado;
use App\Models\NivelCategoria;
use App\Models\Recibo;
use App\Models\ReciboDetalle;
use App\Models\Tutor;
use App\Models\TutorCompetidor;
use App\Models\Ubicacion;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use PhpOffice\PhpSpreadsheet\IOFactory;

class DatosExcel extends Controller{

    public function validarDatosExcelPrevio(Request $request){
        try {
            // Validar la solicitud básica
            $validator = Validator::make($request->all(), [
                'archivo_excel' => 'required|file|mimes:xlsx,xls',
                'numero_recibo' => 'required|string|max:20',
                'competencia_id'=> 'required|integer|exists:competencia,competencia_id'
            ], [
                'archivo_excel.required' => 'Debe seleccionar un archivo Excel',
                'archivo_excel.file' => 'El archivo debe ser un archivo válido',
                'archivo_excel.mimes' => 'El archivo debe ser un archivo Excel (.xlsx, .xls)',
                'numero_recibo.required' => 'El número de recibo es obligatorio',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'esValido' => false,
                    'errores' => $validator->errors()->all()
                ], 422);
            }

            // Obtener excel
            $archivo = $request->file('archivo_excel');
            
            // Cargar el archivo Excel
            $spreadsheet = IOFactory::load($archivo->getPathname());
            
            // Verificar que el archivo tenga las hojas necesarias
            $hojas_requeridas = ['Competidores', 'Tutores', 'Relación Competidor-Tutor'];
            foreach ($hojas_requeridas as $hoja) {
                if (!in_array($hoja, $spreadsheet->getSheetNames())) {
                    return response()->json([
                        'esValido' => false,
                        'errores' => ["El archivo Excel no contiene la hoja: {$hoja}. Asegúrate de usar la plantilla correcta."]
                    ], 422);
                }
            }
            
            // Obtener los datos 
            $competidores = $this->obtenerDatosCompetidores($spreadsheet->getSheetByName('Competidores'));
            $tutores = $this->obtenerDatosTutores($spreadsheet->getSheetByName('Tutores'));
            $relaciones = $this->obtenerDatosRelaciones($spreadsheet->getSheetByName('Relación Competidor-Tutor'));
            
            // Validar los datos extraídos
            $this->validarDatosExtraidos($competidores, $tutores, $relaciones);
            
            // Validar que las áreas y niveles existan en la base de datos
            $this->validarAreasYNiveles($competidores);
            
            // Si llegamos aquí, todo está válido
            return response()->json([
                'esValido' => true,
                'mensaje' => 'El archivo Excel es válido y está listo para ser procesado',
                'resumen' => [
                    'total_competidores' => count($competidores),
                    'total_tutores' => count($tutores),
                    'total_relaciones' => count($relaciones)
                ]
            ], 200);
            
        } catch (\Exception $e) {
            Log::error('Error al validar el archivo Excel: ' . $e->getMessage());
            
            return response()->json([
                'esValido' => false,
                'errores' => [$e->getMessage()]
            ], 422);
        }
    }

    /**
     * NUEVO MÉTODO: Valida que las áreas y niveles existan en la base de datos
     */
    private function validarAreasYNiveles($competidores){
        $errores = [];
        
        foreach ($competidores as $index => $competidor) {
            // Validar área 1
            $area1 = Area::where('nombre', $competidor['area1'])->first();
            if (!$area1) {
                $errores[] = "Competidor #{$index} (CI: {$competidor['ci']}): Área '{$competidor['area1']}' no existe en el sistema";
            } else {
                // Validar nivel 1
                $nivel1 = NivelCategoria::where('nombre', $competidor['nivel1'])
                    ->where('area_id', $area1->area_id)
                    ->first();
                if (!$nivel1) {
                    $errores[] = "Competidor #{$index} (CI: {$competidor['ci']}): Nivel/Categoría '{$competidor['nivel1']}' no existe para el área '{$competidor['area1']}'";
                }
            }
            
            // Validar área 2 (si existe)
            if (!empty($competidor['area2']) && !empty($competidor['nivel2'])) {
                $area2 = Area::where('nombre', $competidor['area2'])->first();
                if (!$area2) {
                    $errores[] = "Competidor #{$index} (CI: {$competidor['ci']}): Área 2 '{$competidor['area2']}' no existe en el sistema";
                } else {
                    // Validar nivel 2
                    $nivel2 = NivelCategoria::where('nombre', $competidor['nivel2'])
                        ->where('area_id', $area2->area_id)
                        ->first();
                    if (!$nivel2) {
                        $errores[] = "Competidor #{$index} (CI: {$competidor['ci']}): Nivel/Categoría 2 '{$competidor['nivel2']}' no existe para el área '{$competidor['area2']}'";
                    }
                }
            }
        }
        
        if (!empty($errores)) {
            throw new \Exception(implode('; ', $errores));
        }
    }

    public function procesarExcel(Request $request){
        try {
            // Validar la solicitud
            $validator = Validator::make($request->all(), [
                'archivo_excel' => 'required|file|mimes:xlsx,xls',
                'numero_recibo' => 'required|string|max:20|exists:recibo,numero_recibo',
                'competencia_id'=> 'required|integer|exists:competencia,competencia_id'
            ], [
                'archivo_excel.required' => 'Debe seleccionar un archivo Excel',
                'archivo_excel.file' => 'El archivo debe ser un archivo válido',
                'archivo_excel.mimes' => 'El archivo debe ser un archivo Excel (.xlsx, .xls)',
                'numero_recibo.required' => 'El número de recibo es obligatorio',
                'numero_recibo.exists' => 'El número de recibo no existe en el sistema',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Error de validación',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Obtener el recibo existente
            $recibo = Recibo::where('numero_recibo', $request->numero_recibo)->first();
            
            // Verificar si el recibo ya tiene detalles asociados
            if (ReciboDetalle::where('recibo_id', $recibo->recibo_id)->exists()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Este recibo ya tiene competidores registrados',
                    'errors' => ['numero_recibo' => ['Este recibo ya ha sido procesado anteriormente']]
                ], 422);
            }

            // Obtener excel
            $archivo = $request->file('archivo_excel');
            
            // Cargar el archivo Excel
            $spreadsheet = IOFactory::load($archivo->getPathname());
            
            // Verificar que el archivo tenga las hojas necesarias
            $hojas_requeridas = ['Competidores', 'Tutores', 'Relación Competidor-Tutor'];
            foreach ($hojas_requeridas as $hoja) {
                if (!in_array($hoja, $spreadsheet->getSheetNames())) {
                    return response()->json([
                        'success' => false,
                        'message' => "El archivo Excel no contiene la hoja: {$hoja}. Asegúrate de usar la plantilla correcta."
                    ], 422);
                }
            }
            
            // Obtener los datos 
            $competidores = $this->obtenerDatosCompetidores($spreadsheet->getSheetByName('Competidores'));
            $tutores = $this->obtenerDatosTutores($spreadsheet->getSheetByName('Tutores'));
            $relaciones = $this->obtenerDatosRelaciones($spreadsheet->getSheetByName('Relación Competidor-Tutor'));
            
            // Validar los datos extraídos
            $this->validarDatosExtraidos($competidores, $tutores, $relaciones);
            
            // Calcular el monto total
            $monto_total = $this->calcularMontoTotal($competidores);
            
            // Iniciar transacción
            DB::beginTransaction();
            
            try {
                $resultado = $this->procesarDatos($competidores, $tutores, $relaciones, $recibo,$request->competencia_id);

                DB::commit();
                
                return response()->json([
                    'success' => true,
                    'message' => 'Datos procesados correctamente',
                    'data' => [
                        'recibo_id' => $recibo->recibo_id,
                        'numero_recibo' => $recibo->numero_recibo,
                        'monto_total' => $recibo->monto_total,
                        'fecha_emision' => $recibo->fecha_emision,
                        'estado' => $recibo->estado,
                        'resultados' => $resultado
                    ]
                ], 200);
            } catch (\Exception $e) {
                // Revertir transacción en caso de error
                DB::rollBack();
                throw $e;
            }
            
        } catch (\Exception $e) {
            Log::error('Error al procesar el archivo Excel: ' . $e->getMessage());
            Log::error($e->getTraceAsString());
            
            return response()->json([
                'success' => false,
                'message' => 'Error al procesar el archivo Excel',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Calcula el monto total basado en los competidores y sus áreas
    */
    private function calcularMontoTotal($competidores){
        $costo_por_area = 15; // 15 Bs. por área
        $total = 0;
        
        foreach ($competidores as $competidor) {
            $total += $costo_por_area;
            
            // Contar área 2 (si existe)
            if (!empty($competidor['area2']) && !empty($competidor['nivel2'])) {
                $total += $costo_por_area;
            }
        }
        
        return $total;
    }
    
    /**
     * Obtiene los datos de los competidores desde la hoja de Excel
     */
    private function obtenerDatosCompetidores($hoja){
        $competidores = [];
        $filas = $hoja->getHighestRow();
        
        // Empezar desde la fila 3 
        for ($i = 3; $i <= $filas; $i++) {
            $ci = $hoja->getCell('B' . $i)->getValue();
            
            if (!empty($ci)) {
                $fecha_nacimiento = $hoja->getCell('E' . $i)->getValue();
                
                // Convertir fecha de nacimiento si es un objeto DateTime
                if ($fecha_nacimiento instanceof \DateTime) {
                    $fecha_nacimiento = $fecha_nacimiento->format('Y-m-d');
                }
                
                $competidor = [
                    'ci' => $ci,
                    'nombres' => $hoja->getCell('C' . $i)->getValue(),
                    'apellidos' => $hoja->getCell('D' . $i)->getValue(),
                    'fecha_nacimiento' => $fecha_nacimiento,
                    'colegio' => $hoja->getCell('F' . $i)->getValue(),
                    'curso' => $hoja->getCell('G' . $i)->getValue(),
                    'departamento' => $hoja->getCell('H' . $i)->getValue(),
                    'provincia' => $hoja->getCell('I' . $i)->getValue(),
                    'area1' => $hoja->getCell('J' . $i)->getValue(),
                    'nivel1' => $hoja->getCell('K' . $i)->getValue(),
                    'area2' => $hoja->getCell('L' . $i)->getValue(),
                    'nivel2' => $hoja->getCell('M' . $i)->getValue(),
                ];
                
                $competidores[] = $competidor;
            }
        }
        
        return $competidores;
    }
    
    /**
     * Obtiene los datos de los tutores desde la hoja de Excel
    */
    private function obtenerDatosTutores($hoja){
        $tutores = [];
        $filas = $hoja->getHighestRow();
        // Empezar desde la fila 3 
        for ($i = 3; $i <= $filas; $i++) {
            $ci = $hoja->getCell('B' . $i)->getValue();
            if (!empty($ci)) {
                $tutores[] = [
                    'ci' => $ci,
                    'nombres' => $hoja->getCell('C' . $i)->getValue(),
                    'apellidos' => $hoja->getCell('D' . $i)->getValue(),
                    'correo_electronico' => $hoja->getCell('E' . $i)->getValue(),
                    'telefono' => $hoja->getCell('F' . $i)->getValue(),
                ];
            }
        }
        
        return $tutores;
    }
    
    /**
     * Obtiene los datos de las relaciones desde la hoja de Excel
     */
    private function obtenerDatosRelaciones($hoja){
        $relaciones = [];
        $filas = $hoja->getHighestRow();
        
        // Empezar desde la fila 3
        for ($i = 3; $i <= $filas; $i++) {
            $ci_competidor = $hoja->getCell('B' . $i)->getValue();
            $ci_tutor = $hoja->getCell('C' . $i)->getValue();
            
            if (!empty($ci_competidor) && !empty($ci_tutor)) {
                $relaciones[] = [
                    'ci_competidor' => $ci_competidor,
                    'ci_tutor' => $ci_tutor,
                    'nivel_responsabilidad' => $hoja->getCell('D' . $i)->getValue() ?: 'Principal',
                    'relacion_competidor' => $hoja->getCell('E' . $i)->getValue(),
                    'responsable_pago' => $hoja->getCell('F' . $i)->getValue() == 'Sí',
                    'area_especifica' => $hoja->getCell('G' . $i)->getValue(),
                ];
            }
        }
        
        return $relaciones;
    }
    
    /**
     * Valida los datos extraídos del Excel
     */
    private function validarDatosExtraidos($competidores, $tutores, $relaciones){
        // Verificar que haya al menos un competidor
        if (empty($competidores)) {
            throw new \Exception('No se encontraron competidores en el archivo Excel');
        }
        
        // Verificar que haya al menos un tutor
        if (empty($tutores)) {
            throw new \Exception('No se encontraron tutores en el archivo Excel');
        }
        
        // Verificar que haya al menos una relación
        if (empty($relaciones)) {
            throw new \Exception('No se encontraron relaciones entre competidores y tutores en el archivo Excel');
        }
        
        // Verificar que cada competidor tenga al menos una relación con un tutor
        $competidores_ci = array_column($competidores, 'ci');
        $relaciones_ci_competidor = array_unique(array_column($relaciones, 'ci_competidor'));
        
        $competidores_sin_tutor = array_diff($competidores_ci, $relaciones_ci_competidor);
        if (!empty($competidores_sin_tutor)) {
            throw new \Exception('Los siguientes competidores no tienen tutor asignado: ' . implode(', ', $competidores_sin_tutor));
        }
        
        // Verificar que cada tutor en las relaciones exista en la lista de tutores
        $tutores_ci = array_column($tutores, 'ci');
        $relaciones_ci_tutor = array_unique(array_column($relaciones, 'ci_tutor'));
        
        $tutores_no_existentes = array_diff($relaciones_ci_tutor, $tutores_ci);
        if (!empty($tutores_no_existentes)) {
            throw new \Exception('Los siguientes tutores en las relaciones no existen en la lista de tutores: ' . implode(', ', $tutores_no_existentes));
        }
        
        // Verificar que cada competidor tenga al menos un tutor principal
        $competidores_con_tutor_principal = [];
        foreach ($relaciones as $relacion) {
            if ($relacion['nivel_responsabilidad'] == 'Principal') {
                $competidores_con_tutor_principal[] = $relacion['ci_competidor'];
            }
        }
        
        $competidores_sin_tutor_principal = array_diff($competidores_ci, array_unique($competidores_con_tutor_principal));
        if (!empty($competidores_sin_tutor_principal)) {
            throw new \Exception('Los siguientes competidores no tienen un tutor principal asignado: ' . implode(', ', $competidores_sin_tutor_principal));
        }
        
        // Verificar que los datos de los competidores estén completos
        foreach ($competidores as $index => $competidor) {
            $errores = [];
            
            if (empty($competidor['ci'])) $errores[] = 'CI';
            if (empty($competidor['nombres'])) $errores[] = 'Nombres';
            if (empty($competidor['apellidos'])) $errores[] = 'Apellidos';
            if (empty($competidor['fecha_nacimiento'])) $errores[] = 'Fecha de nacimiento';
            if (empty($competidor['colegio'])) $errores[] = 'Colegio';
            if (empty($competidor['curso'])) $errores[] = 'Curso';
            if (empty($competidor['departamento'])) $errores[] = 'Departamento';
            if (empty($competidor['provincia'])) $errores[] = 'Provincia';
            if (empty($competidor['area1'])) $errores[] = 'Área 1';
            if (empty($competidor['nivel1'])) $errores[] = 'Nivel/Categoría 1';
            
            if (!empty($errores)) {
                throw new \Exception("El competidor #{$index} (CI: {$competidor['ci']}) tiene los siguientes campos vacíos: " . implode(', ', $errores));
            }
        }
        
        // Verificar que los datos de los tutores estén completos
        foreach ($tutores as $index => $tutor) {
            $errores = [];
            
            if (empty($tutor['ci'])) $errores[] = 'CI';
            if (empty($tutor['nombres'])) $errores[] = 'Nombres';
            if (empty($tutor['apellidos'])) $errores[] = 'Apellidos';
            if (empty($tutor['correo_electronico'])) $errores[] = 'Correo electrónico';
            if (empty($tutor['telefono'])) $errores[] = 'Teléfono';
            
            if (!empty($errores)) {
                throw new \Exception("El tutor #{$index} (CI: {$tutor['ci']}) tiene los siguientes campos vacíos: " . implode(', ', $errores));
            }
        }
    }
    
    /**
     * Procesa los datos y los guarda en la base de datos
     */
    private function procesarDatos($competidores, $tutores, $relaciones, $recibo,$competencia_id){
        $resultado = [
            'competidores_registrados' => 0,
            'tutores_registrados' => 0,
            'relaciones_registradas' => 0,
            'inscripciones_registradas' => 0,
            'recibo_detalles_registrados' => 0,
        ];
        
        // 1. Registrar tutores 
        $tutores_registrados = [];
        foreach ($tutores as $tutor_data) {
            $tutor = Tutor::firstOrCreate(
                ['ci' => $tutor_data['ci']],
                [
                    'nombres' => $tutor_data['nombres'],
                    'apellidos' => $tutor_data['apellidos'],
                    'competencia_id' => $competencia_id,
                    'correo_electronico' => $tutor_data['correo_electronico'],
                    'telefono' => $tutor_data['telefono'],
                    'estado' => true
                ]
            );
            
            $tutores_registrados[$tutor_data['ci']] = $tutor->tutor_id;
            $resultado['tutores_registrados']++;
        }
        
        // Encontrar el tutor principal para el recibo
        $tutor_principal_ci = null;
        foreach ($relaciones as $relacion) {
            if ($relacion['nivel_responsabilidad'] == 'Principal' && $relacion['responsable_pago']) {
                $tutor_principal_ci = $relacion['ci_tutor'];
                break;
            }
        }
        
        // Si no se encontró un tutor responsable de pago, usar el primer tutor principal
        if (!$tutor_principal_ci) {
            foreach ($relaciones as $relacion) {
                if ($relacion['nivel_responsabilidad'] == 'Principal') {
                    $tutor_principal_ci = $relacion['ci_tutor'];
                    break;
                }
            }
        }
        
        // Actualizar el recibo con el tutor principal
        if ($tutor_principal_ci && isset($tutores_registrados[$tutor_principal_ci])) {
            $recibo->tutor_id = $tutores_registrados[$tutor_principal_ci];
            $recibo->save();
        }
        
        // 2. Registrar competidores
        $competidores_registrados = [];
        $competencia_activa = Competencia::where('estado', true)->first();
        
        if (!$competencia_activa) {
            throw new \Exception("No hay competencias activas en el sistema");
        }
        
        foreach ($competidores as $competidor_data) {
            // Buscar o crear ubicación
            $ubicacion = Ubicacion::firstOrCreate(
                [
                    'departamento' => $competidor_data['departamento'],
                    'provincia' => $competidor_data['provincia']
                ]
            );
            
            // Buscar o crear colegio
            $colegio = Colegio::firstOrCreate(
                ['nombre' => $competidor_data['colegio']],
                [
                    'ubicacion_id' => $ubicacion->ubicacion_id,
                    'telefono' =>'',    
                ]
            );
            
            // Determinar el grado basado en el nombre del curso
            $grado = $this->determinarGradoPorCurso($competidor_data['curso']);
            
            // Buscar o crear curso con el grado_id
            $curso = Curso::firstOrCreate(
                ['nombre' => $competidor_data['curso']],
                [
                    'grado_id' => $grado->grado_id,
                    'estado' => true
                ]
            );

            $competidor = Competidor::firstOrCreate(
                ['ci' => $competidor_data['ci']],
                [
                    'colegio_id' => $colegio->colegio_id,
                    'curso_id' => $curso->curso_id,
                    'ubicacion_id' => $ubicacion->ubicacion_id,
                    'nombres' => $competidor_data['nombres'],
                    'apellidos' => $competidor_data['apellidos'],
                    'fecha_nacimiento' => $competidor_data['fecha_nacimiento'],
                    'estado' => 'Pendiente' // Estado "Pendiente" por defecto
                ]
            );
            
            $competidores_registrados[$competidor_data['ci']] = [
                'competidor_id' => $competidor->competidor_id,
                'grado_id' => $grado->grado_id
            ];
            $resultado['competidores_registrados']++;
            
            // Crear detalle de recibo para este competidor
            $recibo_detalle = ReciboDetalle::create([
                'recibo_id' => $recibo->recibo_id,
                'competidor_id' => $competidor->competidor_id,
                'estado' => 'Pendiente'
            ]);
            
            $resultado['recibo_detalles_registrados']++;
            // Área 1 (obligatoria)
            $this->registrarInscripcionCompetencia(
                $competidor,
                $competidor_data['area1'],
                $competidor_data['nivel1'],
                $competencia_activa,
                $recibo,
                $recibo_detalle,
                $grado,
                $resultado
            );
            
            // Área 2 (opcional)
            if (!empty($competidor_data['area2']) && !empty($competidor_data['nivel2'])) {
                $this->registrarInscripcionCompetencia(
                    $competidor,
                    $competidor_data['area2'],
                    $competidor_data['nivel2'],
                    $competencia_activa,
                    $recibo,
                    $recibo_detalle,
                    $grado,
                    $resultado
                );
            }
        }
        
        // 3. Registrar relaciones tutor-competidor
        foreach ($relaciones as $relacion_data) {
            if (isset($competidores_registrados[$relacion_data['ci_competidor']]) && 
                isset($tutores_registrados[$relacion_data['ci_tutor']])) {
                
                TutorCompetidor::firstOrCreate(
                    [
                        'competidor_id' => $competidores_registrados[$relacion_data['ci_competidor']]['competidor_id'],
                        'tutor_id' => $tutores_registrados[$relacion_data['ci_tutor']]
                    ],
                    [
                        'nivel_respansabilidad' => $relacion_data['nivel_responsabilidad'],
                        'realcion_competidor' => $relacion_data['relacion_competidor']
                    ]
                );
                
                $resultado['relaciones_registradas']++;
            }
        }
        
        return $resultado;
    }
    
    /**
     * Determina el grado basado en el nombre del curso
     */
    private function determinarGradoPorCurso($nombre_curso)
    {
        // Normalizar el nombre del curso para facilitar la comparación
        $nombre_curso = strtolower(trim($nombre_curso));
        
        // Patrones para identificar el grado
        $patrones = [
            '1ro primaria' => ['1ro primaria', '1° primaria', 'primero primaria', '1er primaria'],
            '2do primaria' => ['2do primaria', '2° primaria', 'segundo primaria'],
            '3ro primaria' => ['3ro primaria', '3° primaria', 'tercero primaria'],
            '4to primaria' => ['4to primaria', '4° primaria', 'cuarto primaria'],
            '5to primaria' => ['5to primaria', '5° primaria', 'quinto primaria'],
            '6to primaria' => ['6to primaria', '6° primaria', 'sexto primaria'],
            '1ro secundaria' => ['1ro secundaria', '1° secundaria', 'primero secundaria', '1er secundaria'],
            '2do secundaria' => ['2do secundaria', '2° secundaria', 'segundo secundaria'],
            '3ro secundaria' => ['3ro secundaria', '3° secundaria', 'tercero secundaria'],
            '4to secundaria' => ['4to secundaria', '4° secundaria', 'cuarto secundaria'],
            '5to secundaria' => ['5to secundaria', '5° secundaria', 'quinto secundaria'],
            '6to secundaria' => ['6to secundaria', '6° secundaria', 'sexto secundaria'],
        ];
        
        // Buscar coincidencia en los patrones
        $grado_nombre = null;
        foreach ($patrones as $grado => $variantes) {
            foreach ($variantes as $variante) {
                if (strpos($nombre_curso, $variante) !== false) {
                    $grado_nombre = $grado;
                    break 2;
                }
            }
        }
        
        // Si no se encontró coincidencia, intentar extraer el número y nivel
        if (!$grado_nombre) {
            preg_match('/(\d+)/', $nombre_curso, $matches);
            $numero = isset($matches[1]) ? $matches[1] : null;
            
            // Determinar si es primaria o secundaria
            $es_primaria = strpos($nombre_curso, 'primaria') !== false;
            $es_secundaria = strpos($nombre_curso, 'secundaria') !== false;
            
            if ($numero && ($es_primaria || $es_secundaria)) {
                $nivel = $es_primaria ? 'primaria' : 'secundaria';
                
                // Convertir número a ordinal
                switch ($numero) {
                    case '1': $ordinal = '1ro'; break;
                    case '2': $ordinal = '2do'; break;
                    case '3': $ordinal = '3ro'; break;
                    case '4': $ordinal = '4to'; break;
                    case '5': $ordinal = '5to'; break;
                    case '6': $ordinal = '6to'; break;
                    default: $ordinal = $numero . 'to'; break;
                }
                
                $grado_nombre = $ordinal . ' ' . $nivel;
            }
        }
        
        if (!$grado_nombre) {
            if (strpos($nombre_curso, 'primaria') !== false) {
                $grado_nombre = '6to primaria'; // Predeterminado para primaria
            } elseif (strpos($nombre_curso, 'secundaria') !== false) {
                $grado_nombre = '6to secundaria'; // Predeterminado para secundaria
            } else {
                // Si no hay información suficiente, usar un grado predeterminado
                $grado_nombre = '6to secundaria';
            }
        }
        
        // Buscar el grado en la base de datos
        $grado = Grado::where('nombre', 'like', '%' . $grado_nombre . '%')->first();
        
        // Si no se encuentra, buscar por coincidencia parcial
        if (!$grado) {
            // Extraer el número y nivel
            preg_match('/(\d+)[a-z]*\s+(primaria|secundaria)/i', $grado_nombre, $matches);
            
            if (count($matches) >= 3) {
                $numero = $matches[1];
                $nivel = strtolower($matches[2]);
                
                // Buscar por coincidencia parcial
                $grado = Grado::where('nombre', 'like', '%' . $numero . '%')
                    ->where('nombre', 'like', '%' . $nivel . '%')
                    ->first();
            }
        }
        
        // Si aún no se encuentra, obtener un grado predeterminado
        if (!$grado) {
            $nivel_educativo_id = strpos($grado_nombre, 'primaria') !== false ? 1 : 2; // 1 para primaria, 2 para secundaria
            $grado = Grado::where('nivel_educativo_id', $nivel_educativo_id)->first();
            
            // Si aún no hay grado, obtener cualquier grado
            if (!$grado) {
                $grado = Grado::first();
                
                // Si no hay grados en la base de datos, crear uno
                if (!$grado) {
                    throw new \Exception("No se encontraron grados en la base de datos. Por favor, configure los grados antes de procesar el Excel.");
                }
            }
        }
        
        return $grado;
    }
    
    /**
     * Registra la inscripción de un competidor en una competencia
     */
    private function registrarInscripcionCompetencia($competidor, $area_nombre, $nivel_nombre, $competencia, $recibo, $recibo_detalle, $grado, &$resultado){
        // Buscar área
        $area = Area::where('nombre', $area_nombre)->first();
        if (!$area) {
            throw new \Exception("Área no encontrada: {$area_nombre}");
        }
        
        // Buscar nivel/categoría
        $nivel = NivelCategoria::where('nombre', $nivel_nombre)
            ->where('area_id', $area->area_id)
            ->first();
            
        if (!$nivel) {
            throw new \Exception("Nivel/Categoría no encontrado: {$nivel_nombre} para el área {$area_nombre}");
        }
        
        // Verificar que el grado del competidor esté dentro del rango permitido para el nivel/categoría
        if ($nivel->grado_id_inicial && $nivel->grado_id_final) {
            $grado_orden = $grado->orden;
            $grado_inicial = Grado::find($nivel->grado_id_inicial);
            $grado_final = Grado::find($nivel->grado_id_final);
            
            if (!$grado_inicial || !$grado_final) {
                throw new \Exception("No se encontraron los grados inicial o final para el nivel {$nivel_nombre}");
            }
            
            $grado_inicial_orden = $grado_inicial->orden;
            $grado_final_orden = $grado_final->orden;
            
            // Verificar si el grado está dentro del rango
            if ($grado_orden < $grado_inicial_orden || $grado_orden > $grado_final_orden) {
                // Permitir la inscripción pero registrar una advertencia
                Log::warning("El competidor {$competidor->nombres} {$competidor->apellidos} (CI: {$competidor->ci}) está siendo inscrito en el nivel {$nivel_nombre} del área {$area_nombre}, pero su grado ({$grado->nombre}) está fuera del rango permitido ({$grado_inicial->nombre} - {$grado_final->nombre})");
            }
        }
        
        // Registrar inscripción en competidor_competencia
        CompetidorCompetencia::create([
            'competidor_id' => $competidor->competidor_id,
            'competencia_id' => $competencia->competencia_id,
            'area_id' => $area->area_id,
            'nivel_categoria_id' => $nivel->nivel_categoria_id,
            'recibo_detalle_id' => $recibo_detalle->recibo_detalle_id,
            'fecha_inscripcion' => now()
        ]);
        
        $resultado['inscripciones_registradas']++;
    }
}
