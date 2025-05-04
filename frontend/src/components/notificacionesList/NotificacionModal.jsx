import "./notificacionModal.css"

const NotificacionModal = ({ notificacion, onClose }) => {
  if (!notificacion) return null

  const { destinatario, fechaEnvio, mensaje } = notificacion
  const tipoDestinatario = destinatario.tipo
  const datosDestinatario = destinatario[tipoDestinatario]
  const nombreDestinatario = `${datosDestinatario.nombres} ${datosDestinatario.apellidos}`


  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>

        <div className="modal-header">
          <div className="modal-title">{nombreDestinatario}</div>
          <div className="modal-date">Fecha:  {fechaEnvio}</div>
        </div>

        <div className="modal-message-label">Mensaje:</div>
        <div className="modal-message">{mensaje}</div>
      </div>
    </div>
  )
}

export default NotificacionModal