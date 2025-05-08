import { useState } from "react"
import "./boletaView.css"

const BoletaView = ({ boleta, onClose, onDescargar }) => {
  const [isLoading, setIsLoading] = useState(false)

  if (!boleta) return null

  const handleDescargar = () => {
    try {
      setIsLoading(true)
      onDescargar()
    } catch (error) {
      console.error("Error al descargar desde el visor:", error)
      alert("Error al descargar la boleta. Inténtalo de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="boletaViewerOverlay">
      <div className="boletaViewer">
        <div className="boletaViewerHeader">
          <h2>Boleta de Pago</h2>
          <button className="closeButton" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="boletaContent">
          <div className="boletaDocument">
            <div className="boletaHeaderSection">
              <div className="universidadInfo">
                <p className="universidadNombre">UNIVERSIDAD MAYOR DE SAN SIMÓN</p>
                <p>DIRECCIÓN ADMINISTRATIVA Y FINANCIERA</p>
              </div>
              <div className="boletaNumero">
                <p>Nro.</p>
                <p className="numeroValue">{boleta.numero}</p>
              </div>
            </div>

            <h2 className="boletaTitle">BOLETA DE PAGO</h2>

            <div className="boletaInfoSection">
              <div className="infoRow">
                <div className="infoLabel">Nombre:</div>
                <div className="infoValue">{boleta.tutor || "No especificado"}</div>
              </div>
              <div className="infoRow">
                <div className="infoLabel">Monto Total (Bs):</div>
                <div className="infoValue">{boleta.monto_total || boleta.montoTotal || 0}</div>
              </div>
            </div>

            <table className="boletaTable">
              <thead>
                <tr>
                  <th>Nro</th>
                  <th>Nombre Competidor</th>
                  <th>Area</th>
                  <th>Categoría</th>
                  <th>Monto</th>
                </tr>
              </thead>
              <tbody>
                {(boleta.competidores || []).map((competidor, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{competidor.nombre || "Sin nombre"}</td>
                    <td>{competidor.area || "Sin área"}</td>
                    <td>{competidor.nivel || competidor.categoria || "Sin categoría"}</td>
                    <td>{competidor.monto || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="boletaFooterSection">
              <p>Fecha de emisión: {boleta.fecha_emision || boleta.fechaEmision || new Date().toLocaleDateString()}</p>
              <p>Estado: {boleta.estado || "Pendiente"}</p>
            </div>
          </div>
        </div>

        <div className="boletaViewerFooter">
          <button className="primaryButton" onClick={handleDescargar} disabled={isLoading}>
            {isLoading ? "Descargando..." : "Descargar PDF"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default BoletaView
