import { useState } from "react"
import { marcarComoLeida } from "../../../public/riki/HU25/notificacion"
import "./notificacionItem.css"

const NotificacionItem = ({ notificacion, setNotificaciones, onOpenModal}) => {
    const [expandido, setExpandido] = useState(false)
    const [marcando, setMarcando] = useState(false)
  
    // Extraer datos de la notificación
    const { notificacion_id, responsableGestion, destinatario, fechaEnvio, mensaje, estado } = notificacion
  
    const nombreResponsable = `${responsableGestion.nombres} ${responsableGestion.apellidos}`
  
    // Obtener el nombre del destinatario según su tipo
    const tipoDestinatario = destinatario.tipo
    const datosDestinatario = destinatario[tipoDestinatario]
    const nombreDestinatario = `${datosDestinatario.nombres} ${datosDestinatario.apellidos}`
  
    const mensajePreview = mensaje.length > 30 ? `${mensaje.substring(0, 30)}...` : mensaje
  
    const handleVerMas = async (e) => {
      e.stopPropagation() 
      setExpandido(!expandido)
  
      if (!estado && !expandido) {
        try {
          setMarcando(true)
          await marcarComoLeida(notificacion_id)
  
          // Actualizar el estado local
          setNotificaciones((prevNotificaciones) =>
            prevNotificaciones.map((item) =>
              item.notificacion_id === notificacion_id ? { ...item, estado: true } : item,
            ),
          )
        } catch (error) {
          console.error("Error al marcar como leída:", error)
        } finally {
          setMarcando(false)
        }
      }
    }
  
    const handleClick = async () => {
      if (!estado) {
        try {
          await marcarComoLeida(notificacion_id)
  
          // Actualizar el estado local
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

    <div className="destinatario">{notificacion.destinatario.tipo}: {nombreDestinatario}</div>

    <div className="mensaje">Mensaje: {expandido ? mensaje : mensajePreview}</div>

  </div>
  )
}

export default NotificacionItem
