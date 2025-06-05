import { useEffect } from "react"
import { CheckCircle, AlertCircle, X } from "lucide-react"
import "./notificacion.css"

const Notificacion = ({ message, type = "success", onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, 5000)

    return () => clearTimeout(timer)
  }, [onClose])

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle size={20} />
      case "error":
        return <AlertCircle size={20} />
      default:
        return <CheckCircle size={20} />
    }
  }

  return (
    <div className={`notificationEventA ${type}EventA`}>
      <div className="notification-contentEventA">
        <div className="notification-iconEventA">{getIcon()}</div>
        <span className="notification-messageEventA">{message}</span>
        <button className="notification-closeEventA" onClick={onClose}>
          <X size={16} />
        </button>
      </div>
    </div>
  )
}

export default Notificacion
