import { useState, useRef, useEffect } from "react"
import { Upload, Save, Eye, Trash, FileText, X, CheckCircle, AlertCircle } from 'lucide-react'
import axios from "axios"
import "./pdfUploader.css"

export default function PdfUploader({ idArchivo, title, type }) {
  const [file, setFile] = useState(null)
  const [pdfBlobUrl, setPdfBlobUrl] = useState(null)
  const [isSaved, setIsSaved] = useState(false)
  const [fileName, setFileName] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [notification, setNotification] = useState({ show: false, message: "", type: "" })
  const [cloudinaryData, setCloudinaryData] = useState(null)
  const [existingDocument, setExistingDocument] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const fileInputRef = useRef(null)
  const modalRef = useRef(null)

  useEffect(() => {
    const fetchExistingDocument = async () => {
      try {
        setLoading(true)
        setError(false)
        
        const response = await axios.get(`http://127.0.0.1:8000/api/documentos/${type}/${idArchivo}`)

        if (response.data.success && response.data.data) {
          setExistingDocument(response.data.data)
          // Extraer el nombre del archivo de la URL
          const urlParts = response.data.data.url_pdf.split("/")
          const extractedFileName = urlParts[urlParts.length - 1]
          setFileName(extractedFileName)
          setIsSaved(true)
        }
      } catch (error) {
        console.log("No hay documento existente:", error)
        // No mostramos notificación de error aquí porque es normal que no exista documento
        setError(true)
        setExistingDocument(null)
        setFileName("")
        setIsSaved(false)
      } finally {
        setLoading(false)
      }
    }

    if (idArchivo && type) {
      fetchExistingDocument()
    }
  }, [idArchivo, type])

  const uploadToCloudinary = async (file, onProgress = () => {}) => {
    try {
      const uploadPreset = "veltrixImg" // Tu upload preset
      const cloudName = "dq5zw44wg" // Tu cloud name

      const formData = new FormData()
      formData.append("file", file)
      formData.append("upload_preset", uploadPreset)
      formData.append("resource_type", "auto") // Importante: esto permite a Cloudinary detectar automáticamente el tipo de archivo

      // Usar axios para la subida
      const response = await axios.post(`https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`, formData, {
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100)
            onProgress(progress)
          }
        },
      })

      return response.data
    } catch (error) {
      console.error("Error al subir a Cloudinary:", error)
      throw error
    }
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0]

    if (!selectedFile) return

    if (selectedFile.type !== "application/pdf") {
      showNotification("Solo se permiten archivos PDF", "error")
      return
    }

    if (pdfBlobUrl) {
      URL.revokeObjectURL(pdfBlobUrl)
    }

    const blobUrl = URL.createObjectURL(selectedFile)
    setPdfBlobUrl(blobUrl)
    setFile(selectedFile)
    setFileName(selectedFile.name)
    setIsSaved(false)
    showNotification("PDF subido correctamente", "success")
  }

  const handleSavePdf = async () => {
    if (!file) {
      showNotification("No hay archivo para guardar", "error")
      return
    }

    try {
      showNotification("Subiendo PDF...", "info")

      // Subir a Cloudinary
      const cloudinaryResponse = await uploadToCloudinary(file)
      setCloudinaryData(cloudinaryResponse)

      // Mostrar datos que se enviarán al backend
      const payload = {
        id: idArchivo,
        type: type,
        secure_url: cloudinaryResponse.secure_url,
        uploadedAt: new Date().toISOString().split("T")[0],
      }

      console.log("Datos a enviar al backend:", payload)
      const res = await axios.post("http://127.0.0.1:8000/api/documentos", payload)

      if (res.data.success) {
        setExistingDocument(res.data.data)
        setIsSaved(true)
        setError(false)
        showNotification("PDF guardado correctamente", "success")
      } else {
        showNotification("Error del servidor: " + res.data.message, "error")
      }
    } catch (error) {
      console.error("Error al guardar PDF:", error)
      showNotification("Error al guardar el PDF", "error")
    }
  }

  const handleView = () => {
    if (existingDocument && existingDocument.url_pdf) {
      setIsModalOpen(true)
    } else if (pdfBlobUrl) {
      setIsModalOpen(true)
    } else {
      showNotification("No hay archivo para visualizar", "error")
    }
  }

