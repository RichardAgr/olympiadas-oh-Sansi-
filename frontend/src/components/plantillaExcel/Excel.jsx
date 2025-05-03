import { saveAs } from 'file-saver';
import ExcelJS from "exceljs"

export async function generateExcelTemplate() {
  try {
    const workbook = new ExcelJS.Workbook();
    
    // Metadatos del libro
    workbook.creator = "Sistema Olimpiadas";
    workbook.lastModifiedBy = "Sistema Olimpiadas";
    workbook.created = new Date();
    workbook.modified = new Date();

    // Crear hojas
    const hojaInstrucciones = workbook.addWorksheet("Instrucciones")
    const hojaCompetidores = workbook.addWorksheet("Competidores")
    const hojaTutores = workbook.addWorksheet("Tutores")
    const hojaRelacionCompetidorTutor = workbook.addWorksheet("Relación Competidor-Tutor")

    // Crear hojas auxiliares para listas desplegables, luego se van a ocultar
    const hojaAreas = workbook.addWorksheet("Areas")
    const hojaNiveles = workbook.addWorksheet("Niveles")

/*     // Ocultar hojas auxiliares
    hojaAreas.state = "hidden"
    hojaNiveles.state = "hidden"
 */

    // Configurar hojas
    configurarHojaInstrucciones(hojaInstrucciones)
    llenarHojaAreas(hojaAreas)
    llenarHojaNiveles(hojaNiveles)
    configurarHojaCompetidores(hojaCompetidores)
    configurarHojaTutores(hojaTutores) //------> Por hacer
    configurarHojaRelacionCompetidorTutor(hojaRelacionCompetidorTutor)

    // Agregar ejemplos de datos
    agregarEjemplosCompetidores(hojaCompetidores)
    agregarEjemplosTutores(hojaTutores)
    agregarEjemplosRelacionCompetidorTutor(hojaRelacionCompetidorTutor)
    // Convertir el libro a un buffer
    const buffer = await workbook.xlsx.writeBuffer();

    // Crear Blob y descargar
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    });
    
    saveAs(blob, "Plantilla_Inscripcion.xlsx");
    
    return true;
  } catch (error) {
    console.error("Error al generar la plantilla:", error);
    throw error;
  }
}

 function configurarHojaInstrucciones(hoja) {
  // Título
  hoja.mergeCells("A1:H1")
  const tituloCell = hoja.getCell("A1")
  tituloCell.value = "INSTRUCCIONES PARA LA INSCRIPCIÓN MASIVA DE COMPETIDORES"
  tituloCell.font = {
    name: "Arial",
    size: 16,
    bold: true,
    color: { argb: "000000" },
  }
  tituloCell.alignment = { horizontal: "center", vertical: "middle" }
  hoja.getRow(1).height = 30

  // Instrucciones generales
  hoja.mergeCells("A3:H3")
  hoja.getCell("A3").value = "Instrucciones Generales:"
  hoja.getCell("A3").font = { bold: true, size: 12 }

  const instrucciones = [
    'Complete la información de todos los competidores en la hoja "Competidores".',
    'Complete la información de todos los tutores en la hoja "Tutores".',
    'Establezca las relaciones entre competidores y tutores en la hoja "Relación Competidor-Tutor".',
    "Cada competidor puede inscribirse en máximo dos áreas de competencia.",
    "Cada competidor puede tener múltiples tutores (principal y secundarios).",
    "Verifique que la edad y grado del competidor correspondan con la categoría seleccionada.",
    "Todos los campos marcados con (*) son obligatorios.",
    "El costo de inscripción es de 15 Bs. por competidor por área.",
    "Una vez completado el formulario, guárdelo y súbalo al sistema.",
    "El sistema validará los datos y generará una boleta de pago consolidada.",
  ]

  let row = 4
  instrucciones.forEach((instruccion) => {
    hoja.mergeCells(`A${row}:H${row}`)
    hoja.getCell(`A${row}`).value = `• ${instruccion}`
    row++
  })

  // Información sobre áreas y categorías
  row += 2
  hoja.mergeCells(`A${row}:H${row}`)
  hoja.getCell(`A${row}`).value = "Áreas y Categorías Disponibles:"
  hoja.getCell(`A${row}`).font = { bold: true, size: 12 }
  row++

  // Tabla de áreas y categorías
  const headers = ["Área", "Nivel/Categoría", "Grados Permitidos"]
  headers.forEach((header, index) => {
    const cell = hoja.getCell(row, index + 1)
    cell.value = header
    cell.font = { bold: true }
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "DDDDDD" },
    }
    cell.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    }
  })
  row++

  // Datos de ejemplo para la tabla de áreas y categorías backend123
  const areasCategoriasData = [
    ["ASTRONOMÍA - ASTROFÍSICA", "3P", "3ro Primaria"],
    ["ASTRONOMÍA - ASTROFÍSICA", "4P", "4to Primaria"],
    ["ASTRONOMÍA - ASTROFÍSICA", "5P", "5to Primaria"],
    ["ASTRONOMÍA - ASTROFÍSICA", "6P", "6to Primaria"],
    ["ASTRONOMÍA - ASTROFÍSICA", "1S-6S", "1ro a 6to Secundaria"],
    ["BIOLOGÍA", "2S-6S", "2do a 6to Secundaria"],
    ["FÍSICA", "4S-6S", "4to a 6to Secundaria"],
    ["INFORMÁTICA", "Guacamayo", "5to a 6to Primaria"],
    ["INFORMÁTICA", "Guanaco/Londra/Bufeo", "1ro a 3ro Secundaria"],
    ["INFORMÁTICA", "Jucumari/Puma", "4to a 6to Secundaria"],
    ["MATEMÁTICAS", "Primer a Sexto Nivel", "1ro a 6to Secundaria"],
    ["QUÍMICA", "2S-6S", "2do a 6to Secundaria"],
    ["ROBÓTICA", "Builders P", "5to a 6to Primaria"],
    ["ROBÓTICA", "Builders S", "1ro a 6to Secundaria"],
    ["ROBÓTICA", "Lego P", "5to a 6to Primaria"],
    ["ROBÓTICA", "Lego S", "1ro a 6to Secundaria"],
  ]

  areasCategoriasData.forEach((data) => {
    for (let i = 0; i < 3; i++) {
      const cell = hoja.getCell(row, i + 1)
      cell.value = data[i]
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      }
    }
    row++
  })

  // Explicación de la estructura de múltiples tutores
  row += 2
  hoja.mergeCells(`A${row}:H${row}`)
  hoja.getCell(`A${row}`).value = "Estructura de Múltiples Tutores:"
  hoja.getCell(`A${row}`).font = { bold: true, size: 12 }
  row++

  const explicacionTutores = [
    "La plantilla permite registrar múltiples tutores para cada competidor:",
    '1. En la hoja "Tutores", registre todos los tutores que participarán en la inscripción.',
    '2. En la hoja "Relación Competidor-Tutor", establezca las relaciones entre competidores y tutores.',
    '3. Cada competidor debe tener al menos un tutor con nivel de responsabilidad "Principal".',
    "4. Un mismo tutor puede estar relacionado con múltiples competidores.",
    "5. Un competidor puede tener tutores diferentes para distintas áreas de competencia.",
  ]

  explicacionTutores.forEach((explicacion) => {
    hoja.mergeCells(`A${row}:H${row}`)
    hoja.getCell(`A${row}`).value = explicacion
    row++
  })

  // Notas importantes
  row += 2
  hoja.mergeCells(`A${row}:H${row}`)
  hoja.getCell(`A${row}`).value = "Notas Importantes:"
  hoja.getCell(`A${row}`).font = { bold: true, size: 12 }
  row++

  const notas = [
    "Los competidores no pueden competir en más de una categoría de Robótica.",
    "Verifique que el CI de cada competidor y tutor sea válido y esté vigente.",
    "Asegúrese de que la información de contacto (correo y teléfono) sea correcta.",
    "El sistema validará que cada competidor cumpla con los requisitos de edad y grado para la categoría seleccionada.",
  ]

  notas.forEach((nota) => {
    hoja.mergeCells(`A${row}:H${row}`)
    hoja.getCell(`A${row}`).value = `• ${nota}`
    row++
  })

  hoja.columns.forEach((column) => {
    column.width = 25
  })
}

