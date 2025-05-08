import { Save, X } from 'lucide-react'
import "./dataDisplay.css"

export default function DataDisplay({ data, isUploading, onSave, onCancel }) {
  return (
    <div className="data-section">
      <div className="data-display">
        <div className="data-title">Datos Extraídos</div>

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
            <button className={`btn-guardar ${isUploading ? "loading" : ""}`} onClick={onSave} disabled={isUploading}>
              {isUploading ? (
                <>
                  <span className="spinnerS"></span>
                  <span>Subiendo...</span>
                </>
              ) : (
                <>
                  <Save size={18} />
                  <span>Guardar</span>
                </>
              )}
            </button>
            <button className="btn-cancelar" onClick={onCancel} disabled={isUploading}>
              <X size={18} />
              <span>Cancelar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
