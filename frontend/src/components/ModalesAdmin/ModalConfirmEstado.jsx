import React from "react";
import "./ModalDelete.css"; // usamos el mismo CSS

function ModalConfirmEstado({ responsable, onCancel, onConfirm }) {
  if (!responsable) return null;

  const estaActivo = responsable.estado === 1;

  return (
    <div className="modal-overlayConfirmDelete">
      <div className="modalConfirmDelete">
        <h2>¡Confirmar cambio de estado!</h2>
        <p>
          ¿Estás segur@ de que deseas {estaActivo ? "desactivar" : "activar"} la cuenta del
          responsable <strong>{responsable.nombres} {responsable.apellidos}</strong>?
        </p>

        <div className="modal-buttonsConfirmDelete">
          <button
            className="btn-eliminar2ConfirmDelete"
            onClick={() => onConfirm(responsable)}
          >
            Sí, {estaActivo ? "desactivar" : "activar"}
          </button>
          <button
            className="btn-cancelar2ConfirmDelete"
            onClick={onCancel}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalConfirmEstado;

