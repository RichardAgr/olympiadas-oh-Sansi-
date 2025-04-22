import { useState, useEffect } from "react"
import { X } from "lucide-react"
import {  useLocation, useNavigate } from 'react-router-dom';
import TablaCompetidores from "../tablaCompetidores/TablaCompetidores";
import "./verDetallesPago.css"
import axios from "axios"

export default function VerDetallesPago(){
    const location = useLocation()
    const dataNavegate = location.state?.payment

    const [students, setStudents] = useState([])
    const [isLoadingStudents, setIsLoadingStudents] = useState(true)
    const [error, setError] = useState(null)
    const [showReceipt, setShowReceipt] = useState(false)

    const { 
        boleta_id,
        numero_boleta,
        fecha_pago,
        monto_total,
        tutor: { tutor_id, ci, nombres, apellidos }, 
        imagen_boleta: { ruta_imagen } 
      } = dataNavegate

        useEffect(() => {
          const getPaymentDetails = async () => {
            try {
                setIsLoadingStudents(true)
                const studentsData = await axios.get(`http://127.0.0.1:8000/api/tutores/${tutor_id}/competidores`)

                setStudents(studentsData.data.data.estudiantes)
                setIsLoadingStudents(false)
              
            } catch (err) {
              setError("Error al cargar los datos de estudiantes")
              setIsLoadingStudents(false)
              console.error(err)
            }
          }
      
          getPaymentDetails()
        }, [tutor_id])

        const handleShowReceipt = () => {
            setShowReceipt(true)
        }
        

      return(
    <div className="payment-details-container">
            <div className="payment-details-header">
              <h1>Detalle de Pago</h1>
              <button className="show-receipt-button" onClick={handleShowReceipt}>
                Mostrar Comprobante
              </button>
            </div>

            <div className="payment-info-section">
              <div className="detail-row">
                <span className="detail-label">Número de Comprobante:</span>
                <span className="detail-value">{numero_boleta}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Nombre de Tutor:</span>
                <span className="detail-value">{`${nombres} ${apellidos}`}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">CI:</span>
                <span className="detail-value">{ci}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Total Pagado:</span>
                <span className="detail-value">{monto_total} Bs</span>
              </div>
            </div>

            <div className="students-section">
              <h2>Estudiantes Asociados</h2>
              {isLoadingStudents ? (
                <div className="loading-students">Cargando estudiantes...</div>
              ) : students.length === 0 ? (
                <div className="no-students">No hay estudiantes asociados a este tutor</div>
              ) : ( 
                 <TablaCompetidores students={students} /> 
              )}
            </div> 
            {showReceipt && ruta_imagen && (
              <div className="receipt-image-modal">
                <div className="receipt-image-container">
                  <button className="close-receipt" onClick={() => setShowReceipt(false)}>
                    <X size={20} />
                  </button>
                  <h3>Comprobante de Pago</h3>
                  <img
                    src={ruta_imagen || "/placeholder.svg"}
                    alt="Comprobante de pago"
                    className="receipt-img"
                  />
                </div>
              </div>
            )}
    </div>
      )

      
}
