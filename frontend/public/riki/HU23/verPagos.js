// Datos de ejemplo de boletas (simulando una base de datos)
const boletasData = {   
  1: {
    "nombre_completo": "Juan Mendoza Perez",
    "boletas": [
      {
        "boleta_id": 1,
        "area": "Matematicas",
        "numero_comprobante": "00012245",
        "monto": 150,
        "cantidad_competidores": 10,
        "fecha_pago": "12/04/2025",
        "imagen_url": "https://i.ibb.co/svnPKS1b/boleta1.jpg"
      },
      {
        "boleta_id": 2,
        "area": "Física",
        "numero_comprobante": "00512245",
        "monto": 80,
        "cantidad_competidores": 6,
        "fecha_pago": "01/04/2025",
        "imagen_url": "https://i.ibb.co/svnPKS1b/boleta1.jpg"
      }
    ]
  },
  2: {
    "nombre_completo": "Camila Sneider Siles",
    "boletas": [
      {
        "boleta_id": 3,
        "area": "Química",
        "numero_comprobante": "0035486",
        "monto": 150,
        "cantidad_competidores": 10,
        "fecha_pago": "12/04/2025",
        "imagen_url": "https://i.ibb.co/svnPKS1b/boleta1.jpg"
      },
      {
        "boleta_id": 4,
        "area": "Biología",
        "numero_comprobante": "0038556",
        "monto": 150,
        "cantidad_competidores": 10,
        "fecha_pago": "01/04/2025",
        "imagen_url": "https://i.ibb.co/svnPKS1b/boleta1.jpg"
      },
      {
        "boleta_id": 5,
        "area": "Informática",
        "numero_comprobante": "0124595",
        "monto": 75,
        "cantidad_competidores": 5,
        "fecha_pago": "12/04/2025",
        "imagen_url": "https://i.ibb.co/svnPKS1b/boleta1.jpg"
      }
    ]
  }
};

// Función para obtener boletas por ID
export const obtenerBoletasPorId = (id) => {
  return new Promise((resolve, reject) => {
    // Simulamos un pequeño retraso como si fuera una petición real
    setTimeout(() => {
      const boleta = boletasData[id];
      
      if (boleta) {
        resolve({
          success: true,
          data: { 
            ...boleta,
            boletas: [...boleta.boletas] // Copia del array para evitar mutaciones
          }
        });
      } else {
        reject({
          success: false,
          message: `No se encontraron boletas para el ID ${id}`
        });
      }
    }, 150); // Retraso simulado de 150ms
  });
};

// Versión con async/await para usar en componentes
export const getBoletasById = async (id) => {
  try {
    const response = await obtenerBoletasPorId(id);
    return response.data;
  } catch (error) {
    console.error("Error al obtener boletas:", error.message);
    throw error;
  }
};
