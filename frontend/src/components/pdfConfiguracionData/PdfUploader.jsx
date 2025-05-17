import { useState, useRef, useEffect } from "react"
import { Upload, Save, Eye, Trash, FileText, X, CheckCircle, AlertCircle } from 'lucide-react'
import "./pdfUploader.css"

export default function PdfUploader({ title}) {
  const [file, setFile] = useState(null)
  const [pdfBlobUrl, setPdfBlobUrl] = useState(null)
  const [isSaved, setIsSaved] = useState(false)
  const [fileName, setFileName] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [notification, setNotification] = useState({ show: false, message: "", type: "" })
  const fileInputRef = useRef(null)
  const modalRef = useRef(null)

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

  const handleSavePdf = () => {
    if (pdfBlobUrl && fileName) {
      setIsSaved(true)
      showNotification("PDF guardado correctamente", "success")
    }
  }

  const handleView = () => {
    if (!pdfBlobUrl && !fileName) {
      showNotification("No hay archivo para visualizar", "error")
      return
    }

    setIsModalOpen(true)
  }

  const handleDelete = () => {
    // revoke blob
    if (pdfBlobUrl) {
      URL.revokeObjectURL(pdfBlobUrl)
      setPdfBlobUrl(null)
    }
    setFile(null)
    setFileName("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    setIsSaved(false)
    showNotification("Archivo eliminado correctamente", "success")
  }

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type })

    setTimeout(() => {
      setNotification({ ...notification, show: false })
    }, 5000)
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
          {!fileName ? (
            <label className="file-input-label">
              <Upload className="icon-small" /> Subir PDF
              <input type="file" accept=".pdf" className="file-input" onChange={handleFileChange} ref={fileInputRef} />
            </label>
          ) : !isSaved ? (
            <button className="btn btn-view" onClick={handleSavePdf}>
              <Save className="icon-small" /> Guardar PDF
            </button>
          ) : null}
        </div>

        {fileName ? (
          <div className="file-info">
            <div className="file-name-container">
              <FileText className="icon-small" />
              <span className="file-name-text">{fileName}</span>
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
          <div className="no-file">No hay archivo seleccionado</div>
        )}
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-containerPDF" ref={modalRef}>
            <div className="modal-header">
              <h3 className="modal-titlePDF">Visualizando: {fileName}</h3>
              <button className="modal-closePDF" onClick={() => setIsModalOpen(false)}>
                <X size={33} />
              </button>
            </div>
            <div className="modal-content">
              {pdfBlobUrl ? (
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
