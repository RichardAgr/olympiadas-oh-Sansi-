import React from 'react';
import '../App.css'; // Asegúrate de que aquí esté el CSS necesario o agrégalo

const ModalConfirmDelete = ({ areaName, onConfirm, onCancel }) => {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="modal-close" onClick={onCancel}>✖</button>
        <p>¿Está seguro de eliminar <strong>{`"${areaName}"`}</strong>?</p>
        <div className="modal-buttons">
          <button onClick={onCancel} className="btn-cancelar">No</button>
          <button onClick={onConfirm} className="btn-eliminar">Sí</button>
        </div>
      </div>
    </div>
  );
};

export default ModalConfirmDelete;
