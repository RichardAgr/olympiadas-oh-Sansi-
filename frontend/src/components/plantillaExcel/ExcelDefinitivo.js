import ExcelJS from "exceljs"
import axios from "axios"

export const  cargarDatos = async ()=> {
  try {
    console.log("Intentando cargar datos desde la API...")
    // Usamos un timeout para evitar que la petición se quede colgada
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 segundos de timeout

    const response = await axios.get("http://127.0.0.1:8000/api/areasCategoriasGrados", {
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (response.data && response.data.success) {
      return response.data
    } else {
      console.error("Error en la respuesta de la API:", response.data?.message || "Respuesta inválida")
      throw new Error("Error en la respuesta de la API", response.status)
    }
  } catch (error) {
    console.error("Error al cargar datos desde la API:", error.message)
    throw error
  }
}

export async function generateExcelTemplate() {
  try {
    const workbook = new ExcelJS.Workbook()
    const data = await cargarDatos()
    // Metadatos del libro
    workbook.creator = "Sistema Olimpiadas"
    workbook.lastModifiedBy = "Sistema Olimpiadas"
    workbook.created = new Date()
    workbook.modified = new Date()

    // Crear hojas
    const hojaInstrucciones = workbook.addWorksheet("Instrucciones")
    const hojaCompetidores = workbook.addWorksheet("Competidores")
    const hojaTutores = workbook.addWorksheet("Tutores")
    const hojaRelacionCompetidorTutor = workbook.addWorksheet("Relación Competidor-Tutor")


    // Configurar hojas
     configurarHojaInstrucciones(hojaInstrucciones,data.data)
    configurarHojaCompetidores(hojaCompetidores,data.data)
    configurarHojaTutores(hojaTutores)
    configurarHojaRelacionCompetidorTutor(hojaRelacionCompetidorTutor,data.data)

    // Convertir el libro a un buffer
    const buffer = await workbook.xlsx.writeBuffer()

    // Crear Blob y descargar
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    })

    return blob
  } catch (error) {
    console.error("Error al generar la plantilla:", error)
    throw error
  }
}

function transformarDatosParaTabla(data) {
  return data.flatMap(area => {
    return area.categorias.map(categoria => {
      return [
        area.nombre.toUpperCase(), 
        categoria.nombre, 
        categoria.rango_grado      
      ];
    });
  });
}

function configurarHojaInstrucciones(hoja,data) {
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
  const areasCategoriasData = transformarDatosParaTabla(data);
    areasCategoriasData.forEach((rowData, rowIndex) => {
       for (let col = 0; col < 3; col++) {
         const cell = hoja.getCell(row + rowIndex, col + 1);
         cell.value = rowData[col];
         cell.border = {
           top: { style: "thin" },
           left: { style: "thin" },
           bottom: { style: "thin" },
           right: { style: "thin" }
         };
       }
     });

  // Explicación de la estructura de múltiples tutores
  row +=  areasCategoriasData.length + 2;
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
    column.width = 20
    column.width = 30
  })
}

