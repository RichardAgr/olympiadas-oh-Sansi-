import NotificacionItem from "./NotificacionItem"
import "./notificacionesList.css"

const NotificacionesList = ({ notificaciones, setNotificaciones }) => {
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
        />
      ))}
    </div>
  )
}

export default NotificacionesList