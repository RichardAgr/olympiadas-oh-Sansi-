// Datos de ejemplo de tutores (simulando una base de datos)
const tutores = {
    1: {
      tutor_id: 1,
      ci: "60256853",
      nombres: "Daysi",
      apellidos: "Grageda Gonzales",
      correo_electronico: "daysigrageda@gmail.com",
      telefono: "96558421",
      estado: true,
      fecha_registro: "2024-01-10",
      competidores_asignados: 5,
      areas_asignadas: 2
    },
    2: {
      tutor_id: 2,
      ci: "45789632",
      nombres: "Carlos",
      apellidos: "Mendoza Pérez",
      correo_electronico: "carlosmendoza@gmail.com",
      telefono: "78945612",
      estado: true,
      fecha_registro: "2024-02-05",
      competidores_asignados: 3,
      areas_asignadas: 1
    },
    3: {
      tutor_id: 3,
      ci: "32145698",
      nombres: "María",
      apellidos: "López Sánchez",
      correo_electronico: "marialopez@gmail.com",
      telefono: "65478932",
      estado: false,
      fecha_registro: "2024-03-20",
      competidores_asignados: 7,
      areas_asignadas: 3
    }
  };
  
  export const obtenerTutorPorId = (id) => {
    return new Promise((resolve, reject) => {
      // Simulamos un pequeño retraso como si fuera una petición real
      setTimeout(() => {
        const tutor = tutores[id];
        
        if (tutor) {
          resolve({
            success: true,
            data: { ...tutor } // Devolvemos una copia para evitar mutaciones
          });
        } else {
          reject({
            success: false,
            message: `No se encontró un tutor con el ID ${id}`
          });
        }
      }, 150); // Retraso simulado de 150ms
    });
  };
  
  // Versión con async/await para usar en componentes
  export const getTutorById = async (id) => {
    try {
      const response = await obtenerTutorPorId(id);
      return response.data;
    } catch (error) {
      console.error("Error al obtener tutor:", error.message);
      throw error;
    }
  };