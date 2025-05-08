export const validarDatosExcel = (data) => {
    const errores = []
  
    // Validar que haya competidores
    if (!data.competidores || data.competidores.length === 0) {
      errores.push("No se encontraron competidores en el archivo Excel.")
      return { esValido: false, errores }
    }
  
    // Validar que haya tutores
    if (!data.tutores || data.tutores.length === 0) {
      errores.push("No se encontraron tutores en el archivo Excel.")
      return { esValido: false, errores }
    }
  
    // Validar que haya relaciones entre competidores y tutores
    if (!data.relaciones || data.relaciones.length === 0) {
      errores.push("No se encontraron relaciones entre competidores y tutores en el archivo Excel.")
      return { esValido: false, errores }
    }
  
    // Validar datos de competidores
    data.competidores.forEach((competidor, index) => {
      // Manejar diferentes nombres de columnas
      const ci = competidor.ci || competidor.CI || competidor["CI (*)"]
      const nombres = competidor.nombres || competidor.Nombres || competidor["Nombres (*)"]
      const apellidos = competidor.apellidos || competidor.Apellidos || competidor["Apellidos (*)"]
      const fechaNacimiento = competidor.fecha_nacimiento || competidor["Fecha Nacimiento (*)"]
      const colegio = competidor.colegio || competidor["Colegio (*)"]
      const curso = competidor.curso || competidor["Curso (*)"]
      const departamento = competidor.departamento || competidor["Departamento (*)"]
      const provincia = competidor.provincia || competidor["Provincia (*)"]
      const area1 = competidor.area1 || competidor["Área 1 (*)"]
      const nivel1 = competidor.nivel1 || competidor["Categoría/Nivel 1 (*)"]
      const area2 = competidor.area2 || competidor["Área 2"]
      const nivel2 = competidor.nivel2 || competidor["Categoría/Nivel 2"]
  
      // Validar campos obligatorios
      if (!ci) {
        errores.push(`Competidor #${index + 1}: Falta el CI.`)
      }
  
      if (!nombres) {
        errores.push(`Competidor #${index + 1}: Faltan los nombres.`)
      }
  
      if (!apellidos) {
        errores.push(`Competidor #${index + 1}: Faltan los apellidos.`)
      }
  
      if (!fechaNacimiento) {
        errores.push(`Competidor #${index + 1}: Falta la fecha de nacimiento.`)
      }
  
      if (!colegio) {
        errores.push(`Competidor #${index + 1}: Falta el colegio.`)
      }
  
      if (!curso) {
        errores.push(`Competidor #${index + 1}: Falta el curso.`)
      }
  
      if (!departamento) {
        errores.push(`Competidor #${index + 1}: Falta el departamento.`)
      }
  
      if (!provincia) {
        errores.push(`Competidor #${index + 1}: Falta la provincia.`)
      }
  
      if (!area1) {
        errores.push(`Competidor #${index + 1}: Falta el área de competencia.`)
      }
  
      if (!nivel1) {
        errores.push(`Competidor #${index + 1}: Falta el nivel/categoría de competencia.`)
      }
  
      // Validar que si hay área2, también haya nivel2
      if (area2 && !nivel2) {
        errores.push(`Competidor #${index + 1}: Falta el nivel/categoría para el área 2.`)
      }
  
      // Validar que no se inscriba en más de una categoría de Robótica
      if (area1 === "ROBÓTICA" && area2 === "ROBÓTICA") {
        errores.push(`Competidor #${index + 1}: No puede inscribirse en más de una categoría de Robótica.`)
      }
  
      // Validar que la fecha de nacimiento
      if (fechaNacimiento) {
        const fechaRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/
        if (!fechaRegex.test(fechaNacimiento)) {
          errores.push(`Competidor #${index + 1}: El formato de fecha de nacimiento debe ser DD/MM/AAAA.`)
        } else {
          const [, dia, mes, anio] = fechaNacimiento.match(fechaRegex)
          const fecha = new Date(anio, mes - 1, dia)
          if (isNaN(fecha.getTime())) {
            errores.push(`Competidor #${index + 1}: La fecha de nacimiento no es válida.`)
          }
        }
      }
  
      // Validar áreas y niveles permitidos backend 123
      const areasPermitidas = [
        "ASTRONOMÍA - ASTROFÍSICA",
        "BIOLOGÍA",
        "FÍSICA",
        "INFORMÁTICA",
        "MATEMÁTICAS",
        "QUÍMICA",
        "ROBÓTICA",
      ]
  
      if (area1 && !areasPermitidas.includes(area1)) {
        errores.push(`Competidor #${index + 1}: El área 1 "${area1}" no es válida.`)
      }
  
      if (area2 && !areasPermitidas.includes(area2)) {
        errores.push(`Competidor #${index + 1}: El área 2 "${area2}" no es válida.`)
      }
    })
  
    // Validar datos de tutores
    data.tutores.forEach((tutor, index) => {
      const ci = tutor.ci || tutor.CI || tutor["CI (*)"]
      const nombres = tutor.nombres || tutor.Nombres || tutor["Nombres (*)"]
      const apellidos = tutor.apellidos || tutor.Apellidos || tutor["Apellidos (*)"]
      const correo = tutor.correo || tutor["Correo Electrónico (*)"]
      const telefono = tutor.telefono || tutor["Teléfono (*)"]
  
      // Validar campos obligatorios
      if (!ci) {
        errores.push(`Tutor #${index + 1}: Falta el CI.`)
      }
  
      if (!nombres) {
        errores.push(`Tutor #${index + 1}: Faltan los nombres.`)
      }
  
      if (!apellidos) {
        errores.push(`Tutor #${index + 1}: Faltan los apellidos.`)
      }
  
      if (!correo) {
        errores.push(`Tutor #${index + 1}: Falta el correo electrónico.`)
      } else {
        // Validar formato de correo electrónico
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(correo)) {
          errores.push(`Tutor #${index + 1}: El formato del correo electrónico no es válido.`)
        }
      }
  
      if (!telefono) {
        errores.push(`Tutor #${index + 1}: Falta el teléfono.`)
      } else if (telefono.length < 7) {
        errores.push(`Tutor #${index + 1}: El número de teléfono debe tener al menos 7 dígitos.`)
      }
    })
  
    // Validar relaciones competidor-tutor
    const competidoresConTutorPrincipal = new Set()
    const competidoresConResponsablePago = new Set()
  
    data.relaciones.forEach((relacion, index) => {
      const ciCompetidor = relacion.ci_competidor || relacion["CI Competidor (*)"]
      const ciTutor = relacion.ci_tutor || relacion["CI Tutor (*)"]
      const nivelResponsabilidad = relacion.nivel_responsabilidad || relacion["Nivel Responsabilidad (*)"]
      const relacionTipo = relacion.relacion || relacion["Relación con Competidor (*)"]
      const responsablePago = relacion.responsable_pago || relacion["Responsable de Pago"]
  
      if (!ciCompetidor) {
        errores.push(`Relación #${index + 1}: Falta el CI del competidor.`)
      }
  
      if (!ciTutor) {
        errores.push(`Relación #${index + 1}: Falta el CI del tutor.`)
      }
  
      if (!nivelResponsabilidad) {
        errores.push(`Relación #${index + 1}: Falta el nivel de responsabilidad.`)
      } else if (nivelResponsabilidad !== "Principal" && nivelResponsabilidad !== "Secundario") {
        errores.push(`Relación #${index + 1}: El nivel de responsabilidad debe ser "Principal" o "Secundario".`)
      }
  
      if (!relacionTipo) {
        errores.push(`Relación #${index + 1}: Falta la relación con el competidor.`)
      }
  
      // Registrar competidores con tutor principal
      if (nivelResponsabilidad === "Principal" && ciCompetidor) {
        competidoresConTutorPrincipal.add(ciCompetidor)
      }
  
      // Registrar competidores con responsable de pago
      if (responsablePago === "Sí" && ciCompetidor) {
        competidoresConResponsablePago.add(ciCompetidor)
      }
  
      // Verificar que el CI del competidor exista en la lista de competidores
      if (ciCompetidor) {
        const competidorExiste = data.competidores.some((c) => {
          const ci = c.ci || c.CI || c["CI (*)"]
          return ci === ciCompetidor
        })
  
        if (!competidorExiste) {
          errores.push(
            `Relación #${index + 1}: El CI del competidor "${ciCompetidor}" no existe en la lista de competidores.`,
          )
        }
      }
  
      // Verificar que el CI del tutor exista en la lista de tutores
      if (ciTutor) {
        const tutorExiste = data.tutores.some((t) => {
          const ci = t.ci || t.CI || t["CI (*)"]
          return ci === ciTutor
        })
  
        if (!tutorExiste) {
          errores.push(`Relación #${index + 1}: El CI del tutor "${ciTutor}" no existe en la lista de tutores.`)
        }
      }
    })
  
    // Verificar que todos los competidores tengan un tutor principal
    data.competidores.forEach((competidor) => {
      const ci = competidor.ci || competidor.CI || competidor["CI (*)"]
      const nombres = competidor.nombres || competidor.Nombres || competidor["Nombres (*)"]
      const apellidos = competidor.apellidos || competidor.Apellidos || competidor["Apellidos (*)"]
  
      if (ci && !competidoresConTutorPrincipal.has(ci)) {
        errores.push(`Competidor ${nombres} ${apellidos} (CI: ${ci}) no tiene un tutor principal asignado.`)
      }
  
      if (ci && !competidoresConResponsablePago.has(ci)) {
        errores.push(`Competidor ${nombres} ${apellidos} (CI: ${ci}) no tiene un responsable de pago asignado.`)
      }
    })
  
    return {
      esValido: errores.length === 0,
      errores,
    }
  }
  