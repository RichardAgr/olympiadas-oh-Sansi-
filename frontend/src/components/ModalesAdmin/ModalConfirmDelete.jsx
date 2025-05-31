
import "./ModalDelete.css";

const ModalConfirmDelete = ({ areaName, responsable, onConfirm, onCancel }) => {
  // Determinar el texto a mostrar
  const nombreMostrado = responsable
    ? `${responsable.nombres} ${responsable.apellidos}`
    : areaName;

    
  return (
    <div className="modal-overlayConfirmDelete">
      <div className="modalConfirmDelete">
        <p>
          ¿Está seguro de eliminar{" "}
          <strong>{`"${nombreMostrado}"`}</strong>?
        </p>
        <div className="modal-buttonsConfirmDelete">
          <button onClick={onCancel} className="btn-cancelar2ConfirmDelete">No</button>
          <button onClick={() => onConfirm(responsable || areaName)} className="btn-eliminar2ConfirmDelete">
            Sí
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalConfirmDelete;
