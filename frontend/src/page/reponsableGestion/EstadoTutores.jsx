import { useState, useEffect } from "react";
import axios from "axios";
import "./estilosResponsable.css";

function EstadoTutores() {
  const [estadoTutores, setEstadoTutores] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");
  const [modalShow, setModalShow] = useState(false);
  const [tutorSeleccionado, setTutorSeleccionado] = useState(null);
  const [descripcion, setDescripcion] = useState("");
  const [esDeshabilitar, setEsDeshabilitar] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    cargarTutores();
  }, []);

  const cargarTutores = () => {
    setLoading(true);
    axios.get("http://127.0.0.1:8000/api/tutoresInformacion")
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
  };

  const actualizarEstadoTutor = async (tutorId, nuevoEstado, descripcion) => {
    try {
      setLoading(true);
      
      await axios.put(`http://127.0.0.1:8000/api/tutores/${tutorId}/estado`, {
        estado: nuevoEstado==="activo"?true:false
      })

      // 2. Si es deshabilitar, enviar notificación
      if (nuevoEstado === "inactivo" && descripcion) {
        const notificacionData = {
          id_responsable: 1, // ID del responsable actual (ajustar según tu sistema)
          id_tutorPrincipal: tutorId,
          id_competidor:null,
          asunto: "Deshabilitación de tutor",
          motivo: descripcion
        };
        console.log(notificacionData)
        await axios.post("http://127.0.0.1:8000/api/notificaciones", notificacionData); 
      }

      setEstadoTutores(prev => 
        prev.map(tutor => 
          tutor.tutor_id === tutorId 
            ? { ...tutor, estado: nuevoEstado } 
            : tutor
        )
      );

      handleCloseModal();
    } catch (error) {
      console.error("Error al actualizar el tutor:", error);
      alert("Ocurrió un error al actualizar el tutor");
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

  return (
    <div className="estado-tutores-container">
      <h1>Habilitar/Deshabilitar Tutores</h1>

      {loading && <div className="loading">Cargando...</div>}

      <div className="buscador">
        <input
          type="text"
          placeholder="Buscar por nombre"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      <div className="filtro-estado">
        <select
          className="seleccionadorDesplegable"
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
        >
          <option value="">-- Todos --</option>
          <option value="activo">Activos</option>
          <option value="inactivo">Inactivos</option>
        </select>
      </div>

      <div className="contenedor-tabla">
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
                  onChange={(e) => setDescripcion(e.target.value)}
                  placeholder="Escriba el motivo por el cual se deshabilita al tutor"
                  required
                />
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
                onClick={() => {
                  if (esDeshabilitar && !descripcion.trim()) {
                    alert("Debe escribir un motivo para deshabilitar al tutor");
                    return;
                  }
                  
                  const nuevoEstado = esDeshabilitar ? "inactivo" : "activo";
                  actualizarEstadoTutor(tutorSeleccionado.tutor_id, nuevoEstado, descripcion);
                }}
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