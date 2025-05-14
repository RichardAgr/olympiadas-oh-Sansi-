import { useState, useEffect } from "react"
import saveAs from "file-saver"
import BoletaView from "../../../components/BoletaView/BoletaView"
import { generarBoletaPDF } from "../../../components/generarBoleta/GenerarBoletaPDF"
import "./verRecibos.css"

const VerRecibos = () => {
  const [boletas, setBoletas] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedBoleta, setSelectedBoleta] = useState(null)
  const [showViewer, setShowViewer] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Simulamos la carga de boletas 
    setTimeout(() => {
      const boletasMock = [
        {
          id: 1,
          numero: "2025123",
          tutor: "JOFRE TICONA PLATA",
          fecha_emision: "01/05/2025",
          monto_total: 45,
          estado: "Pagada",
        },
        {
          id: 2,
          numero: "2020124",
          tutor: "DAYSI GRAGEDA GONZÁLES",
          fecha_emision: "01/05/2025",
          monto_total: 15,
          estado: "Pendiente",
        },
        {
          id: 3,
          numero: "2025125",
          tutor: "CARLOS MENDOZA LÓPEZ",
          fecha_emision: "01/05/2025",
          monto_total: 15,
          estado: "Pagada",
        },
      ]

      setBoletas(boletasMock)
      setIsLoading(false)
    }, 1000)
  }, [])

  const handleVerBoleta = (boleta) => {
    setSelectedBoleta(boleta)
    setShowViewer(true)
  }

  const handleDescargarBoleta = async (boleta) => {
    try {
      setError(null)
      setIsLoading(true)

      const boletaData = {
        numero: boleta.numero || "7000569",
        tutor: boleta.tutor || "TUTOR NO ESPECIFICADO",
        fechaEmision: boleta.fecha_emision || new Date().toLocaleDateString(),
        montoTotal: boleta.monto_total || 0,
        competidores: Array.isArray(boleta.competidores)
          ? boleta.competidores.map((comp) => ({
              nombre: comp.nombre || "Sin nombre",
              area:comp.area || "Sin area",
              nivel: comp.nivel || "Sin categoría",
              monto: comp.monto || 0,
            }))
          : [],
      }

      const blob = await generarBoletaPDF(boletaData)

      saveAs(blob, `Boleta_${boletaData.numero}.pdf`)
    } catch (error) {
      console.error("Error al descargar la boleta:", error)
      setError("Error al descargar la boleta: " + error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCloseViewer = () => {
    setShowViewer(false)
  }

  

  return (
    <div className="boletasList">
      <h1>Recibos para de Pago</h1>

      {error && <div className="errorMessage">{error}</div>}

      {isLoading ? (
        <div className="loadingContainer">
          <div className="spinner"></div>
          <p>Cargando boletas...</p>
        </div>
      ) : (
        <>
          <div className="boletasGrid">
            {boletas.map((boleta) => (
              <div key={boleta.id} className={`boletaCard ${boleta.estado.toLowerCase()}`}>
                <div className="boletaHeader">
                  <h3>{boleta.numero}</h3>
                  <span className={`estadoBadge ${boleta.estado.toLowerCase()}`}>{boleta.estado}</span>
                </div>

                <div className="boletaBody">
                  <p>
                    <strong>Tutor:</strong> {boleta.tutor}
                  </p>
                  <p>
                    <strong>Fecha:</strong> {boleta.fecha_emision}
                  </p>
                  <p>
                    <strong>Monto Total:</strong> Bs. {boleta.monto_total}
                  </p>
                </div>

                <div className="boletaFooter">
                  <button className="button button-secondary" onClick={() => handleVerBoleta(boleta)}>
                    Ver Boleta
                  </button>
                </div>
              </div>
            ))}
          </div>

          {showViewer && selectedBoleta && (
            <BoletaView
              boleta={selectedBoleta}
              onClose={handleCloseViewer}
              onDescargar={() => handleDescargarBoleta(selectedBoleta)}
            />
          )}
        </>
      )}
    </div>
  )
}

export default VerRecibos
