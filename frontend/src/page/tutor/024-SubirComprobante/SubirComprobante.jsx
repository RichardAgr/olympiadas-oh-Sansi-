import { useState } from "react"
import { CheckCircle, AlertCircle, AlertTriangle } from 'lucide-react'
import FileUp from "../../../components/FileUp/FileUp"
import FileViewer from "../../../components/FileViewer/FileViewer"
import "./subirComprobante.css"

export default function App() {
  const [file, setFile] = useState(null)
  const [extractedData, setExtractedData] = useState(null)
  const [filePreviewUrl, setFilePreviewUrl] = useState(null)
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState("")
  const [alertType, setAlertType] = useState("") // success, error, warning
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedFileUrl, setUploadedFileUrl] = useState(null)

  const showAlertMessage = (message, type) => {
    setAlertMessage(message)
    setAlertType(type)
    setShowAlert(true)

    // Ocultar la alerta después de 2 segundos
    setTimeout(() => {
      setShowAlert(false)
    }, 2000)
  }

  const handleFileUpload = (newFile) => {
    if (!newFile) return

    const isValidType = newFile.type.startsWith("image/") || newFile.type === "application/pdf"

    if (isValidType) {
      setFile(newFile)
      showAlertMessage("Archivo subido correctamente", "success")
      simulateDataExtraction(newFile)
    } else {
      showAlertMessage("Formato de archivo no válido. Por favor, sube solo imágenes o PDFs", "error")
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
  }

  const handleSaveData = async () => {
    if (!file) {
      showAlertMessage("No hay archivo para guardar", "warning")
      return
    }

    try {
      setIsUploading(true)

      // Subir el archivo a la nube y obtener la URL
      const uploadedUrl = await uploadFileToCloud(file)

      setUploadedFileUrl(uploadedUrl)
      showAlertMessage("¡Cambios guardados!", "success")

      // Aquí podrías guardar también los datos extraídos junto con la URL
      console.log("Datos guardados:", {
        ...extractedData,
        fileUrl: uploadedUrl,
      })
    } catch (error) {
      console.error("Error al subir el archivo:", error)
      showAlertMessage("Error al guardar el archivo en la nube", "error")
    } finally {
      setIsUploading(false)
    }
  }

  const handleCancel = () => {
    showAlertMessage("Operación cancelada", "warning")
    handleDeleteFile()
  }

  const uploadFileToCloud = async (file) => {
    // Simulamos una carga con un retraso
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Para este ejemplo, simulamos una URL de archivo subido
    return `https://ejemplo.com/archivos/${file.name}?t=${Date.now()}`
  }

  const simulateDataExtraction = (file) => {
    // Simular un tiempo de procesamiento
    setTimeout(() => {
      // Simular un error aleatorio en la extracción (20% de probabilidad)
      const hasError = Math.random() < 0.2

      if (hasError) {
        showAlertMessage("No se pudieron extraer los datos correctamente. Intente con otro archivo.", "error")
        return
      }

      const mockData = {
        numeroComprobante: "0000123",
        nombreCompleto: "ERIKA MAITE SARABIA MALDONADO",
        montoPagado: "180",
        fechaPago: "15/04/2023",
      }

      setExtractedData(mockData)
      // Crear URL para la vista previa del archivo
      const url = URL.createObjectURL(file)
      setFilePreviewUrl(url)
      showAlertMessage("Datos extraídos correctamente", "success")
    }, 1500)
  }

  return (
    <div className="app-container">
      <div className="app-header">
        <div className="app-title">Visualizador de Archivos</div>
        <div className="app-subtitle">Sube una imagen o PDF para visualizarlo y extraer información</div>
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
          <FileUp onFileUpload={handleFileUpload} />
        ) : (
          <FileViewer
            file={file}
            filePreviewUrl={filePreviewUrl}
            extractedData={extractedData}
            uploadedFileUrl={uploadedFileUrl}
            isUploading={isUploading}
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
