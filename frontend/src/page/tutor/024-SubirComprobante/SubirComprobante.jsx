import { useState } from "react"

function SubirComporbante() {
  const [files, setFiles] = useState([])
  const [currentFile, setCurrentFile] = useState(null)
  const [extractedData, setExtractedData] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedFileUrl, setUploadedFileUrl] = useState(null)
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState("")
  const [alertType, setAlertType] = useState("") // success, error, warning

  const handleFileUpload = (newFiles) => {
    const updatedFiles = [...files, ...newFiles]
    setFiles(updatedFiles)

    // Establecer el archivo cargado
    const lastFile = newFiles[newFiles.length - 1]
    setCurrentFile(lastFile)

    // Simular la extracion del dato
    simulateDataExtraction(lastFile)
  }

  const simulateDataExtraction = (file) => {
    // proceso de carga
    setTimeout(() => {
      const isImage = file.type.startsWith("image/")
      const isPdf = file.type === "application/pdf"

      let mockData = {
        fileName: file.name,
        fileType: file.type,
        fileSize: `${(file.size / 1024).toFixed(2)} KB`,
        uploadDate: new Date().toLocaleString(),
      }

      if (isImage) {
        mockData = {
          ...mockData,
          dimensions: "1920 x 1080 px",
          text: ["INVOICE #10234", "Date: 05/07/2023", "Customer: John Doe", "Amount: $1,250.00", "Status: PAID"],
          entities: {
            invoiceNumber: "10234",
            date: "05/07/2023",
            customer: "John Doe",
            amount: "$1,250.00",
            status: "PAID",
          },
        }
      } else if (isPdf) {
        mockData = {
          ...mockData,
          pages: 3,
          text: [
            "CONTRACT AGREEMENT",
            "Between Company A and Company B",
            "Effective Date: January 15, 2023",
            "Term: 12 months",
            "Services: Software Development",
          ],
          entities: {
            documentType: "Contract",
            parties: ["Company A", "Company B"],
            effectiveDate: "January 15, 2023",
            term: "12 months",
            services: "Software Development",
          },
        }
      }

      setExtractedData(mockData)
      showAlertMessage("Datos extraídos correctamente", "success")
    }, 1000)
  }

  const handleSelectFile = (file) => {
    setCurrentFile(file)
    simulateDataExtraction(file)
  }

  const handleDeleteFile = (fileToDelete) => {
    const updatedFiles = files.filter((file) => file !== fileToDelete)
    setFiles(updatedFiles)

    if (currentFile === fileToDelete) {
      setCurrentFile(updatedFiles.length > 0 ? updatedFiles[0] : null)
      setExtractedData(null)
      setUploadedFileUrl(null)
    }

    showAlertMessage("Archivo eliminado", "warning")
  }

  const handleSaveData = async () => {
    if (!currentFile) {
      showAlertMessage("No hay archivo para guardar", "warning")
      return
    }

    try {
      setIsUploading(true)

      // Subir el archivo a la nube y obtener la URL
      const uploadedUrl = await uploadFileToCloud(currentFile)

      setUploadedFileUrl(uploadedUrl)
      showAlertMessage("Archivo guardado correctamente en la nube", "success")

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

  const uploadFileToCloud = async (file) => {
    // Método para subir a Cloudinary directamente desde el cliente
    const cloudName = "tu_cloud_name" // Reemplaza con tu cloud_name de Cloudinary
    const uploadPreset = "tu_upload_preset" // Reemplaza con tu upload_preset (debe ser unsigned)

    const formData = new FormData()
    formData.append("file", file)
    formData.append("upload_preset", uploadPreset)

    try {
      // Para este ejemplo, simulamos una carga con un retraso
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // En un entorno real, descomentar este código:
      /*
      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, {
        method: "POST",
        body: formData
      });
      
      if (!response.ok) {
        throw new Error("Error al subir el archivo");
      }
      
      const data = await response.json();
      return data.secure_url;
      */

      // Para este ejemplo, simulamos una URL de archivo subido
      return `https://ejemplo.com/archivos/${file.name}?t=${Date.now()}`
    } catch (error) {
      console.error("Error al subir a Cloudinary:", error)
      throw error
    }
  }

  const showAlertMessage = (message, type) => {
    setAlertMessage(message)
    setAlertType(type)
    setShowAlert(true)

    // Ocultar la alerta después de 2 segundos
    setTimeout(() => {
      setShowAlert(false)
    }, 2000)
  }

  return (
    <div className="app-container">
      <header>
        <h1>Visualizador de Archivos</h1>
        <p>Sube imágenes o PDFs para visualizarlos y extraer información</p>
      </header>

      {showAlert && (
        <div className="alert-overlay">
          <div className={`alert alert-${alertType}`}>
            <div className="alert-icon">
              {alertType === "success" && "✅"}
              {alertType === "error" && "❌"}
              {alertType === "warning" && "⚠️"}
            </div>
            <div className="alert-message">{alertMessage}</div>
          </div>
        </div>
      )}

      <main>
        <div className="upload-section">
          <h1>carga del archivo drang en drop</h1>
          {/* <FileUpload onFileUpload={handleFileUpload} /> */}
        </div>

        <div className="content-section">
          <div className="files-list">
            <h2>Archivos Subidos</h2>
            <div className="files-grid">
              {files.map((file, index) => (
                <div
                  key={index}
                  className={`file-item ${currentFile === file ? "active" : ""}`}
                  onClick={() => handleSelectFile(file)}
                >
                  <div className="file-icon">{file.type.startsWith("image/") ? "🖼️" : "📄"}</div>
                  <div className="file-name">{file.name}</div>
                  <button
                    className="file-delete-btn"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteFile(file)
                    }}
                  >
                    ✖
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="preview-section">
            <h1>carga de archivos</h1>
            {/* {currentFile && <FilePreview file={currentFile} />} */}

            {uploadedFileUrl && (
              <div className="uploaded-url-container">
                <h4>URL del archivo subido:</h4>
                <div className="url-display">
                  <input type="text" value={uploadedFileUrl} readOnly className="url-input" />
                  <button
                    className="copy-button"
                    onClick={() => {
                      navigator.clipboard.writeText(uploadedFileUrl)
                      showAlertMessage("URL copiada al portapapeles", "success")
                    }}
                  >
                    Copiar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {extractedData && (
          <div className="data-section">
            {/* <DataDisplay data={extractedData} onSave={handleSaveData} isUploading={isUploading} /> */}
            <h1>mostrar acrivos</h1>
          </div>
        )}
      </main>
    </div>
  )
}

export default SubirComporbante
