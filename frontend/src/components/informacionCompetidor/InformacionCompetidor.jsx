
import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Eye, CheckCircle,X,Bell } from "lucide-react"
import axios from "axios"
import "./informacionCompetidor.css"

export default function InformacionCompetidor() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [competitor, setCompetitor] = useState(null)
  const [tutors, setTutors] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedStatus, setSelectedStatus] = useState("")
  const [previousStatus, setPreviousStatus] = useState("")
  const [showNotificationModal, setShowNotificationModal] = useState(false)
  const [showSuccessAlert, setShowSuccessAlert] = useState(false)
  const [notificationReason, setNotificationReason] = useState("")
  const [notificationError, setNotificationError] = useState("")
  const [showReceipt, setShowReceipt] = useState(false)
  const [showNotificationSent, setShowNotificationSent] = useState(false)

  useEffect(() => {
    const fetchCompetitorDetail = async () => {
      try {
        setIsLoading(true)
        const data = await axios.get(`http://127.0.0.1:8000/api/informacionCompetidores/${id}/competidor`)
/*          if (!data.ok) {
            throw new Error("No se pudo cargar la información del competidor")
        }  */
        setCompetitor(data.data.informacion_competidor)
        setTutors(data.data.tutores)
        setSelectedStatus(data.data.informacion_competidor.estado)
        setPreviousStatus(data.data.informacion_competidor.estado)
        setIsLoading(false)
      } catch (err) {
        setError("Error al cargar los datos del competidor")
        setIsLoading(false)
        console.error(err)
      }
    }

    fetchCompetitorDetail()
  }, [id])

  const handleGoBack = () => {
    navigate(-1)
  }

  const handleStatusChange = (status) => {
    if (status === "Deshabilitado") {
      setPreviousStatus(selectedStatus)
      setSelectedStatus(status)
      setShowNotificationModal(true)
    } else {
      setSelectedStatus(status)
    }
  }

  const handleSubmit = () => {
    axios.put(`http://127.0.0.1:8000/api/competidor/${competitor.id}/estado`, {
      estado: selectedStatus
  })
  .then(response => console.log(response.data))
  .catch(error => console.error(error))

    // Mostrar alerta de éxito personalizada
    setShowSuccessAlert(true)

    // Esperar 2 segundos y luego redirigir a la lista de competidores
    setTimeout(() => {
    navigate(-1)
    }, 2000)
  }

  const countWords = (text) => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  }

  const handleSendNotification = () => {
    if (!notificationReason.trim()) {
      setNotificationError("Por favor, describa el motivo de la deshabilitación")
      return
    }
    
    const wordCount = countWords(notificationReason);
    if (wordCount < 3) {
      setNotificationError(`El mensaje debe contener al menos 3 palabras. Actualmente tiene ${wordCount} ${wordCount === 1 ? 'palabra' : 'palabras'}.`)
      return
    }

    // Aquí iría la lógica para enviar la notificación
    const data = {
      id_responsable: 1,
      id_tutorPrincipal: tutors[0].id_tutor,
      id_competidor: competitor.id,
      asunto: selectedStatus,
      motivo: notificationReason
    }

    axios.post('http://127.0.0.1:8000/api/notificaciones', data)
    .then(response => {
        console.log('Notificación creada:', response.data);
    })
    .catch(error => {
        console.error('Error al crear notificación:', error);
    });

    setShowNotificationModal(false)
    setShowNotificationSent(true)
    setNotificationReason("")
    setNotificationError("")
    setTimeout(() => {
      setShowNotificationSent(false)
    }, 2000)
  }

  const handleCancelNotification = () => {
    setSelectedStatus(previousStatus)
    setShowNotificationModal(false)
    setNotificationReason("")
    setNotificationError("")
  }

  const handleCloseSuccessAlert = () => {
    setShowSuccessAlert(false)
    navigate(-1)
  }

  const handleShowReceipt = () => {
    console.log("se Muestra")
    setShowReceipt(true)
  }

  const handleCloseNotificationSent = () => {
    setShowNotificationSent(false)
  }

  if (isLoading) {
    return <div className="loading-container">Cargando información del competidor...</div>
  }

  if (error || !competitor) {
    return (
      <div className="error-container">
        <p>{error || "No se encontró el competidor solicitado"}</p>
      </div>
    )
  }

  return (
    <div className="competitor-detail-container">
      <div className="detail-header">
        <h1>Información del Competidor</h1>
      </div>

      <div className="receipt-section">
        <p className="receipt-label">Comprobante de pago:</p>
        <button className="show-receipt-button" onClick={handleShowReceipt}>
          <Eye size={16} /> Mostrar Comprobante
        </button>
      </div>

      <div className="competitor-form">
        <div className="form-group">
          <label>Nombres del competidor:</label>
          <div className="input-field">{competitor.nombres}</div>
        </div>

        <div className="form-group">
          <label>Apellidos del competidor:</label>
          <div className="input-field">{competitor.apellidos}</div>
        </div>

        <div className="form-group">
          <label>CI del competidor:</label>
          <div className="input-field">{competitor.ci}</div>
        </div>

        <div className="form-group">
          <label>Fecha de Nacimiento del competidor:</label>
          <div className="input-field">{competitor.fecha_nacimiento}</div>
        </div>

        {tutors.map((tutor, index) => (
          <div key={index} className="tutor-section">
            <h3 className="tutor-title">
              {tutor.tipo === "Principal" ? "Tutor Principal" : "Tutor Secundario"}
              <span className="tutor-relation">({tutor.relacion})</span>
            </h3>

            <div className="form-group">
              <label>Nombre completo:</label>
              <div className="input-field">{tutor.nombre}</div>
            </div>

            <div className="form-group">
              <label>Correo electrónico de contacto:</label>
              <div className="input-field">{tutor.correo}</div>
            </div>

            <div className="form-group">
              <label>Número de celular:</label>
              <div className="input-field">{tutor.telefono}</div>
            </div>
          </div>
        ))}

        <div className="form-group">
          <label>Colegio:</label>
          <div className="input-field">{competitor.colegio}</div>
        </div>

        <div className="form-group">
          <label>Curso:</label>
          <div className="input-field">{competitor.curso}</div>
        </div>

        <div className="form-group">
          <label>Departamento:</label>
          <div className="input-field">{competitor.departamento}</div>
        </div>

        <div className="form-group">
          <label>Provincia:</label>
          <div className="input-field">{competitor.provincia}</div>
        </div>

        <div className="form-group">
          <label>Área:</label>
          <div className="input-field">{competitor.area}</div>
        </div>

        <div className="status-sectionI">
          <h3>Estado del Estudiante</h3>
          <p className="status-description">Presione opción para el estado: "{selectedStatus}"</p>

          <div className="status-optionsI">
            <label className="radio-label">
              <input
                type="radio"
                name="status"
                checked={selectedStatus === "Habilitado"}
                onChange={() => handleStatusChange("Habilitado")}
              />
              <span>Habilitado</span>
            </label>

            <label className="radio-label">
              <input
                type="radio"
                name="status"
                checked={selectedStatus === "Deshabilitado"}
                onChange={() => handleStatusChange("Deshabilitado")}
              />
              <span>Deshabilitado</span>
            </label>

            <label className="radio-label">
              <input
                type="radio"
                name="status"
                checked={selectedStatus === "Pendiente"}
                onChange={() => handleStatusChange("Pendiente")}
              />
              <span>Pendiente</span>
            </label>
          </div>
        </div>

        <div className="form-actions">
          <button className="submit-button" onClick={handleSubmit}>
            Terminar
          </button>
          <button className="cancel-button" onClick={handleGoBack}>
            Cancelar
          </button>
        </div>
      </div>

      {/* Modal de notificación para estado Deshabilitado */}
      {showNotificationModal && (
        <div className="notification-modal-overlay">
          <div className="notification-modal">
            <h2>DESCRIBA EL MOTIVO Y PRESIONE EL BOTÓN "Enviar"</h2>
            <p className="notification-subtitle">PARA NOTIFICAR AL TUTOR SOBRE EL ESTADO DEL ESTUDIANTE</p>

            <div className="notification-info">
              <div className="notification-row">
                <span className="notification-label">EL ESTUDIANTE:</span>
                <span className="notification-value">
                  {competitor.nombres} {competitor.apellidos}
                </span>
              </div>
              <div className="notification-row">
                <span className="notification-label">ESTADO:</span>
                <span className="notification-value">Deshabilitado</span>
              </div>
            </div>

            <div className="notification-form">
              <label>Descripción de la Observación:</label>
              <textarea
                value={notificationReason}
                onChange={(e) => setNotificationReason(e.target.value)}
                placeholder="Ingrese el motivo de la deshabilitación"
                rows={4}
              />

              {notificationError && <div className="notification-error">{notificationError}</div>}

              <div className="notification-actions">
                <button className="notification-send" onClick={handleSendNotification}>
                  Enviar
                </button>
                <button className="notification-cancel" onClick={handleCancelNotification}>
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ventana para ver la boleta */}
      {showReceipt && competitor.ruta_imagen && (
        <div className="receipt-image-modal">
          <div className="receipt-image-container">
            <button className="close-receipt" onClick={() => setShowReceipt(false)}>
              <X size={20} />
            </button>
            <h3>Comprobante de Pago</h3>
            <img
              src={competitor.ruta_imagen || "/placeholder.svg"}
              alt="Comprobante de pago"
              className="receipt-img"
            />
          </div>
        </div>
        )}

      {/* Alerta de éxito personalizada */}
      {showSuccessAlert && (
        <div className="success-alert-overlay" onClick={handleCloseSuccessAlert}>
          <div className="success-alert" onClick={(e) => e.stopPropagation()}>
            <div className="success-icon">
              <CheckCircle size={48} />
            </div>
            <div className="success-content">
              <h3>¡Cambios guardados!</h3>
              <p>Los cambios han sido guardados correctamente. Redirigiendo a la lista de competidores...</p>
            </div>
          </div>
        </div>
      )}

      {/* Confirmación de notificación enviada */}
{showNotificationSent && (
  <div className="notification-sent-overlay" onClick={handleCloseNotificationSent}>
    <div className="notification-sent" onClick={(e) => e.stopPropagation()}>
      <div className="notification-sent-icon">
        <Bell size={48} />
      </div>
      <div className="notification-sent-content">
        <h3>¡Notificación enviada!</h3>
        <p>La notificación ha sido enviada correctamente al tutor.</p>
      </div>
    </div>
  </div>
)}
    </div>
  )
}
