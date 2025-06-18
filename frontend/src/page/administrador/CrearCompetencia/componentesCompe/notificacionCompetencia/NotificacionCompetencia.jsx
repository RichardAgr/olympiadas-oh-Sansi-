import { useState, useEffect } from "react"
import "./notificacionCompetencia.css"

const NotificacionCompetencia = ({ message, type, onClose, duration = 3000 }) => {
    const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onClose, 300) // Esperar a que termine la animación
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, 300)
  }

  return (
    <div
      className={`notificationCompCrear ${type}NotificationCompCrear ${isVisible ? "showNotificationCompCrear" : "hideNotificationCompCrear"}`}
    >
      <div className="notificationContentCompCrear">
        <div className="notificationIconCompCrear">
          {type === "success" && "✅"}
          {type === "error" && "❌"}
          {type === "warning" && "⚠️"}
          {type === "info" && "ℹ️"}
        </div>
        <span className="notificationMessageCompCrear">{message}</span>
        <button onClick={handleClose} className="notificationCloseCompCrear">
          ✕
        </button>
      </div>
    </div>
  )
}

export default NotificacionCompetencia