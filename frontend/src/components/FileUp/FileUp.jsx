import { useState, useRef } from "react"
import { ImageIcon,Loader } from 'lucide-react'
import "./fileUp.css"

export default function FileUpload({ onFileUpload, isProcessing }) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef(null)

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileUpload(e.dataTransfer.files[0])
    }
  }

  const handleButtonClick = () => {
    fileInputRef.current.click()
  }

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileUpload(e.target.files[0])
    }
  }

  return (
    <div className="upload-section">
      <div
        className={`file-upload ${isDragging ? "dragging" : ""} ${isProcessing ? "processing" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {isProcessing ? (
          <div className="processing-overlay">
            <Loader className="processing-icon" size={48} />
            <div className="processing-text">Procesando imagen...</div>
          </div>
        ) : (
          <>
            <div className="upload-icon">
              <ImageIcon size={64} strokeWidth={1.5} />
            </div>
            <div className="upload-title">Arrastra y suelta una imagen aquí</div>
            <div className="upload-separator">o</div>
            <button className="upload-button" onClick={handleButtonClick}>
              Seleccionar Imagen
            </button>
            <div className="file-types">Imágenes (JPG, PNG, GIF, WebP)</div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileInputChange}
              accept="image/*"
              style={{ display: "none" }}
            />
          </>
        )}
      </div>
    </div>
  )
}
