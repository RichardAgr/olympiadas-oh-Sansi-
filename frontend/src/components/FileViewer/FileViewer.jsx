import { Trash2, Copy } from 'lucide-react'
import DataDisplay from '../DataDisplay/DataDisplay'
import "./fileViewer.css"

export default function FileViewer({
  file,
  filePreviewUrl,
  extractedData,
  uploadedFileUrl,
  isUploading,
  onDeleteFile,
  onSaveData,
  onCancel,
  onCopyUrl,
}) {
  return (
    <div className={`content-layout ${extractedData ? "with-data" : ""}`}>
      <div className="file-view-section">
        <div className="file-header">
          <div className="file-info">
            <div className="file-icon">{file.type.startsWith("image/") ? "🖼️" : "📄"}</div>
            <div className="file-name">{file.name}</div>
            <span className="file-size">({(file.size / 1024).toFixed(2)} KB)</span>
          </div>
          <button className="delete-button" onClick={onDeleteFile}>
            <Trash2 size={20} />
            <span>Eliminar</span>
          </button>
        </div>

        <div className="preview-section">
            {file.type.startsWith("image/") ? (
              <img src={filePreviewUrl || "/placeholder.svg"} alt="Vista previa de imagen" className="preview-image" />
            ) : (
              <div className="pdf-preview">
                {filePreviewUrl ? (
                  <iframe src={`${filePreviewUrl}#toolbar=0&navpanes=0`} title={file.name} className="pdf-iframe"></iframe>
                ) : (
                  <div className="pdf-placeholder">
                    <div className="pdf-icon">📄</div>
                    <p>Cargando PDF...</p>
                  </div>
                )}
        </div>
      )}
    </div>

        {uploadedFileUrl && 
                <div className="uploaded-url-container">
                <div className="url-title">URL del archivo subido:</div>
                <div className="url-display">
                  <input type="text" value={uploadedFileUrl} readOnly className="url-input" />
                  <button className="copy-button" onClick={uploadedFileUrl}>
                    <Copy size={16} />
                    <span>Copiar</span>
                  </button>
                </div>
              </div>
        }
      </div>

      {extractedData && (
        <DataDisplay data={extractedData} isUploading={isUploading} onSave={onSaveData} onCancel={onCancel} />
      )}
    </div>
  )
}