function configurarHojaCompetidores(hoja,data) {
  // Definir encabezados
  const headers = [
    { header: "N°", key: "numero", width: 5 },
    { header: "CI (*)", key: "ci", width: 15 },
    { header: "Nombres (*)", key: "nombres", width: 20 },
    { header: "Apellidos (*)", key: "apellidos", width: 20 },
    { header: "Fecha Nacimiento (*)", key: "fecha_nacimiento", width: 30 },
    { header: "Colegio (*)", key: "colegio", width: 25 },
    { header: "Curso (*)", key: "curso", width: 20 },
    { header: "Departamento (*)", key: "departamento", width: 20 },
    { header: "Provincia (*)", key: "provincia", width: 20 },
    { header: "Área 1 (*)", key: "area1", width: 25 },
    { header: "Categoría/Nivel 1 (*)", key: "nivel1", width: 30 },
    { header: "Área 2", key: "area2", width: 25 },
    { header: "Categoría/Nivel 2", key: "nivel2", width: 30 },
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
  for (let i = 2; i <= 31; i++) {
    hoja.getCell(`H${i}`).dataValidation = {
      type: "list",
      allowBlank: false,
      formulae: [`"${departamentos.join(",")}"`],
      showErrorMessage: true,
      errorStyle: "error",
      errorTitle: "Departamento Inválido",
      error: "Seleccione un departamento de la lista",
    }
  }

  const areas = data.map((item) => item.nombre);
  // Listas desplegables para áreas
  for (let i = 2; i <= 31; i++) {
    hoja.getCell(`J${i}`).dataValidation = {
      type: "list",
      allowBlank: false,
      formulae: [`"${areas.join(",")}"`],
      showErrorMessage: true,
      errorStyle: "error",
      errorTitle: "Área Inválida",
      error: "Seleccione un área de la lista",
    }

    hoja.getCell(`L${i}`).dataValidation = {
      type: "list",
      allowBlank: true,
      formulae: [`"${areas.join(",")}"`],
      showErrorMessage: true,
      errorStyle: "error",
      errorTitle: "Área Inválida",
      error: "Seleccione un área de la lista",
    }
  }

  // Agregar numeración
  for (let i = 2; i <= 31; i++) {
    hoja.getCell(`A${i}`).value = { formula: `=${i - 1}` }
    hoja.getCell(`A${i}`).alignment = { horizontal: "center" }
  }

  // Agregar formato para fechas
  for (let i = 2; i <= 31; i++) {
    hoja.getCell(`E${i}`).numFmt = "dd/mm/yyyy"
  }

  // Agregar instrucciones en la primera fila
  hoja.insertRow(1, [
    "Instrucciones: Complete todos los campos marcados con (*). Puede inscribir hasta 30 competidores.",
  ])
  hoja.mergeCells("A1:M1")
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
    fgColor: { argb: "C6EFCE" },
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

  

  // Agregar numeración
  for (let i = 2; i <= 31; i++) {
    hoja.getCell(`A${i}`).value = { formula: `=${i - 1}` }
    hoja.getCell(`A${i}`).alignment = { horizontal: "center" }
  }

  // Agregar instrucciones en la primera fila
  hoja.insertRow(1, ["Instrucciones: Registre todos los tutores que participarán en la inscripción de competidores."])
  hoja.mergeCells("A1:F1")
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
    fgColor: { argb: "C6EFCE" },
  }

  // Ajustar la altura de la fila
  hoja.getRow(1).height = 25
}

function configurarHojaRelacionCompetidorTutor(hoja,data) {
  // Definir encabezados
  const headers = [
    { header: "ID", key: "id", width: 5 },
    { header: "CI Competidor (*)", key: "ci_competidor", width: 30},
    { header: "CI Tutor (*)", key: "ci_tutor", width: 15 },
    { header: "Nivel Responsabilidad (*)", key: "nivel_responsabilidad", width: 35 },
    { header: "Relación con Competidor (*)", key: "relacion", width: 35 },
    { header: "Responsable de Pago", key: "responsable_pago", width: 35 },
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

  // Validación para nivel de responsabilidad
  for (let i = 2; i <= 31; i++) {
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
  for (let i = 2; i <= 31; i++) {
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
  for (let i = 2; i <= 31; i++) {
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
  const areas = data.map((item) => item.nombre);

  for (let i = 2; i <= 311; i++) {
    hoja.getCell(`G${i}`).dataValidation = {
      type: "list",
      allowBlank: true,
      formulae: [`"${areas.join(",")}"`],
      showErrorMessage: true,
      errorStyle: "error",
      errorTitle: "Área Inválida",
      error: "Seleccione un área de la lista",
    }
  }

  // Agregar numeración
  for (let i = 2; i <= 31; i++) {
    hoja.getCell(`A${i}`).value = { formula: `=${i - 1}` }
    hoja.getCell(`A${i}`).alignment = { horizontal: "center" }
  }

  // Agregar instrucciones en la primera fila
  hoja.insertRow(1, [
    "Instrucciones: Establezca las relaciones entre competidores y tutores. Cada competidor debe tener al menos un tutor principal.",
  ])
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
    fgColor: { argb: "C6EFCE" },
  }

  // Ajustar la altura de la fila de instrucciones
  hoja.getRow(1).height = 25
}