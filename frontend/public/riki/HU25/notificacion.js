// URL base para las peticiones API (ajustar según tu backend)
const API_URL = "https://api.ejemplo.com"

// Obtener notificaciones por usuario
export const getNotificacionesByUsuario = async (usuarioId) => {
  try {
    // En un entorno real, esta sería la llamada a la API
    // const response = await axios.get(`${API_URL}/notificaciones/${usuarioId}`);
    // return response.data;

    // Para este ejemplo, usamos los datos mockeados
    return mockGetNotificaciones(usuarioId)
  } catch (error) {
    console.error("Error al obtener notificaciones:", error)
    throw error
  }
}

// Marcar notificación como leída
export const marcarComoLeida = async (notificacionId) => {
  try {
    // En un entorno real, esta sería la llamada a la API
    // const response = await axios.put(`${API_URL}/notificaciones/${notificacionId}/leer`);
    // return response.data;

    // Para este ejemplo, usamos los datos mockeados
    return mockMarcarComoLeida(notificacionId)
  } catch (error) {
    console.error("Error al marcar como leída:", error)
    throw error
  }
}

// Datos mockeados para simular la API
const notificacionesData = {
  1: [
    {
      notificacion_id: 1,
      responsableGestion: {
        responsable_id: 1,
        nombres: "JULIO CESAR",
        apellidos: "COSSIO MONTENEGRO",
      },
      destinatario: {
        tipo: "competidor",
        competidor: {
          competidor_id: 1,
          nombres: "SANTIAGO",
          apellidos: "PEREZ MENDOZA",
        },
      },
      fechaEnvio: "2025-03-12",
      asunto: "Nombre incorrecto en registros",
      mensaje:
        "El nombre del competidor Santiago Perez Mendoza no cumple con los requisitos establecidos en el reglamento.",
      estado: false,
    },
    {
      notificacion_id: 2,
      responsableGestion: {
        responsable_id: 1,
        nombres: "JULIO CESAR",
        apellidos: "COSSIO MONTENEGRO",
      },
      destinatario: {
        tipo: "competidor",
        competidor: {
          competidor_id: 2,
          nombres: "MARIANA",
          apellidos: "GONZALES AGUIRRE",
        },
      },
      fechaEnvio: "2025-03-11",
      asunto: "Correo electrónico inválido",
      mensaje:
        "El correo electrónico tiene un formato válido, pero pertenece a un dominio no permitido para el registro.",
      estado: false,
    },
    {
      notificacion_id: 3,
      responsableGestion: {
        responsable_id: 1,
        nombres: "JULIO CESAR",
        apellidos: "COSSIO MONTENEGRO",
      },
      destinatario: {
        tipo: "competidor",
        competidor: {
          competidor_id: 3,
          nombres: "JUAN CARLOS",
          apellidos: "PEREZ TORREZ",
        },
      },
      fechaEnvio: "2025-03-11",
      asunto: "Correo electrónico inválido",
      mensaje:
        "El correo electrónico tiene un formato válido, pero pertenece a un dominio no permitido para el registro.",
      estado: false,
    },
  ],
  2: [
    {
      "notificacion_id": 4,
      "responsableGestion": {
        "responsable_id": 2,
        "nombres": "MARIA FERNANDA",
        "apellidos": "LOPEZ GARCIA"
      },
      "destinatario": {
        "tipo": "tutor",
        "tutor": {
          "tutor_id": 2,
          "nombres": "SOFIA",
          "apellidos": "PATIÑO MIRANDA"
        }
      },
      "fechaEnvio": "2025-03-15",
      "asunto": "Datos bancarios inválidos",
      "mensaje": "Los datos de pago registrados son incorrectos. Actualícelos para recibir reembolsos.",
      "estado": true
    },
    {
      "notificacion_id": 5,
      "responsableGestion": {
        "responsable_id": 3,
        "nombres": "LUIS MIGUEL",
        "apellidos": "FERNANDEZ CASTRO"
      },
      "destinatario": {
        "tipo": "competidor",
        "competidor": {
          "competidor_id": 3,
          "nombres": "DIEGO ARMANDO",
          "apellidos": "LOPEZ QUISPE"
        }
      },
      "fechaEnvio": "2025-03-16",
      "asunto": "Inscripción cancelada",
      "mensaje": "Su inscripción ha sido cancelada por no cumplir con los requisitos de edad.",
      "estado": false
    },
    {
      "notificacion_id": 6,
      "responsableGestion": {
        "responsable_id": 3,
        "nombres": "LUIS MIGUEL",
        "apellidos": "FERNANDEZ CASTRO"
      },
      "destinatario": {
        "tipo": "tutor",
        "tutor": {
          "tutor_id": 3,
          "nombres": "MARTIN",
          "apellidos": "QUISPE TAPIA"
        }
      },
      "fechaEnvio": "2025-03-17",
      "asunto": "Correo electrónico no válido",
      "mensaje": "El correo electrónico registrado no existe. Por favor, proporcione uno válido.",
      "estado": true
    },
    {
      "notificacion_id": 7,
      "responsableGestion": {
        "responsable_id": 1,
        "nombres": "JULIO CESAR",
        "apellidos": "COSSIO MONTENEGRO"
      },
      "destinatario": {
        "tipo": "competidor",
        "competidor": {
          "competidor_id": 4,
          "nombres": "CAMILA",
          "apellidos": "GUTIERREZ FLORES"
        }
      },
      "fechaEnvio": "2025-03-18",
      "asunto": "Cuenta suspendida",
      "mensaje": "Su cuenta ha sido suspendida por violación de los términos del servicio.",
      "estado": false
    },
    {
      "notificacion_id": 8,
      "responsableGestion": {
        "responsable_id": 2,
        "nombres": "MARIA FERNANDA",
        "apellidos": "LOPEZ GARCIA"
      },
      "destinatario": {
        "tipo": "tutor",
        "tutor": {
          "tutor_id": 4,
          "nombres": "PATRICIA",
          "apellidos": "ARCE VALDIVIA"
        }
      },
      "fechaEnvio": "2025-03-19",
      "asunto": "Información incompleta",
      "mensaje": "Faltan datos obligatorios en el perfil del competidor asociado. Complete la información.",
      "estado": true
    },
    {
      "notificacion_id": 9,
      "responsableGestion": {
        "responsable_id": 3,
        "nombres": "LUIS MIGUEL",
        "apellidos": "FERNANDEZ CASTRO"
      },
      "destinatario": {
        "tipo": "competidor",
        "competidor": {
          "competidor_id": 5,
          "nombres": "JOAQUIN",
          "apellidos": "MAMANI CONDORI"
        }
      },
      "fechaEnvio": "2025-03-20",
      "asunto": "Foto no cumple requisitos",
      "mensaje": "La foto de perfil no cumple con los estándares (debe ser fondo blanco y rostro visible).",
      "estado": false
    }
  ],

  3: [
    {
      "notificacion_id": 10,
      "responsableGestion": {
        "responsable_id": 1,
        "nombres": "JULIO CESAR",
        "apellidos": "COSSIO MONTENEGRO"
      },
      "destinatario": {
        "tipo": "tutor",
        "tutor": {
          "tutor_id": 5,
          "nombres": "ANDREA",
          "apellidos": "SALAZAR MORALES"
        }
      },
      "fechaEnvio": "2025-03-21",
      "asunto": "Documento de identidad vencido",
      "mensaje": "El documento de identidad del tutor ha expirado. Actualícelo lo antes posible.",
      "estado": true
    },
    {
      "notificacion_id": 11,
      "responsableGestion": {
        "responsable_id": 2,
        "nombres": "MARIA FERNANDA",
        "apellidos": "LOPEZ GARCIA"
      },
      "destinatario": {
        "tipo": "competidor",
        "competidor": {
          "competidor_id": 6,
          "nombres": "SANTIAGO",
          "apellidos": "RAMOS PAREDES"
        }
      },
      "fechaEnvio": "2025-03-22",
      "asunto": "Falta de autorización paterna",
      "mensaje": "Se requiere autorización firmada por el tutor para completar su inscripción.",
      "estado": false
    },
    {
      "notificacion_id": 12,
      "responsableGestion": {
        "responsable_id": 3,
        "nombres": "LUIS MIGUEL",
        "apellidos": "FERNANDEZ CASTRO"
      },
      "destinatario": {
        "tipo": "tutor",
        "tutor": {
          "tutor_id": 5,
          "nombres": "ANDREA",
          "apellidos": "SALAZAR MORALES"
        }
      },
      "fechaEnvio": "2025-03-23",
      "asunto": "Verificación de dirección pendiente",
      "mensaje": "No hemos podido verificar la dirección proporcionada. Adjunte comprobante de domicilio.",
      "estado": true
    },
    {
      "notificacion_id": 13,
      "responsableGestion": {
        "responsable_id": 1,
        "nombres": "JULIO CESAR",
        "apellidos": "COSSIO MONTENEGRO"
      },
      "destinatario": {
        "tipo": "competidor",
        "competidor": {
          "competidor_id": 7,
          "nombres": "PAULA",
          "apellidos": "TICONA VARGAS"
        }
      },
      "fechaEnvio": "2025-03-24",
      "asunto": "Formulario de salud incompleto",
      "mensaje": "El formulario de salud del competidor no ha sido completado.",
      "estado": false
    },
    {
      "notificacion_id": 14,
      "responsableGestion": {
        "responsable_id": 2,
        "nombres": "MARIA FERNANDA",
        "apellidos": "LOPEZ GARCIA"
      },
      "destinatario": {
        "tipo": "tutor",
        "tutor": {
          "tutor_id": 5,
          "nombres": "ANDREA",
          "apellidos": "SALAZAR MORALES"
        }
      },
      "fechaEnvio": "2025-03-25",
      "asunto": "Registro de teléfono incompleto",
      "mensaje": "El número telefónico ingresado no es válido. Revise y corrija el dato.",
      "estado": true
    }
  ]
}

// Función mock para simular getNotificaciones
const mockGetNotificaciones = (usuarioId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(notificacionesData)
    }, 500)
  })
}

// Función mock para simular marcarComoLeida
const mockMarcarComoLeida = (notificacionId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true })
    }, 300)
  })
}