function llenarHojaAreas(hoja) {
  // Encabezado
  hoja.getCell("A1").value = "ID"
  hoja.getCell("B1").value = "Nombre"
  hoja.getCell("C1").value = "Costo"

  // Datos de áreas backend123
  const areasData = [
    [1, "ASTRONOMÍA - ASTROFÍSICA", 15],
    [2, "BIOLOGÍA", 15],
    [3, "FÍSICA", 15],
    [4, "INFORMÁTICA", 15],
    [5, "MATEMÁTICAS", 15],
    [6, "QUÍMICA", 15],
    [7, "ROBÓTICA", 15],
  ]

  areasData.forEach((area, index) => {
    const row = hoja.getRow(index + 2)
    row.getCell(1).value = area[0]
    row.getCell(2).value = area[1]
    row.getCell(3).value = area[2]
  })
}

function llenarHojaNiveles(hoja) {
  // Encabezado
  hoja.getCell("A1").value = "ID"
  hoja.getCell("B1").value = "Area_ID"
  hoja.getCell("C1").value = "Nombre"
  hoja.getCell("D1").value = "Grados"

  // Datos de niveles/categorías backend123
  const nivelesData = [
    [1, 1, "3P", "3ro Primaria"],
    [2, 1, "4P", "4to Primaria"],
    [3, 1, "5P", "5to Primaria"],
    [4, 1, "6P", "6to Primaria"],
    [5, 1, "1S", "1ro Secundaria"],
    [6, 1, "2S", "2do Secundaria"],
    [7, 1, "3S", "3ro Secundaria"],
    [8, 1, "4S", "4to Secundaria"],
    [9, 1, "5S", "5to Secundaria"],
    [10, 1, "6S", "6to Secundaria"],
    [11, 2, "2S", "2do Secundaria"],
    [12, 2, "3S", "3ro Secundaria"],
    [13, 2, "4S", "4to Secundaria"],
    [14, 2, "5S", "5to Secundaria"],
    [15, 2, "6S", "6to Secundaria"],
    [16, 3, "4S", "4to Secundaria"],
    [17, 3, "5S", "5to Secundaria"],
    [18, 3, "6S", "6to Secundaria"],
    [19, 4, "Guacamayo", "5to a 6to Primaria"],
    [20, 4, "Guanaco", "1ro a 3ro Secundaria"],
    [21, 4, "Londra", "1ro a 3ro Secundaria"],
    [22, 4, "Jucumari", "4to a 6to Secundaria"],
    [23, 4, "Bufeo", "1ro a 3ro Secundaria"],
    [24, 4, "Puma", "4to a 6to Secundaria"],
    [25, 5, "Primer Nivel", "1ro Secundaria"],
    [26, 5, "Segundo Nivel", "2do Secundaria"],
    [27, 5, "Tercer Nivel", "3ro Secundaria"],
    [28, 5, "Cuarto Nivel", "4to Secundaria"],
    [29, 5, "Quinto Nivel", "5to Secundaria"],
    [30, 5, "Sexto Nivel", "6to Secundaria"],
    [31, 6, "2S", "2do Secundaria"],
    [32, 6, "3S", "3ro Secundaria"],
    [33, 6, "4S", "4to Secundaria"],
    [34, 6, "5S", "5to Secundaria"],
    [35, 6, "6S", "6to Secundaria"],
    [36, 7, "Builders P", "5to a 6to Primaria"],
    [37, 7, "Builders S", "1ro a 6to Secundaria"],
    [38, 7, "Lego P", "5to a 6to Primaria"],
    [39, 7, "Lego S", "1ro a 6to Secundaria"],
  ]

  nivelesData.forEach((nivel, index) => {
    const row = hoja.getRow(index + 2)
    row.getCell(1).value = nivel[0]
    row.getCell(2).value = nivel[1]
    row.getCell(3).value = nivel[2]
    row.getCell(4).value = nivel[3]
  })
}


