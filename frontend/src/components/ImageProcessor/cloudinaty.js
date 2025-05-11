export async function uploadToCloudinary(file, onProgress = () => {}) {
    const uploadPreset = "veltrixImg" // Reemplaza con tu upload preset
    const cloudName = "dq5zw44wg" // Reemplaza con tu cloud name
  
    // Crear FormData para enviar el archivo
    const formData = new FormData()
    formData.append("file", file)
    formData.append("upload_preset", uploadPreset)
  
    try {
      // Crear XMLHttpRequest para poder monitorear el progreso
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const progress = Math.round((event.loaded / event.total) * 100)
            onProgress(progress)
          }
        }

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            const response = JSON.parse(xhr.responseText)
            resolve(response)
          } else {
            reject(new Error("Error al subir la imagen a Cloudinary"))
          }
        }
  
        xhr.onerror = () => {
          reject(new Error("Error de red al subir la imagen"))
        }

        xhr.open("POST", `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, true)
        xhr.send(formData)
      })
    } catch (error) {
      console.error("Error al subir a Cloudinary:", error)
      throw error
    }
  }
  