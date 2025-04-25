import { X } from "lucide-react"
import "./alertMessage.css"

const AlertModal = ({ isOpen, onClose, message }) => {
  if (!isOpen) return null

  return (
    <div className="alert-overlay" onClick={onClose}>
      <div className="alert-container" onClick={(e) => e.stopPropagation()}>
        <div className="alert-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <div className="alert-content">
          <h3>Aviso</h3>
          <p>{message}</p>
        </div>
        <button className="alert-close" onClick={onClose}>
          <X size={20} />
        </button>
      </div>
    </div>
  )
}

export default AlertModal
