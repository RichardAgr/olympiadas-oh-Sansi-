import { Trash2, Copy,ImageIcon,Loader } from 'lucide-react'
import DataDisplay from '../DataDisplay/DataDisplay'
import "./fileViewer.css"

export default function FileViewer({
  file,
  filePreviewUrl,
  extractedData,
  uploadedFileUrl,
  isUploading,
  isProcessing,
  uploadProgress,
  onDeleteFile,
  onSaveData,
  onCancel,
  onCopyUrl,
}) {
  const displayUrl = uploadedFileUrl || filePreviewUrl || "/placeholder.svg"
  return (
    <div className={`content-layout ${extractedData ? "with-data" : ""}`}>
      <div className="file-view-section">
        <div className="file-header">
          <div className="file-info">
            <div className="file-icon">
              <ImageIcon size={20} />
            </div>
            <div className="file-name">{file.name}</div>
            <span className="file-size">({(file.size / 1024).toFixed(2)} KB)</span>
          </div>
          <button className="delete-button" onClick={onDeleteFile} disabled={isUploading || isProcessing}>
            <Trash2 size={20} />
            <span>Eliminar</span>
          </button>
        </div>

        <div className="preview-container">
          {isProcessing && (
            <div className="processing-overlay">
              <Loader className="processing-icon" size={36} />
              <div className="processing-text">Analizando imagen...</div>
            </div>
          )}
          

          <div className="preview-section">
            <img src={displayUrl || "/placeholder.svg"} alt="Vista previa de imagen" className="preview-image" />
          </div>
  
        </div>


        {/* {uploadedFileUrl && 
          <div className="uploaded-url-container">
          <div className="url-title">URL del archivo subido:</div>
          <div className="url-display">
            <input type="text" value={uploadedFileUrl} readOnly className="url-input" />
            <button className="copy-button" onClick={onCopyUrl}>
              <Copy size={16} />
              <span>Copiar</span>
            </button>
          </div>
        </div>
        } */}
      </div>

      {extractedData && (
        <DataDisplay
          data={extractedData}
          isUploading={isUploading}
          isProcessing={isProcessing}
          uploadProgress={uploadProgress}
          onSave={onSaveData}
          onCancel={onCancel}
        />
      )}
    </div>
  )
}
