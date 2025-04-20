import React, { useState, useEffect } from "react";
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

  useEffect(() => {
    axios.get("/src/tutores.json")
      .then((response) => {
        if (Array.isArray(response.data)) {
          setEstadoTutores(response.data);
        } else {
          console.error("La respuesta no es un arreglo");
        }
      })
      .catch((error) => {
        console.error("Error al cargar los tutores:", error);
      });
  }, []);

  const handleMostrarModal = (tutor) => {
    setTutorSeleccionado(tutor);
    setEsDeshabilitar(tutor.estado === 1);
    setModalShow(true);
  };

  const handleCloseModal = () => {
    setModalShow(false);
    setTutorSeleccionado(null);
    setDescripcion("");
  };

  const confirmarCambioEstado = (descripcion, tutorId) => {
    setEstadoTutores((prev) =>
      prev.map((tutor) =>
        tutor.id === tutorId
          ? { ...tutor, estado: tutor.estado === 1 ? 0 : 1 }
          : tutor
      )
    );
    handleCloseModal();
  };

  const filteredTutores = estadoTutores.filter((tutor) => {
    const nombreMatch = tutor.nombre.toLowerCase().includes(busqueda.toLowerCase());
    const estadoMatch =
      filtroEstado === ""
        ? true
        : filtroEstado === "activo"
        ? tutor.estado === 1
        : tutor.estado === 0;
    return nombreMatch && estadoMatch;
  });

  return (
    <div className="estado-tutores-container">
      <h1>Habilitar/Deshabilitar Tutores</h1>

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
              <th>Competidores Activos</th>
              <th>Deshabilitar/Habilitar</th>
            </tr>
          </thead>
          <tbody>
            {filteredTutores.map((tutor) => {
              const competidoresActivos = tutor.competidores?.filter((c) => c.estado === 1).length || 0;
              return (
                <tr key={tutor.id}>
                  <td>{tutor.nombre}</td>
                  <td>{tutor.estado === 1 ? "Activo" : "Inactivo"}</td>
                  <td>{competidoresActivos}</td>
                  <td>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={tutor.estado === 1}
                        onChange={() => handleMostrarModal(tutor)}
                      />
                      <span className="slider"></span>
                    </label>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modalShow && (
        <div className="modal1">
          <div className="modal2">
            <h2>¿Esta seguro de {esDeshabilitar ? "Deshabilitar Tutor" : "Habilitar Tutor"} a {tutorSeleccionado?.nombre}?</h2>
            {esDeshabilitar &&(
            <p><strong>Descripcion:</strong></p>
           )}
            {esDeshabilitar && (
              <textarea
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Escriba el motivo por el cual se deshabilita al tutor"
              />
            )}

            <div className="modal-buttons">
              <button className="cancelar" onClick={handleCloseModal}>Cancelar</button>
              <button className="enviar"
                onClick={() => {
                  if (esDeshabilitar && descripcion.trim() === "") {
                    alert("Debe escribir un motivo para deshabilitar al tutor.");
                    return;
                  }

                  if (esDeshabilitar) {
                    const notificacionData = {
                      responsable_id: 1,
                      tutor_id: tutorSeleccionado.id,
                      competidor_id: null,
                      asunto: "Deshabilitación de tutor",
                      mensaje: descripcion,
                      fecha_envio: new Date().toISOString().split("T")[0],
                      estado: 1,
                    };

                    axios.post("/src/notificaciones", notificacionData)
                      .then((res) => console.log("Notificación enviada:", res.data))
                      .catch((err) => console.error("Error al enviar notificación:", err));
                  }

                  confirmarCambioEstado(descripcion, tutorSeleccionado.id);
                }}
              >
                  Enviar  
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EstadoTutores;
