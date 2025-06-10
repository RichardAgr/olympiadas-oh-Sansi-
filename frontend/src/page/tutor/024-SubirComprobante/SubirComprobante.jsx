import { useState } from "react"
import { CheckCircle, AlertCircle, AlertTriangle } from 'lucide-react'
import FileUp from "../../../components/FileUp/FileUp"
import FileViewer from "../../../components/FileViewer/FileViewer"
import { extractDataFromImage,validateImage } from "../../../components/ImageProcessor/ImageProcessor"
import { uploadToCloudinary } from "../../../components/ImageProcessor/cloudinaty"
import {useParams} from "react-router-dom"
import axios from "axios"
import "./subirComprobante.css"

export default function App() {
  const {id} = useParams()
  const [file, setFile] = useState(null)
  const [extractedData, setExtractedData] = useState(null)
  const [filePreviewUrl, setFilePreviewUrl] = useState(null)
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState("")
  const [alertType, setAlertType] = useState("") // success, error, warning
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedFileUrl, setUploadedFileUrl] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  


  const showAlertMessage = (message, type) => {
    setAlertMessage(message)
    setAlertType(type)
    setShowAlert(true)

    // Ocultar la alerta después de 2 segundos
    setTimeout(() => {
      setShowAlert(false)
    }, 2000)
  }

  const handleFileUpload = async (newFile) => {
    if (!newFile) return

    const validation = validateImage(newFile)
    if (!validation.valid) {
      showAlertMessage(validation.error, "error")
      return
    }

    setFile(newFile)
    showAlertMessage("Imagen cargada. Procesando...", "success")

    setIsProcessing(true)

    try {
      const result = await extractDataFromImage(newFile)
      setExtractedData(result.data)
      setFilePreviewUrl(result.previewUrl)
      showAlertMessage("Datos extraídos correctamente", "success")
    } catch (error) {
      console.error("Error al extraer datos:", error)
      showAlertMessage(error.message, "error")
      // Si hay un error crítico, limpiar el archivo
      if (error.message.includes("demasiado pequeña") || error.message.includes("corrupto")) {
        handleDeleteFile()
      }
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDeleteFile = () => {
    // Liberar URL del objeto si existe
    if (file && filePreviewUrl) {
      URL.revokeObjectURL(filePreviewUrl)
    }
    setFile(null)
    setExtractedData(null)
    setUploadedFileUrl(null)
    setFilePreviewUrl(null)
    setUploadProgress(0)
  }

  const handleSaveData = async () => {
    if (!file) {
      showAlertMessage("No hay archivo para guardar", "warning")
      return
    }

    try {
      setIsUploading(true)
      setUploadProgress(0)
      const cloudinaryResponse = await uploadToCloudinary(file, (progress) => {
        setUploadProgress(progress)
      })
      const uploadedUrl = await cloudinaryResponse.secure_url

      const postData = {
      tutor_id: id,
      fechaPago: extractedData?.fechaPago || "", 
      imageUrl: uploadedUrl,
      montoPagado: extractedData?.montoPagado || "", 
      nombreCompleto: extractedData?.nombreCompleto || "",
      numeroComprobante: extractedData?.numeroComprobante || "",
    };

      console.log(postData)
      
    const response = await axios.post('http://localhost:8000/api/boletas/pagoInscripcion',postData,
      {
         headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          
        },
        
      }
      
    );
    console.log('Respuesta de la API:', response.data);

      setUploadedFileUrl(uploadedUrl)
      showAlertMessage("¡Cambios guardados!", "success")

      setTimeout(() => {
        handleDeleteFile()
      }, 1500)

    } catch (error) {
      console.error("Error al subir la imagen:", error)
      showAlertMessage("Error al guardar la imagen en la nube: " + error.message, "error")
    } finally {
      setIsUploading(false)
    }
  }

  const handleCancel = () => {
    showAlertMessage("Operación cancelada", "warning")
    handleDeleteFile()
  }

  return (
    <div className="app-container">
      <div className="app-header">
        <div className="app-title">Visualizador de Archivos</div>
        <div className="app-subtitle">Sube una imagen para visualizarlo y extraer información</div>
      </div>

      {showAlert && 
          <div className="alert-overlay">
          <div className={`alert alert-${alertType}`}>
            <div className="alert-icon">
              {alertType === "success" && <CheckCircle className="icon-success" />}
              {alertType === "error" && <AlertCircle className="icon-error" />}
              {alertType === "warning" && <AlertTriangle className="icon-warning" />}
            </div>
            <div className="alert-message">{alertMessage}</div>
          </div>
        </div>
      }

      <div className="app-main">
        {!file ? (
          <FileUp onFileUpload={handleFileUpload} isProcessing={isProcessing} />
        ) : (
          <FileViewer
          file={file}
          filePreviewUrl={filePreviewUrl}
          extractedData={extractedData}
          uploadedFileUrl={uploadedFileUrl}
          isUploading={isUploading}
          isProcessing={isProcessing}
          uploadProgress={uploadProgress}
          onDeleteFile={handleDeleteFile}
          onSaveData={handleSaveData}
          onCancel={handleCancel}
          onCopyUrl={(url) => {
            navigator.clipboard.writeText(url)
            showAlertMessage("URL copiada al portapapeles", "success")
          }}
          />
        )}
      </div>
    </div>
  )
}