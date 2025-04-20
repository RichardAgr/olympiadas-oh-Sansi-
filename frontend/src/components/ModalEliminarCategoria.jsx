import "./ModalEliminarCategoria.css";

function ModalEliminarCategoria({ categoria, onCancel, onConfirm }) {
  if (!categoria) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="cerrar" onClick={onCancel}>×</button>

        <h3>Confirmar eliminación de categoría</h3>
        <p className="mensaje">
          ¿Está seguro que desea eliminar esta categoría?
          <br />
          <span>Esta acción no se puede deshacer. La categoría será eliminada.</span>
        </p>

        <div className="detalles">
          <strong>Detalles de categoría:</strong>
          <div className="info">
            <div><span>Área:</span> {categoria.area?.nombre}</div>
            <div><span>Nivel/Categoría:</span> {categoria.nombre}</div>
          </div>
        </div>

        <div className="botones">
          <button className="cancelar" onClick={onCancel}>Cancelar</button>
          <button className="eliminar" onClick={onConfirm}>Eliminar Categoría</button>
        </div>
      </div>
    </div>
  );
}

export default ModalEliminarCategoria;
