import "./dataDisplay.css"
import {Check, AlertTriangle } from "lucide-react"

export default function DataDisplay({ data, isUploading,isProcessing,uploadProgress, onSave, onCancel }) {
  const confidenceValue = Number.parseInt(data.confianza.replace("%", ""), 10)
  let confidenceClass = "high"

  if (confidenceValue < 90) {
    confidenceClass = "medium"
  }
  if (confidenceValue < 80) {
    confidenceClass = "low"
  }
  return (
    <div className="data-section">
      <div className="data-display">
        <div className="data-title">Datos Extraídos</div>
        
        <div className={`confidence-indicator ${confidenceClass}`}>
              {confidenceClass === "high" && <Check size={16} />}
              {confidenceClass === "medium" && <Check size={16} />}
              {confidenceClass === "low" && <AlertTriangle size={16} />}
              Confianza: {data.confianza}
            </div>

        <div className="extracted-data-card">
          <div className="data-field">
            <div className="data-label">Numero de Comprobante:</div>
            <div className="data-value">{data.numeroComprobante}</div>
          </div>

          <div className="data-field">
            <div className="data-label">Nombre Completo:</div>
            <div className="data-value">{data.nombreCompleto}</div>
          </div>

          <div className="data-field">
            <div className="data-label">Monto Pagado en (BS.):</div>
            <div className="data-value">{data.montoPagado}</div>
          </div>

          <div className="data-field">
            <div className="data-label">Fecha de Pago:</div>
            <div className="data-value">{data.fechaPago}</div>
          </div>

          <div className="form-actions">
            <button
              className={`btn-guardar ${isUploading ? "loading" : ""}`}
              onClick={onSave}
              disabled={isUploading || isProcessing}
            >
              {isUploading ? (
                <>
                  <div className="upload-progress-container">
                    <div className="upload-progress-text">{uploadProgress}%</div>
                    <div className="upload-progress-bar">
                      <div className="upload-progress-fill" style={{ width: `${uploadProgress}%` }}></div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <span>Guardar</span>
                </>
              )}
            </button>
            <button className="btn-cancelar" onClick={onCancel} disabled={isUploading || isProcessing}>
              <span>Cancelar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
