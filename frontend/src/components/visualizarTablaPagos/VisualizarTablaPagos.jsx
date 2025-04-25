import { useState } from "react"
import { useNavigate } from 'react-router-dom';
import AlertMessage from "./alertMessage/AlertMessage"
import "./visualizarTablaPagos.css"


const VisualizarTablaPagos = ({payments}) => {
    const [alertOpen, setAlertOpen] = useState(false)
    const [alertMessage, setAlertMessage] = useState("")
    const navigate = useNavigate();

    const handleViewDetails = (payment) => {
        if (payment.estado === "Pendiente" || !payment.fecha_pago) {
          setAlertMessage("No se puede mostrar detalles por falta de pago")
          setAlertOpen(true)
          return
        }
        navigate('/respGest/DetallePago', { state: { payment } });
      }

      const closeAlert = () => {
        setAlertOpen(false)
      }

    return (
        <>
              <div className="table-container">
                <table className="payment-table">
                  <thead>
                    <tr>
                      <th></th>
                      <th>Nombre del tutor</th>
                      <th>CI</th>
                      <th>fecha</th>
                      <th>Monto</th>
                      <th>Estado Pago</th>
                      <th>Detalles</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((payment) => (
                      <tr key={payment.boleta_id}>
                        <td className="icon-cell">
                          <div className="user-icon">
                            <span>{payment.tutor.nombres.charAt(0)}</span>
                          </div>
                        </td>
                        <td>{`${payment.tutor.nombres} ${payment.tutor.apellidos}`}</td>
                        <td>{payment.tutor.ci}</td>
                        <td>{payment.fecha_pago ? (payment.fecha_pago) : "----"}</td>
                        <td>{payment.fecha_pago ? (`${payment.monto_total} Bs`):"----"}</td>
                        <td>
                          <span className={`status-badge ${payment.estado.toLowerCase()}`}>{payment.estado}</span>
                        </td>
                        <td>
                          <button className="details-button" onClick={() => handleViewDetails(payment)}>
                            Más Detalles
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <AlertMessage isOpen={alertOpen} onClose={closeAlert} message={alertMessage} />
            </>
    )
}

export default VisualizarTablaPagos