const handleDelete = async () => {
  try {
    if (existingDocument) {
      const response = await axios.delete(`http://127.0.0.1:8000/api/documentos/${type}/${idArchivo}`);
      
      if (response.data.success) {
        setExistingDocument(null);
        setError(true);
        showNotification("Documento eliminado correctamente", "success");
      } else {
        showNotification(`Error: ${response.data.message || 'No se pudo eliminar el documento'}`, "error");
        return;
      }
    }

    // Limpieza del estado local y memoria
    if (pdfBlobUrl) {
      URL.revokeObjectURL(pdfBlobUrl);
      setPdfBlobUrl(null);
    }

    setFile(null);
    setFileName("");
    setIsSaved(false);

    // Limpiar input file si está presente
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    if (!existingDocument && fileName) {
      showNotification("Archivo eliminado", "success");
    }

  } catch (error) {
    console.error("Error al eliminar el documento:", error);
    const errorMessage = error.response?.data?.message || "Error al eliminar el documento";
    showNotification(errorMessage, "error");
  }
}

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type })

    setTimeout(() => {
      setNotification({ ...notification, show: false })
    }, 3000)
  }

  if (loading) {
    return (
      <div className="pdf-uploader-container">
        <div className="card">
          <div className="card-header">
            <div className="card-icon">
              <FileText size={24} />
            </div>
            <h3 className="card-title">{title}</h3>
          </div>
          <div className="loading">Cargando...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="pdf-uploader-container">
      {notification.show && (
        <div className={`notification ${notification.type}`}>
          <div className="notification-icon">
            {notification.type === "success" ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          </div>
          <div className="notification-message">{notification.message}</div>
          <button className="notification-close" onClick={() => setNotification({ ...notification, show: false })}>
            <X size={16} />
          </button>
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <div className="card-icon">
            <FileText size={24} />
          </div>
          <h3 className="card-title">{title}</h3>
        </div>

        <div className="upload-container">
          {(!existingDocument && !fileName) || error ? (
            <label className="file-input-label">
              <Upload className="icon-small" /> Subir PDF
              <input type="file" accept=".pdf" className="file-input" onChange={handleFileChange} ref={fileInputRef} />
            </label>
          ) : !isSaved && !existingDocument ? (
            <button className="btn btn-view" onClick={handleSavePdf}>
              <Save className="icon-small" /> Guardar PDF
            </button>
          ) : null}
        </div>

        {(fileName && !error) || existingDocument ? (
          <div className="file-info">
            <div className="file-name-container">
              <FileText className="icon-small" />
              <span className="file-name-text">
                {existingDocument
                  ? `Documento ${type === "area" ? "de área" : "de convocatoria"} (${new Date(existingDocument.fecha_creacion).toLocaleDateString()})`
                  : fileName}
              </span>
            </div>
            <div className="button-group">
              <button className="btn btn-view" onClick={handleView}>
                <Eye className="icon-small" /> Ver
              </button>
              <button className="btn btn-delete" onClick={handleDelete}>
                <Trash className="icon-small" /> Eliminar
              </button>
            </div>
          </div>
        ) : (
          <div className="no-file">No hay documento para este {type === "area" ? "área" : "competencia"}</div>
        )}

        {existingDocument && (
          <div className="document-details">
            <p>Fecha de creación: {new Date(existingDocument.fecha_creacion).toLocaleDateString()}</p>
            <p>Estado: {existingDocument.estado ? "Activo" : "Inactivo"}</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-containerPDF" ref={modalRef}>
            <div className="modal-header">
              <h3 className="modal-titlePDF">
                Visualizando: {existingDocument ? `Documento ${type === "area" ? "de área" : "de convocatoria"}` : fileName}
              </h3>
              <button className="modal-closePDF" onClick={() => setIsModalOpen(false)}>
                <X size={33} />
              </button>
            </div>
            <div className="modal-contentPDF">
              {existingDocument ? (
                <iframe src={existingDocument.url_pdf} className="pdf-viewer" title="Documento PDF" />
              ) : pdfBlobUrl ? (
                <iframe src={pdfBlobUrl} className="pdf-viewer" title={fileName} />
              ) : (
                <p>No hay archivo para visualizar.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
