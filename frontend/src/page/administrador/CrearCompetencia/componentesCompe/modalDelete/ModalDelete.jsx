import "./modalDelete.css"

const ModalDelete = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Confirmar",
    cancelText = "Cancelar",
    type = "danger",
}) => {
    if (!isOpen) return null

  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  return (
    <div className="confirmOverlayCompCrear" onClick={onClose}>
      <div className="confirmContentCompCrear" onClick={(e) => e.stopPropagation()}>
        <div className="confirmHeaderCompCrear">
          <div className={`confirmIconCompCrear ${type}IconCompCrear`}>
            {type === "danger" && "⚠️"}
            {type === "warning" && "⚠️"}
            {type === "info" && "ℹ️"}
            {type === "success" && "✅"}
          </div>
          <h2 className="confirmTitleCompCrear">{title}</h2>
        </div>

        <div className="confirmBodyCompCrear">
          <p className="confirmMessageCompCrear">{message}</p>
        </div>

        <div className="confirmActionsCompCrear">
          <button onClick={onClose} className="confirmCancelCompCrear">
            {cancelText}
          </button>
          <button onClick={handleConfirm} className={`confirmButtonCompCrear ${type}ConfirmCompCrear`}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ModalDelete