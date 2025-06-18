import { useState, useEffect } from "react"
import {useParams} from "react-router-dom"
import axios from "axios"
import "./verRecibos.css"

const VerRecibos = () => {
  const {id} = useParams()
  const [boletas, setBoletas] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedBoleta, setSelectedBoleta] = useState(null)
  const [showViewer, setShowViewer] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchBoletas = async () => {
      try {
        setIsLoading(true)
        const response = await axios.get(`http://localhost:8000/api/recibos/tutor/${id}`)
        
        if (response.data && response.data.success) {
          const boletasFormateadas = response.data.data.map(recibo => ({
            id: recibo.recibo_id,
            numero: recibo.numero_recibo,
            tutor: recibo.nombre_completo,
            fecha_emision: formatearFecha(recibo.fecha_emision),
            monto_total: parseFloat(recibo.monto_total),
            estado: recibo.estado,
            url_pdf: recibo.url_pdf
          }))
          
          setBoletas(boletasFormateadas)
        } else {
          throw new Error("No se pudieron cargar los recibos")
        }
      } catch (error) {
        console.error("Error al cargar los recibos:", error)
        setError("Error al cargar los recibos: " + (error.message || "Error desconocido"))
      } finally {
        setIsLoading(false)
      }
    }

    fetchBoletas()
  }, [])

  const formatearFecha = (fechaStr) => {
    if (!fechaStr) return ""
    try {
      const fecha = new Date(fechaStr)
      return fecha.toLocaleDateString('es-ES')
    } catch (error) {
      console.error("Error al formatear fecha:", error)
      return fechaStr
    }
  }

  const handleVerBoleta = (boleta) => {
    setSelectedBoleta(boleta)
    setShowViewer(true)
  }

  const handleDescargarBoleta = async (boleta) => {
    try {
      setError(null)
      setIsLoading(true)

      if (!boleta.url_pdf) {
        throw new Error("No hay URL de PDF disponible para este recibo")
      }

      const response = await axios.get(boleta.url_pdf, {
        responseType: 'blob'
      })
      

      const url = window.URL.createObjectURL(new Blob([response.data]))
      
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `Recibo_${boleta.numero}.pdf`)
      document.body.appendChild(link)
      link.click()
      
      // Limpiar
      window.URL.revokeObjectURL(url)
      document.body.removeChild(link)
    } catch (error) {
      console.error("Error al descargar el recibo:", error)
      setError("Error al descargar el recibo: " + (error.message || "Error desconocido"))
    } finally {
      setIsLoading(false)
    }
  }

  const handleCloseViewer = () => {
    setShowViewer(false)
  }

  return (
    <div className="boletasList">
      <h1>Recibos de Pago</h1>

      {error && <div className="errorMessage">{error}</div>}

      {isLoading ? (
        <div className="loadingContainer">
          <div className="spinner"></div>
          <p>Cargando recibos...</p>
        </div>
      ) : (
        <>
          <div className="boletasGrid">
            {boletas.length > 0 ? (
              boletas.map((boleta) => (
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
                    <button className="buttonVerReci button-secondary" onClick={() => handleVerBoleta(boleta)}>
                      Ver Recibo
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="noRecibos">No hay recibos disponibles</div>
            )}
          </div>

          {showViewer && selectedBoleta && (
            <PDFViewer
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

const PDFViewer = ({ boleta, onClose, onDescargar }) => {
  return (
    <div className="pdfViewerOverlay">
      <div className="pdfViewerContainer">
        <div className="pdfViewerHeader">
          <h2>Recibo #{boleta.numero}</h2>
          <button className="closeButton" onClick={onClose}>×</button>
        </div>
        <div className="pdfViewerContent">
          {boleta.url_pdf ? (
            <iframe 
              src={boleta.url_pdf} 
              title={`Recibo ${boleta.numero}`}
              width="100%" 
              height="500px"
              className="pdfFrame"
            />
          ) : (
            <div className="errorMessage">No hay PDF disponible para este recibo</div>
          )}
        </div>
        <div className="pdfViewerFooter">
          <button className="buttonVerReci" onClick={onDescargar}>Descargar PDF</button>
        </div>
      </div>
    </div>
  )
}

export default VerRecibos