function configurarHojaCompetidores(hoja) {
  // Definir encabezados
  const headers = [
    { header: "N°", key: "numero", width: 5 },
    { header: "CI (*)", key: "ci", width: 15 },
    { header: "Nombres (*)", key: "nombres", width: 20 },
    { header: "Apellidos (*)", key: "apellidos", width: 20 },
    { header: "Fecha Nacimiento (*)", key: "fecha_nacimiento", width: 25 },
    { header: "Colegio (*)", key: "colegio", width: 25 },
    { header: "Curso (*)", key: "curso", width: 20 },
    { header: "Departamento (*)", key: "departamento", width: 20 },
    { header: "Provincia (*)", key: "provincia", width: 20},
    { header: "Área 1 (*)", key: "area1", width: 20 },
    { header: "Categoría/Nivel 1 (*)", key: "nivel1", width: 20 },
    { header: "Área 2", key: "area2", width: 20 },
    { header: "Categoría/Nivel 2", key: "nivel2", width: 20 },
  ]

  hoja.columns = headers

  // Estilo para encabezados
  const headerRow = hoja.getRow(1)
  headerRow.height = 20
  headerRow.eachCell((cell) => {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "4472C4" },
    }
    cell.font = {
      name: "Arial",
      size: 12,
      bold: true,
      color: { argb: "FFFFFF" },
    }
    cell.alignment = { horizontal: "center", vertical: "middle" }
    cell.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    }
  })

  // Agregar validaciones y listas desplegables

  // Validación para CI solo números
  for (let i = 2; i <= 101; i++) {
    hoja.getCell(`B${i}`).dataValidation = {
      type: "textLength",
      operator: "between",
      showErrorMessage: true,
      allowBlank: false,
      formulae: [7],
      errorStyle: "error",
      errorTitle: "CI Inválido",
      error: "El CI debe tener entre 7 dígitos",
    }
  }

  // Validación para fecha de nacimiento 
  for (let i = 2; i <= 101; i++) {
    hoja.getCell(`E${i}`).dataValidation = {
      type: "date",
      operator: "between",
      showErrorMessage: true,
      allowBlank: false,
      formulae: [new Date(2007, 0, 1), new Date(2025, 11, 31)],
      errorStyle: "error",
      errorTitle: "Fecha Inválida",
      error: "La fecha debe estar entre 01/01/2007 y 31/12/2025",
    }
  }

  // Listas desplegables para departamentos
  const departamentos = [
    "Cochabamba",
    "La Paz",
    "Santa Cruz",
    "Chuquisaca",
    "Oruro",
    "Potosí",
    "Tarija",
    "Beni",
    "Pando",
  ]
  for (let i = 2; i <= 101; i++) {
    hoja.getCell(`J${i}`).dataValidation = {
      type: "list",
      allowBlank: false,
      formulae: [`"${departamentos.join(",")}"`],
      showErrorMessage: true,
      errorStyle: "error",
      errorTitle: "Departamento Inválido",
      error: "Seleccione un departamento de la lista",
    }
  }

  // Listas desplegables para áreas
  for (let i = 2; i <= 101; i++) {
    hoja.getCell(`L${i}`).dataValidation = {
      type: "list",
      allowBlank: false,
      formulae: ["=Areas!$B$2:$B$8"],
      showErrorMessage: true,
      errorStyle: "error",
      errorTitle: "Área Inválida",
      error: "Seleccione un área de la lista",
    }

    hoja.getCell(`N${i}`).dataValidation = {
      type: "list",
      allowBlank: true,
      formulae: ["=Areas!$B$2:$B$8"],
      showErrorMessage: true,
      errorStyle: "error",
      errorTitle: "Área Inválida",
      error: "Seleccione un área de la lista",
    }
  }

  // Agregar numeración 
  for (let i = 2; i <= 101; i++) {
    hoja.getCell(`A${i}`).value = { formula: `=${i - 1}` }
    hoja.getCell(`A${i}`).alignment = { horizontal: "center" }
  }

  // Agregar formato para fechas
  for (let i = 2; i <= 101; i++) {
    hoja.getCell(`E${i}`).numFmt = "dd/mm/yyyy"
  }

  // Agregar instrucciones en la primera fila
  hoja.insertRow(1, [
    "Instrucciones: Complete todos los campos marcados con (*). Puede inscribir hasta 100 competidores.",
  ])
  hoja.mergeCells("A1:O1")
  const instrCell = hoja.getCell("A1")
  instrCell.font = {
    name: "Arial",
    size: 12,
    bold: true,
    color: { argb: "000000" },
  }
  instrCell.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFFF00" },
  }

  //altura de la fila de instrucciones
  hoja.getRow(1).height = 25
}

