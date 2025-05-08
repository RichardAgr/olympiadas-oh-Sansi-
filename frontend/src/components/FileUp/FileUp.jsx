import { useState, useRef } from "react"
import { Upload } from 'lucide-react'
import "./fileUp.css"

export default function FileUpload({ onFileUpload }) {
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
        className={`file-upload ${isDragging ? "dragging" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="upload-icon">
          <Upload size={64} strokeWidth={1.5} />
        </div>
        <div className="upload-title">Arrastra y suelta un archivo aquí</div>
        <div className="upload-separator">o</div>
        <button className="upload-button" onClick={handleButtonClick}>
          Seleccionar Archivo
        </button>
        <div className="file-types">Imágenes (JPG, PNG, GIF) o PDFs</div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInputChange}
          accept="image/*,application/pdf"
          style={{ display: "none" }}
        />
      </div>
    </div>
  )
}
