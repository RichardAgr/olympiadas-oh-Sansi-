import "./ModalAreaInfo.css"; 

const ModalAreaInfo = ({ area, onClose }) => {
  if (!area) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Información del Área</h2>
        <p><strong>Nombre:</strong> {area.nombre}</p>
        <p><strong>Descripción:</strong> {area.descripcion}</p>
       <p><strong>Costo: </strong>{area.costo}</p> 
        <button onClick={onClose} className="close-modal-btn">Cerrar</button>
      </div>
    </div>
  );
};

export default ModalAreaInfo;