function configurarHojaTutores(hoja) {
  // Definir encabezados
  const headers = [
    { header: "ID Tutor", key: "id_tutor", width: 10 },
    { header: "CI (*)", key: "ci", width: 15 },
    { header: "Nombres (*)", key: "nombres", width: 20 },
    { header: "Apellidos (*)", key: "apellidos", width: 20 },
    { header: "Correo Electrónico (*)", key: "correo", width: 30 },
    { header: "Teléfono (*)", key: "telefono", width: 15 },
  ]

  hoja.columns = headers

  // Estilo para encabezados
  const headerRow = hoja.getRow(1)
  headerRow.height = 20
  headerRow.eachCell((cell) => {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "4472C4" },
    }
    cell.font = {
      name: "Arial",
      size: 12,
      bold: true,
      color: { argb: "FFFFFF" },
    }
    cell.alignment = { horizontal: "center", vertical: "middle" }
    cell.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    }
  })

  // Agregar validaciones

  // Validación para CI solo números
  for (let i = 2; i <= 51; i++) {
    hoja.getCell(`B${i}`).dataValidation = {
      type: "textLength",
      operator: "between",
      showErrorMessage: true,
      allowBlank: false,
      formulae: [7],
      errorStyle: "error",
      errorTitle: "CI Inválido",
      error: "El CI debe tener entre 7 dígitos",
    }
  }

  // Validación para teléfono
  for (let i = 2; i <= 51; i++) {
    hoja.getCell(`F${i}`).dataValidation = {
      type: "textLength",
      operator: "between",
      showErrorMessage: true,
      allowBlank: false,
      formulae: [8],
      errorStyle: "error",
      errorTitle: "Teléfono Inválido",
      error: "El teléfono debe tener entre 8 dígitos",
    }
  }


  // Agregar numeración 
  for (let i = 2; i <= 51; i++) {
    hoja.getCell(`A${i}`).value = { formula: `=${i - 1}` }
    hoja.getCell(`A${i}`).alignment = { horizontal: "center" }
  }

  // Agregar instrucciones en la primera fila
  hoja.insertRow(1, ["Instrucciones: Registre todos los tutores que participarán en la inscripción de competidores."])
  hoja.mergeCells("A1:G1")
  const instrCell = hoja.getCell("A1")
  instrCell.font = {
    name: "Arial",
    size: 12,
    bold: true,
    color: { argb: "000000" },
  }
  instrCell.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFFF00" },
  }

  // Ajustar la altura de la fila 
  hoja.getRow(1).height = 25
}

