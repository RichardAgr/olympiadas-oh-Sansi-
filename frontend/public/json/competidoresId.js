

// Datos de ejemplo para los detalles de los competidores
const competitorDetailsData = {
  // Competidor 1
  1: {
    data: {
      informacion_competidor: {
        id: 1,
        nombres: "Doyro",
        apellidos: "Domino Gropedo",
        ci: "15882477",
        fecha_nacimiento: "30/4/14",
        colegio: "Colegio Cachalcanba",
        curso: "Quinto primario",
        departamento: "Cachalcanba",
        provincia: "Cereodo",
        area: "Quimica",
        estado: "Pendiente",
        ruta_imagen: "https://i.ibb.co/svnPKS1b/boleta1.jpg"
      },
      tutores: [
        {
          id_tutor:1,
          tipo: "Principal",
          nombre: "Doya Gropedo Ganz biez",
          relacion: "Padre/Madre",
          telefono: "76444453",
          correo: "doyslpropedogonzale@gmail.com",
        },
        {
          id_tutor:2,
          tipo: "Secundario",
          nombre: "Prof. María Química",
          relacion: "Profesor",
          telefono: "70000001",
          correo: "maria@colegio.edu",
        },
      ],
    },
  },

  // Competidor 2
  2: {
    data: {
      informacion_competidor: {
        id: 2,
        nombres: "María Fernanda",
        apellidos: "Gómez López",
        ci: "7654321",
        fecha_nacimiento: "15/3/13",
        colegio: "Colegio La Salle",
        curso: "Sexto primario",
        departamento: "La Paz",
        provincia: "Murillo",
        area: "Matemáticas",
        estado: "Habilitado",
        ruta_imagen: "https://i.ibb.co/svnPKS1b/boleta1.jpg"
      },
      tutores: [
        {
          id_tutor:3,
          tipo: "Principal",
          nombre: "Carlos Gómez Pérez",
          relacion: "Padre",
          telefono: "67777777",
          correo: "carlos@mail.com",
        },
      ],
    },
  },

  // Competidor 3
  3: {
    data: {
      informacion_competidor: {
        id: 3,
        nombres: "Luis Alberto",
        apellidos: "Martínez Rojas",
        ci: "9876543",
        fecha_nacimiento: "22/8/12",
        colegio: "Colegio San Calixto",
        curso: "Primero secundaria",
        departamento: "Cochabamba",
        provincia: "Cercado",
        area: "Física",
        estado: "Habilitado",
        ruta_imagen: "https://i.ibb.co/svnPKS1b/boleta1.jpg"
      },
      tutores: [
        {
          id_tutor:4,
          tipo: "Principal",
          nombre: "Ana Rojas Méndez",
          relacion: "Madre",
          telefono: "68888888",
          correo: "ana@mail.com",
        },
        {
          id_tutor:5,
          tipo: "Secundario",
          nombre: "Prof. Juan Física",
          relacion: "Profesor",
          telefono: "70000002",
          correo: "juan@colegio.edu",
        },
      ],
    },
  },

  // Competidor 4
  4: {
    data: {
      informacion_competidor: {
        id: 4,
        nombres: "Ana Patricia",
        apellidos: "Rodríguez Vargas",
        ci: "4567890",
        fecha_nacimiento: "5/11/14",
        colegio: "Colegio Santa Ana",
        curso: "Cuarto primario",
        departamento: "Santa Cruz",
        provincia: "Andrés Ibáñez",
        area: "Biología",
        estado: "Deshabilitado",
        ruta_imagen: "https://i.ibb.co/svnPKS1b/boleta1.jpg"
      },
      tutores: [
        {
          id_tutor:6,
          tipo: "Principal",
          nombre: "Pedro Rodríguez García",
          relacion: "Padre",
          telefono: "69999999",
          correo: "pedro@mail.com",
        },
      ],
    },
  },

  // Competidor 5
  5: {
    data: {
      informacion_competidor: {
        id: 5,
        nombres: "Carlos Eduardo",
        apellidos: "Torres Sánchez",
        ci: "2345678",
        fecha_nacimiento: "18/7/13",
        colegio: "Colegio Don Bosco",
        curso: "Tercero secundaria",
        departamento: "Oruro",
        provincia: "Cercado",
        area: "Informática",
        estado: "Habilitado",
        ruta_imagen: "https://i.ibb.co/svnPKS1b/boleta1.jpg"
      },
      tutores: [
        {
          id_tutor:7,
          tipo: "Principal",
          nombre: "Lucía Sánchez Fernández",
          relacion: "Madre",
          telefono: "61111111",
          correo: "lucia@mail.com",
        },
        {
          id_tutor:8,
          tipo: "Secundario",
          nombre: "Prof. Laura Programación",
          relacion: "Profesor",
          telefono: "70000003",
          correo: "laura@colegio.edu",
        },
      ],
    },
  },

  // Competidor 6
  6: {
    data: {
      informacion_competidor: {
        id: 6,
        nombres: "Sofía Alejandra",
        apellidos: "García Méndez",
        ci: "3456789",
        fecha_nacimiento: "30/1/15",
        colegio: "Colegio Alemán",
        curso: "Segundo primario",
        departamento: "Tarija",
        provincia: "Cercado",
        area: "Robótica",
        estado: "Pendiente",
        ruta_imagen: "https://i.ibb.co/svnPKS1b/boleta1.jpg"
      },
      tutores: [
        {
          id_tutor:9,
          tipo: "Principal",
          nombre: "Roberto García López",
          relacion: "Padre",
          telefono: "62222222",
          correo: "roberto@mail.com",
        },
      ],
    },
  },
}

export const MostrarDatos = async(compId)=> {
  try{
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (competitorDetailsData[compId]) {
          resolve(competitorDetailsData[compId])
        } else {
          resolve({ data: {data: {} } })
        }
      }, 300) // Simulamos un pequeño retraso de red
    })
  } catch (error) {
    console.error(`Error fetching competitor error ${tutorId}:`, error)
    throw error
  }
}
