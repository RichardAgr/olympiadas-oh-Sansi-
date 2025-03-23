const ModalConfirm = ({ message, onConfirm, onCancel }) => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-2xl shadow-xl w-80">
          <p className="text-lg mb-6">{message}</p>
          <div className="flex justify-end gap-4">
            <button
              onClick={onCancel}
              className="px-4 py-1 border border-gray-400 rounded-lg hover:bg-gray-100"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  export default ModalConfirm;
  