function configurarHojaRelacionCompetidorTutor(hoja) {
  // Definir encabezados
  const headers = [
    { header: "ID", key: "id", width: 5 },
    { header: "CI Competidor (*)", key: "ci_competidor", width: 15 },
    { header: "CI Tutor (*)", key: "ci_tutor", width: 15 },
    { header: "Nivel Responsabilidad (*)", key: "nivel_responsabilidad", width: 20 },
    { header: "Relación con Competidor (*)", key: "relacion", width: 25 },
    { header: "Responsable de Pago", key: "responsable_pago", width: 18 },
    { header: "Área Específica", key: "area_especifica", width: 20 },
  ]

  hoja.columns = headers

  // Estilo para encabezados
  const headerRow = hoja.getRow(1)
  headerRow.height = 20
  headerRow.eachCell((cell) => {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "4472C4" },
    }
    cell.font = {
      name: "Arial",
      size: 12,
      bold: true,
      color: { argb: "FFFFFF" },
    }
    cell.alignment = { horizontal: "center", vertical: "middle" }
    cell.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    }
  })

  // Agregar validaciones

  // Validación para nivel de responsabilidad
  for (let i = 2; i <= 101; i++) {
    hoja.getCell(`D${i}`).dataValidation = {
      type: "list",
      allowBlank: false,
      formulae: ['"Principal,Secundario"'],
      showErrorMessage: true,
      errorStyle: "error",
      errorTitle: "Nivel Inválido",
      error: "Seleccione un nivel de responsabilidad de la lista",
    }
  }

  // Validación para relación con competidor
  for (let i = 2; i <= 101; i++) {
    hoja.getCell(`E${i}`).dataValidation = {
      type: "list",
      allowBlank: false,
      formulae: ['"Profesor,Padre,Madre"'],
      showErrorMessage: true,
      errorStyle: "error",
      errorTitle: "Relación Inválida",
      error: "Seleccione una relación de la lista",
    }
  }

  // Validación para responsable de pago
  for (let i = 2; i <= 101; i++) {
    hoja.getCell(`F${i}`).dataValidation = {
      type: "list",
      allowBlank: true,
      formulae: ['"Sí,No"'],
      showErrorMessage: true,
      errorStyle: "error",
      errorTitle: "Valor Inválido",
      error: "Seleccione Sí o No",
    }
  }

  // Validación para área específica
  for (let i = 2; i <= 101; i++) {
    hoja.getCell(`G${i}`).dataValidation = {
      type: "list",
      allowBlank: true,
      formulae: ["=Areas!$B$2:$B$8"],
      showErrorMessage: true,
      errorStyle: "error",
      errorTitle: "Área Inválida",
      error: "Seleccione un área de la lista",
    }
  }

  // Agregar numeración 
  for (let i = 2; i <= 101; i++) {
    hoja.getCell(`A${i}`).value = { formula: `=${i - 1}` }
    hoja.getCell(`A${i}`).alignment = { horizontal: "center" }
  }

  // Agregar instrucciones en la primera fila
  hoja.insertRow(1, [
    "Instrucciones: Establezca las relaciones entre competidores y tutores. Cada competidor debe tener al menos un tutor principal.",
  ])
  hoja.mergeCells("A1:H1")
  const instrCell = hoja.getCell("A1")
  instrCell.font = {
    name: "Arial",
    size: 12,
    bold: true,
    color: { argb: "000000" },
  }
  instrCell.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFFF00" },
  }

  // Ajustar la altura de la fila de instrucciones
  hoja.getRow(1).height = 25
}

