/* export async function extractDataFromImage(file) {
    return new Promise((resolve, reject) => {
      try {
        // Crear una URL para la imagen
        const imageUrl = URL.createObjectURL(file)

        const img = new Image()
  
        img.onload = () => {
          // Verificar dimensiones mínimas
          if (img.width < 200 || img.height < 200) {
            URL.revokeObjectURL(imageUrl)
            reject(new Error("La imagen es demasiado pequeña. Se requiere un mínimo de 200x200 píxeles."))
            return
          }
  
          // Aquí simularíamos la extracción de datos de la imagen usar el ocr
          let documentType = "desconocido"
  
          // Simular datos extraídos basados en el tipo de documento
          const extractedData = {
            documentType,
            numeroComprobante: "0000" + Math.floor(1000 + Math.random() * 9000),
            nombreCompleto: "ERIKA MAITE SARABIA MALDONADO",
            montoPagado: Math.floor(100 + Math.random() * 900).toString(),
            fechaPago: new Date().toLocaleDateString("es-ES"),
            dimensiones: `${img.width}x${img.height}`,
            tamaño: (file.size / 1024).toFixed(2) + " KB",
            confianza: Math.floor(85 + Math.random() * 15) + "%",
          }
  
          URL.revokeObjectURL(imageUrl)
  
          // Simular un tiempo de procesamiento realista
          setTimeout(() => {
            resolve({
              data: extractedData,
              previewUrl: URL.createObjectURL(file),
            })
          }, 2000)
        }
  
        img.onerror = () => {
          URL.revokeObjectURL(imageUrl)
          reject(new Error("No se pudo cargar la imagen para procesarla. Verifique que el archivo no esté corrupto."))
        }

        img.src = imageUrl
      } catch (error) {
        reject(new Error("Error al procesar la imagen: " + error.message))
      }
    })
  } */
import axios from "axios";
   const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api', // Reemplaza con tu URL
  timeout: 90000, // 30 segundos timeout
});
export async function extractDataFromImage(file) {
  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await api.post('/processReceipt', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      // Opcional: barra de progreso
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        /* console.log(`Progreso: ${percentCompleted}%`); */
      }
    });
    // Mapeo de datos (ajusta según tu API)
    return {
      data: {
        numeroComprobante: response.data.numero_comprobante || "No detectado",
        nombreCompleto: response.data.nombre_pagador || "No detectado",
        montoPagado: response.data.monto_total || "0.00",
        confianza: response.data.confianza || "0%-NP",
        fechaPago: response.data.fecha_pago || "No detectada",
      },
      previewUrl: URL.createObjectURL(file)
    };

  } catch (error) {
    console.error('Error en extractDataFromImage:', error);
    throw new Error(
      error.response?.data?.error || 
      error.message || 
      "Error al procesar la imagen"
    );
  }
}
  
  // Función para validar una imagen antes de procesarla
  export function validateImage(file) {
    if (!file.type.startsWith("image/")) {
      return {
        valid: false,
        error: "El archivo no es una imagen válida.",
      }
    }
  
    // Verificar tamaño máximo (10MB)
    const maxSizeMB = 10
    const fileSizeMB = file.size / (1024 * 1024)
    if (fileSizeMB > maxSizeMB) {
      return {
        valid: false,
        error: `La imagen es demasiado grande. El tamaño máximo es ${maxSizeMB}MB.`,
      }
    }
  
    // Verificar formatos permitidos
    const allowedFormats = ["image/jpeg", "image/png", "image/gif", "image/webp"]
    if (!allowedFormats.includes(file.type)) {
      return {
        valid: false,
        error: "Formato no soportado. Por favor, use JPG, PNG, GIF o WebP.",
      }
    }
  
    return { valid: true }
  }
  