// VentanaEmergente.jsx
import React from 'react';
import './VentanaEmergente.css';

const VentanaEmergente = ({ mensaje, onConfirm, onCancel, onClose }) => {
  return (
    <div className="ventana-emergente">
      <div className="contenido-ventana">
        <button className="btn-cerrar" onClick={onClose}>✖</button>
        <h2>{mensaje}</h2>
        <div className="botones">
          <button className="btn-confirmar" onClick={onConfirm}>Sí</button>
          <button className="btn-cancelar" onClick={onCancel}>No</button>
        </div>
      </div>
    </div>
  );
};

export default VentanaEmergente;