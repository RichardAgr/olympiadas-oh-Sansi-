import { useState, useRef } from "react"
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
    
        if (typeof file === "object" && !file.arrayBuffer) {
          const simulatedFile = {
            name: file.name,
            size: 1024,
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            arrayBuffer: () => Promise.resolve(new ArrayBuffer(10)),
            text: () => Promise.resolve("Contenido simulado"),
          }
          onFileUpLoader(simulatedFile)
        } else {
          // En un entorno real, pasamos el archivo tal cual
          onFileUpLoader(file)
        }
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
            </div>
            <div className="fileDetails">
              <p className="fileName">{fileName}</p>
              <p className="fileStatus">{isLoading ? "Procesando archivo..." : "Archivo cargado"}</p>
            </div>
          </div>
        ) : (
          <div className="uploadMessage">
            <div className="uploadIcon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
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