function agregarEjemplosCompetidores(hoja) {
  // Ejemplos de competidores
  const competidores = [
    {
      ci: "14268363",
      nombres: "FRESIA GRETY",
      apellidos: "TICONA PLATA",
      fecha_nacimiento: new Date(2007, 5, 6), // 06/06/2007
      correo: "fresiaticona.p@gmail.com",
      telefono: "68653473",
      colegio: "UNIDAD EDUCATIVA NUEVA ESPERANZA",
      curso: "Sexto Secundaria",
      departamento: "Cochabamba",
      provincia: "CERCADO",
      area1: "QUÍMICA",
      nivel1: "6S",
      area2: "MATEMÁTICAS",
      nivel2: "Sexto Nivel",
    },
    {
      ci: "15582477",
      nombres: "DAYRA",
      apellidos: "DAMIAN GRAGEDA",
      fecha_nacimiento: new Date(2014, 5, 30), // 30/06/2014
      correo: "dayra.damian@sadosa.edu.bo",
      telefono: "",
      colegio: "SANTO DOMINGO SAVIO A",
      curso: "Quinto primaria",
      departamento: "Cochabamba",
      provincia: "Cercado",
      area1: "ROBÓTICA",
      nivel1: "Lego P",
      area2: "",
      nivel2: "",
    },
    {
      ci: "16789012",
      nombres: "JUAN",
      apellidos: "PÉREZ GÓMEZ",
      fecha_nacimiento: new Date(2010, 2, 15), // 15/03/2010
      correo: "juan.perez@colegio.edu.bo",
      telefono: "70123456",
      colegio: "COLEGIO SAN AGUSTÍN",
      curso: "Segundo Secundaria",
      departamento: "Cochabamba",
      provincia: "Quillacollo",
      area1: "BIOLOGÍA",
      nivel1: "2S",
      area2: "ASTRONOMÍA - ASTROFÍSICA",
      nivel2: "2S",
    },
  ]

  // Agregar los ejemplos a la hoja
  competidores.forEach((competidor, index) => {
    const rowIndex = index + 3 // +3 porque hay 2 filas de encabezado (instrucciones + headers)
    const row = hoja.getRow(rowIndex)

    row.getCell(2).value = competidor.ci
    row.getCell(3).value = competidor.nombres
    row.getCell(4).value = competidor.apellidos
    row.getCell(5).value = competidor.fecha_nacimiento
    row.getCell(6).value = competidor.correo
    row.getCell(7).value = competidor.telefono
    row.getCell(8).value = competidor.colegio
    row.getCell(9).value = competidor.curso
    row.getCell(10).value = competidor.departamento
    row.getCell(11).value = competidor.provincia
    row.getCell(12).value = competidor.area1
    row.getCell(13).value = competidor.nivel1
    row.getCell(14).value = competidor.area2
    row.getCell(15).value = competidor.nivel2
  })
}

