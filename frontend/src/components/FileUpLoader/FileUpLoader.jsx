import { useState, useRef } from "react"
import {FileSpreadsheet,Upload} from "lucide-react"
import "./fileUpLoader.css"

const FileUpLoader = ({onFileUpLoader, isLoading}) => {

    const [isDragging, setIsDragging] = useState(false)
    const [fileName, setFileName] = useState("")
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
    
        const files = e.dataTransfer.files
        if (files.length > 0) {
          processFile(files[0])
        }
    }

    const handleFileInputChange = (e) => {
        const files = e.target.files
        if (files.length > 0) {
          processFile(files[0])
        }
    }

    const handleButtonClick = () => {
        fileInputRef.current.click()
    }

    const processFile = (file) => {
        // Verificar que sea un archivo Excel
        if (file.name && !file.name.match(/\.(xlsx|xls)$/)) {
          alert("Por favor, sube un archivo Excel válido (.xlsx o .xls)")
          return
        }
        
        setFileName(file.name || "Archivo_Excel.xlsx")
        onFileUpLoader(file)
    }

  return (
    <div className="fileUploader">
      <div
        className={`dropArea ${isDragging ? "dragging" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInputChange}
          accept=".xlsx,.xls"
          style={{ display: "none" }}
        />

        {fileName ? (
          <div className="fileInfo">
            <div className="fileIcon">
              <FileSpreadsheet size={60}/>
            </div>
            <div className="fileDetails">
              <p className="fileName">{fileName}</p>
              <p className="fileStatus">{isLoading ? "Procesando archivo..." : "Archivo cargado"}</p>
            </div>
          </div>
        ) : (
          <div className="uploadMessage">
            <div className="uploadIcon">
              <Upload size={60}/>
            </div>
            <p className="uploadText">
              Arrastra y suelta el archivo Excel, o haz clic para seleccionarlo
              <br />
              <span>Solo se aceptan archivos .xlsx o .xls (máximo 10MB)</span>
            </p>
            <button className="uploadButton" onClick={handleButtonClick} disabled={isLoading}>
              Seleccionar Archivo
            </button>
          </div>
        )}
      </div>

      {isLoading && (
        <div className="loadingIndicator">
          <div className="spinner"></div>
          <p>Procesando archivo, por favor espera...</p>
        </div>
      )}
    </div>
  )
}

export default FileUpLoader