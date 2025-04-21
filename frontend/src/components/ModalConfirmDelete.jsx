import '../App.css';

const ModalConfirmDelete = ({ areaName, responsable, onConfirm, onCancel }) => {
  // Determinar el texto a mostrar
  const nombreMostrado = responsable
    ? `${responsable.nombres} ${responsable.apellidos}`
    : areaName;

    
  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="modal-close" onClick={onCancel}>✖</button>
        <p>
          ¿Está seguro de eliminar{" "}
          <strong>{`"${nombreMostrado}"`}</strong>?
        </p>
        <div className="modal-buttons">
          <button onClick={onCancel} className="btn-cancelar2">No</button>
          <button onClick={() => onConfirm(responsable || areaName)} className="btn-eliminar2">
            Sí
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalConfirmDelete;
