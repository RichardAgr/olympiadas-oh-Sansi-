export const generarBoleta = (data) => {
    console.log("Datos recibidos para generar boleta:", {
      competidores: data.competidores.length,
      tutores: data.tutores.length,
      relaciones: data.relaciones.length,
    })
  
/*     console.log("Muestra de competidor:", data.competidores[0])
    console.log("Muestra de tutor:", data.tutores[0])
    console.log("Muestra de relación:", data.relaciones[0]) */
  
    // Obtener el tutor principal 
    const tutorPrincipalRelacion = data.relaciones.find((r) => {
      return r.responsable_pago === "Sí" || r["Responsable de Pago"] === "Sí"
    })
  
    if (!tutorPrincipalRelacion) {
      throw new Error(
        "No se encontró un tutor responsable de pago. Asegúrate de marcar al menos un tutor como responsable de pago.",
      )
    }
  
    const ciTutor = tutorPrincipalRelacion.ci_tutor || tutorPrincipalRelacion["CI Tutor (*)"]
  
    const tutorPrincipal = data.tutores.find((t) => {
      const ci = t.ci || t.CI || t["CI (*)"]
      return ci === ciTutor
    })
  
    if (!tutorPrincipal) {
      throw new Error("No se encontró el tutor responsable de pago")
    }
  
    // Calcular el monto total
    const totalInscripciones = calcularTotalInscripciones(data.competidores)
    const montoTotal = totalInscripciones * 15 // 15 Bs por inscripción (Esto a que cambiar)
  
    // Generar número de boleta(A que poner de )
    const numeroBoleta = `${Math.floor(1000000 + Math.random() * 9000000)}`.slice(0, 7)
  
    const nombreTutor = `${tutorPrincipal.nombres || tutorPrincipal["Nombres (*)"]} ${tutorPrincipal.apellidos || tutorPrincipal["Apellidos (*)"]}`
  
    // Crear la boleta
    const boleta = {
      numero: numeroBoleta,
      tutor: nombreTutor,
      fechaEmision: new Date().toLocaleDateString(),
      montoTotal: montoTotal,
      estado: "Pendiente",
      totalCompetidores: data.competidores.length,
      competidores: [],
    }
  
    // Agregar competidores a la boleta
    data.competidores.forEach((competidor) => {
      const nombres = competidor.nombres || competidor.Nombres || competidor["Nombres (*)"] || ""
      const apellidos = competidor.apellidos || competidor.Apellidos || competidor["Apellidos (*)"] || ""
      const area1 = competidor.area1 || competidor["Área 1 (*)"] || ""
      const nivel1 = competidor.nivel1 || competidor["Categoría/Nivel 1 (*)"] || ""
      const area2 = competidor.area2 || competidor["Área 2"] || ""
      const nivel2 = competidor.nivel2 || competidor["Categoría/Nivel 2"] || ""
  
      // Agregar área 1
      boleta.competidores.push({
        nombre: `${nombres} ${apellidos}`.trim(),
        area: area1,
        nivel: nivel1,
        monto: 15,
      })
  
      // Agregar área 2 si existe
      if (area2 && nivel2) {
        boleta.competidores.push({
          nombre: `${nombres} ${apellidos}`.trim(),
          area: area2,
          nivel: nivel2,
          monto: 15,
        })
      }
    })
  
/*     console.log("Boleta generada:", {
      numero: boleta.numero,
      tutor: boleta.tutor,
      totalCompetidores: boleta.totalCompetidores,
      totalInscripciones: boleta.competidores.length,
    }) */
  
    return boleta
  }
  
  function calcularTotalInscripciones(competidores) {
    let total = 0
  
    competidores.forEach((competidor) => {
      total += 1
      if (competidor.area2 || competidor["Área 2"]) {
        total += 1
      }
    })
  
    return total
  }
  