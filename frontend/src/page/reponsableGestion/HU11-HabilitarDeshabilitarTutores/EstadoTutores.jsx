import { useState, useEffect } from "react";
import axios from "axios";
import Swal from 'sweetalert2';
import "./estilosResponsable.css";
import "./estadoTutor.css";

function EstadoTutores() {
  const [estadoTutores, setEstadoTutores] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");
  const [modalShow, setModalShow] = useState(false);
  const [tutorSeleccionado, setTutorSeleccionado] = useState(null);
  const [descripcion, setDescripcion] = useState("");
  const [esDeshabilitar, setEsDeshabilitar] = useState(true);
  const [loading, setLoading] = useState(false);
  const [descripcionError, setDescripcionError] = useState("");
  const user = JSON.parse(localStorage.getItem('user'));
  const competenciaId = user?.competencia_id;
  useEffect(() => {
    cargarTutores();
  }, []);

  const cargarTutores = () => {

    setLoading(true);
    axios.get(`http://127.0.0.1:8000/api/tutoresInformacion/${competenciaId}`)
      .then((response) => {
        if (Array.isArray(response.data)) {
          setEstadoTutores(response.data);
        } else {
          console.error("La respuesta no es un arreglo");
        }
      })
      .catch((error) => {
        console.error("Error al cargar los tutores:", error);
      })
      .finally(() => setLoading(false));
  };

  const handleMostrarModal = (tutor) => {
    setTutorSeleccionado(tutor);
    setEsDeshabilitar(tutor.estado === "activo");
    setModalShow(true);
  };

  const handleCloseModal = () => {
    setModalShow(false);
    setTutorSeleccionado(null);
    setDescripcion("");
    setDescripcionError("");
  };

  const countWords = (text) => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

 const actualizarEstadoTutor = async (tutorId, nuevoEstado, descripcion) => {
  try {
    setLoading(true);
    
    await axios.put(`http://127.0.0.1:8000/api/tutores/${tutorId}/estado`, {
      estado: nuevoEstado === "activo" ? true : false
    });

    if (nuevoEstado === "inactivo" && descripcion) {
      const notificacionData = {
        id_responsable: 1,
        id_tutorPrincipal: tutorId,
        id_competidor: null,
        asunto: "Deshabilitación de tutor",
        motivo: descripcion
      };
      await axios.post("http://127.0.0.1:8000/api/notificaciones", notificacionData); 
    }

    setEstadoTutores(prev =>
      prev.map(tutor =>
        tutor.tutor_id === tutorId
          ? { ...tutor, estado: nuevoEstado }
          : tutor
      )
    );

    // ✅ ALERTA de éxito
    Swal.fire({
      icon: 'success',
      title: `Tutor ${nuevoEstado === 'activo' ? 'habilitado' : 'deshabilitado'} correctamente`,
      showConfirmButton: false,
      timer: 2000
    });

    handleCloseModal();
  } catch (error) {
    console.error("Error al actualizar el tutor:", error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Ocurrió un error al actualizar el tutor'
    });
  } finally {
    setLoading(false);
  }
};


  const filteredTutores = estadoTutores.filter((tutor) => {
    const nombreMatch = tutor.nombres.toLowerCase().includes(busqueda.toLowerCase());
    const estadoMatch =
      filtroEstado === ""
        ? true
        : filtroEstado === "activo"
        ? tutor.estado === "activo"
        : tutor.estado === "inactivo";
    return nombreMatch && estadoMatch;
  });

  const handleConfirmAction = () => {
    if (esDeshabilitar) {
      if (!descripcion.trim()) {
        setDescripcionError("Por favor, describa el motivo de la deshabilitación");
        return;
      }
      
      const wordCount = countWords(descripcion);
      if (wordCount < 3) {
        setDescripcionError(`El mensaje debe contener al menos 3 palabras. Actualmente tiene ${wordCount} ${wordCount === 1 ? 'palabra' : 'palabras'}.`);
        return;
      }
    }
    
    const nuevoEstado = esDeshabilitar ? "inactivo" : "activo";
    actualizarEstadoTutor(tutorSeleccionado.tutor_id, nuevoEstado, descripcion);
  };

  return (
    <div className="estado-tutores-container">
      <h1>Habilitar/Deshabilitar Tutores</h1>

      {loading && <div className="loading">Cargando...</div>}

      <div
  className="buscador-Habilitar-desabilitar-warpper"
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    gap: "10px" // separación entre input y select
  }}
> 
  <input
    type="text"
    placeholder="Buscar por nombre"
    value={busqueda}
    onChange={(e) => setBusqueda(e.target.value)}
    className="buscador-Habilitar-desabilitar-input"
    style={{
      flexGrow: 1,
      maxWidth: "70%",
    }}
  />

  <div className="filtro-estado" style={{ minWidth: "150px" }}>
    <select
      className="seleccionadorDesplegable"
      value={filtroEstado}
      onChange={(e) => setFiltroEstado(e.target.value)}
      style={{ width: "100%" }}
    >
      <option value="">Todos</option>
      <option value="activo">Activos</option>
      <option value="inactivo">Inactivos</option>
    </select>
  </div>
</div>

      <div className="contenedor-tabla-Responsable">
        <table className="tabla">
          <thead>
            <tr>
              <th>Nombre del Tutor</th>
              <th>Estado</th>
              <th>Competidores Habilitados</th>
              <th>Competidores Deshabilitados</th>
              <th>Deshabilitar/Habilitar</th>
            </tr>
          </thead>
          <tbody>
            {filteredTutores.map((tutor) => (
              <tr key={tutor.tutor_id}>
                <td>{tutor.nombres} {tutor.apellidos}</td>
                <td>
                  <span className={`badge ${tutor.estado === 'activo' ? 'activo' : 'inactivo'}`}>
                    {tutor.estado}
                  </span>
                </td>
                <td>{tutor.competidores_habilitados || 0}</td>
                <td>{tutor.competidores_deshabilitados || 0}</td>
                <td>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={tutor.estado === "activo"}
                      onChange={() => handleMostrarModal(tutor)}
                      disabled={loading}
                    />
                    <span className="slider round"></span>
                  </label>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de confirmación */}
      {modalShow && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>
              ¿Está seguro de {esDeshabilitar ? "deshabilitar" : "habilitar"} al tutor 
              {tutorSeleccionado && ` ${tutorSeleccionado.nombres} ${tutorSeleccionado.apellidos}`}?
            </h2>
            
            {esDeshabilitar && (
              <>
                <p><strong>Descripción:</strong></p>
                <textarea
                  value={descripcion}
                  onChange={(e) => {
                    setDescripcion(e.target.value);
                    setDescripcionError("");
                  }}
                  placeholder="Escriba el motivo por el cual se deshabilita al tutor"
                  required
                />
                {descripcionError && <div className="error-message">{descripcionError}</div>}
              </>
            )}

            <div className="modal-actions">
              <button 
                className="btn-cancelar" 
                onClick={handleCloseModal}
                disabled={loading}
              >
                Cancelar
              </button>
              <button 
                className="btn-confirmar"
                onClick={handleConfirmAction}
                disabled={loading}
              >
                {loading ? 'Procesando...' : 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EstadoTutores;