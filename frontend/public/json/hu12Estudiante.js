const mockStudentsData ={
      1: {
        // tutor_id: 1 (Pedro Aguilar Mendoza)
        data: {
          estudiantes: [
            {
              id: 1,
              nombre: "Mariana Gonzales Aguirre",
              colegio: "La Salle",
              curso: "5to primaria",
              competencia: "Matemáticas",
            },
            {
              id: 2,
              nombre: "Carlos Andres Cespedes Duran",
              colegio: "La Salle",
              curso: "5to primaria",
              competencia: "Matemáticas",
            },
            {
              id: 3,
              nombre: "Emiliano Saavedra Gutierrez",
              colegio: "Santa Ana",
              curso: "3ro secundaria",
              competencia: "Física",
            },
            {
              id: 4,
              nombre: "Emiliano Saavedra Gutierrez",
              colegio: "Santa Ana",
              curso: "3ro secundaria",
              competencia: "Matemáticas",
            },
            {
              id: 5,
              nombre: "Adriana Parejo Suarez",
              colegio: "Don Bosco",
              curso: "4to primaria",
              competencia: "Matemáticas",
            },
            {
              id: 6,
              nombre: "Daniela Andrea Quizada Duran",
              colegio: "Don Bosco",
              curso: "1ro secundaria",
              competencia: "Matemáticas",
            },
          ],
        },
      },
      2: {
        // tutor_id: 2 (Maria Belen Villarroel Perez)
        data: {
          estudiantes: [
            {
              id: 7,
              nombre: "Juan Pablo Mendoza",
              colegio: "San Ignacio",
              curso: "2do primaria",
              competencia: "Matemáticas",
            },
            {
              id: 8,
              nombre: "Lucia Fernandez",
              colegio: "San Ignacio",
              curso: "2do primaria",
              competencia: "Matemáticas",
            },
          ],
        },
      },
      3: {
        // tutor_id: 3 (Gabriel Morales Rodriguez)
        data: {
          estudiantes: [
            {
              id: 9,
              nombre: "Sofia Vargas",
              colegio: "Alemán",
              curso: "6to primaria",
              competencia: "Matemáticas",
            },
          ],
        },
      },
      4: {
        // tutor_id: 4 (Vanessa Iriarte Torrico)
        data: {
          estudiantes: [
            {
              id: 10,
              nombre: "Mateo Rojas",
              colegio: "Don Bosco",
              curso: "3ro secundaria",
              competencia: "Física",
            },
            {
              id: 11,
              nombre: "Valentina Torres",
              colegio: "Don Bosco",
              curso: "3ro secundaria",
              competencia: "Matemáticas",
            },
          ],
        },
      },
  }

  export const fetchStudentsByTutor = async (tutorId) => {
    try {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (mockStudentsData[tutorId]) {
            resolve(mockStudentsData[tutorId])
          } else {
            resolve({ data: { estudiantes: [] } })
          }
        }, 300) // Simulamos un pequeño retraso de red
      })
    } catch (error) {
      console.error(`Error fetching students for tutor ${tutorId}:`, error)
      throw error
    }
  }