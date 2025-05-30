
import "./notificacionItem.css"
import axios from "axios"

const NotificacionItem = ({ idTutor,notificacion, setNotificaciones, onOpenModal}) => {
  
    // Extraer datos de la notificación
    const { notificacion_id, responsableGestion, destinatario, fechaEnvio, mensaje, estado } = notificacion
    const nombreResponsable = `${responsableGestion.nombres} ${responsableGestion.apellidos}`
    const tipoDestinatario = destinatario.tipo
    const datosDestinatario = destinatario[tipoDestinatario]
    const nombreDestinatario = `${datosDestinatario.nombres} ${datosDestinatario.apellidos}`
  
    const mensajePreview = mensaje.length > 30 ? `${mensaje.substring(0, 30)}...` : mensaje
  
  
    const handleClick = async () => {
      if (!estado) {
        try {
          await axios.post(`http://127.0.0.1:8000/api/tutor/${idTutor}/cambiarEstadoNotificacion/${notificacion_id}`)
          setNotificaciones((prevNotificaciones) =>
            prevNotificaciones.map((item) =>
              item.notificacion_id === notificacion_id ? { ...item, estado: true } : item,
            ),
          )
        } catch (error) {
          console.error("Error al marcar como leída:", error)
        }
      }
  
      onOpenModal(notificacion)
    }

  return (
    <div className={`notificacion-item ${estado ? "leida" : "no-leida"}`} onClick={handleClick}>
    <div className="notificacion-header">
      <div className="remitente">{nombreResponsable}</div>
      <div className="fecha">{fechaEnvio}</div>
    </div>

    <div className="destinatario">{tipoDestinatario}: {nombreDestinatario}</div>

    <div className="mensaje">Mensaje: {mensajePreview}</div>

  </div>
  )
}

export default NotificacionItem
