import { useState } from "react"
import { marcarComoLeida } from "../../../public/riki/HU25/notificacion"
import "./notificacionItem.css"

const NotificacionItem = ({ notificacion, setNotificaciones }) => {
  const [expandido, setExpandido] = useState(false)
  const [marcando, setMarcando] = useState(false)

  const { notificacion_id, responsableGestion, destinatario, fechaEnvio, mensaje, estado } = notificacion

  const nombreResponsable = `${responsableGestion.nombres} ${responsableGestion.apellidos}`

  const tipoDestinatario = destinatario.tipo
  const datosDestinatario = destinatario[tipoDestinatario]
  const nombreDestinatario = `${datosDestinatario.nombres} ${datosDestinatario.apellidos}`

  const mensajePreview = mensaje.length > 60 ? `${mensaje.substring(0, 60)}...` : mensaje

  const handleVerMas = async () => {
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

  return (
    <div className={`notificacion-item ${estado ? "leida" : "no-leida"}`}>
      <div className="notificacion-header">
        <div className="remitente">{nombreResponsable}</div>
        <div className="fecha">{fechaEnvio}</div>
      </div>

      <div className="destinatario">Destinatario: {nombreDestinatario}</div>

      <div className="mensaje">Mensaje: {expandido ? mensaje : mensajePreview}</div>

      <div className="acciones">
        <button className="ver-mas-btn" onClick={handleVerMas} disabled={marcando}>
          {expandido ? "Ver menos" : "Ver más"}
        </button>
      </div>
    </div>
  )
}

export default NotificacionItem
