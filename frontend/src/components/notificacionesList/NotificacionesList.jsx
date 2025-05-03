import { useState } from "react"
import NotificacionItem from "./NotificacionItem"
import NotificacionModal from "./NotificacionModal"
import "./notificacionesList.css"

const NotificacionesList = ({ notificaciones, setNotificaciones }) => {

    const [modalNotificacion, setModalNotificacion] = useState(null)

    const handleOpenModal = (notificacion) => {
        setModalNotificacion(notificacion)
      }
    
      const handleCloseModal = () => {
        setModalNotificacion(null)
      }

  if (!notificaciones.length) {
    return <p className="no-notificaciones">No hay notificaciones disponibles</p>
  }

  return (
    <div className="notificaciones-list">
      {notificaciones.map((notificacion) => (
        <NotificacionItem
          key={notificacion.notificacion_id}
          notificacion={notificacion}
          setNotificaciones={setNotificaciones}
          onOpenModal={handleOpenModal}
        />
      ))}

{modalNotificacion && <NotificacionModal notificacion={modalNotificacion} onClose={handleCloseModal} />}
    </div>
  )
}

export default NotificacionesList