function agregarEjemplosTutores(hoja) {
  // Ejemplos de tutores
  const tutores = [
    {
      id: 1,
      ci: "5487632",
      nombres: "JOFRE",
      apellidos: "TICONA PLATA",
      correo: "jofre.ticona@gmail.com",
      telefono: "76543210",
      estado: "Activo",
    },
    {
      id: 2,
      ci: "4567890",
      nombres: "DAYSI",
      apellidos: "GRAGEDA GONZÁLES",
      correo: "daysigragedagonzales@gmail.com",
      telefono: "76464453",
      estado: "Activo",
    },
    {
      id: 3,
      ci: "3456789",
      nombres: "CARLOS",
      apellidos: "MENDOZA LÓPEZ",
      correo: "carlos.mendoza@colegio.edu.bo",
      telefono: "70123456",
      estado: "Activo",
    },
    {
      id: 4,
      ci: "7890123",
      nombres: "MARÍA",
      apellidos: "VARGAS ROJAS",
      correo: "maria.vargas@gmail.com",
      telefono: "71234567",
      estado: "Activo",
    },
  ]

  // Agregar los ejemplos a la hoja
  tutores.forEach((tutor, index) => {
    const rowIndex = index + 3 // +3 porque hay 2 filas de encabezado (instrucciones + headers)
    const row = hoja.getRow(rowIndex)

    row.getCell(1).value = tutor.id
    row.getCell(2).value = tutor.ci
    row.getCell(3).value = tutor.nombres
    row.getCell(4).value = tutor.apellidos
    row.getCell(5).value = tutor.correo
    row.getCell(6).value = tutor.telefono
    row.getCell(7).value = tutor.estado
  })
}

function agregarEjemplosRelacionCompetidorTutor(hoja) {
  // Ejemplos de relaciones competidor-tutor
  const relaciones = [
    {
      id: 1,
      ci_competidor: "14268363", // FRESIA
      ci_tutor: "5487632", // JOFRE
      nivel_responsabilidad: "Principal",
      relacion: "Familiar",
      responsable_pago: "Sí",
      area_especifica: "",
      observaciones: "Tutor principal para todas las áreas",
    },
    {
      id: 2,
      ci_competidor: "14268363", // FRESIA
      ci_tutor: "3456789", // CARLOS
      nivel_responsabilidad: "Secundario",
      relacion: "Profesor",
      responsable_pago: "No",
      area_especifica: "QUÍMICA",
      observaciones: "Profesor de química que apoya en esa área",
    },
    {
      id: 3,
      ci_competidor: "14268363", // FRESIA
      ci_tutor: "7890123", // MARÍA
      nivel_responsabilidad: "Secundario",
      relacion: "Otro",
      responsable_pago: "No",
      area_especifica: "MATEMÁTICAS",
      observaciones: "Profesora de matemáticas que apoya en esa área",
    },
    {
      id: 4,
      ci_competidor: "15582477", // DAYRA
      ci_tutor: "4567890", // DAYSI
      nivel_responsabilidad: "Principal",
      relacion: "Padre/Madre",
      responsable_pago: "Sí",
      area_especifica: "",
      observaciones: "",
    },
    {
      id: 5,
      ci_competidor: "16789012", // JUAN
      ci_tutor: "3456789", // CARLOS
      nivel_responsabilidad: "Principal",
      relacion: "Profesor",
      responsable_pago: "Sí",
      area_especifica: "",
      observaciones: "Tutor principal para todas las áreas",
    },
  ]

  // Agregar los ejemplos a la hoja
  relaciones.forEach((relacion, index) => {
    const rowIndex = index + 3 // +3 porque hay 2 filas de encabezado (instrucciones + headers)
    const row = hoja.getRow(rowIndex)

    row.getCell(1).value = relacion.id
    row.getCell(2).value = relacion.ci_competidor
    row.getCell(3).value = relacion.ci_tutor
    row.getCell(4).value = relacion.nivel_responsabilidad
    row.getCell(5).value = relacion.relacion
    row.getCell(6).value = relacion.responsable_pago
    row.getCell(7).value = relacion.area_especifica
    row.getCell(8).value = relacion.observaciones
  })
}
