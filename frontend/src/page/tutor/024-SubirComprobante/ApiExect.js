import axios from 'axios';


export const processReceipt = async (imageFile) => {
  const formData = new FormData();
  formData.append('image', imageFile);

  try {
    const response = await axios.post("http://127.0.0.1:8000/api/processReceipt", formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent) => {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        console.log(`Progreso de subida: ${progress}%`);
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error al procesar el comprobante:', error);
    throw error;
  }
};