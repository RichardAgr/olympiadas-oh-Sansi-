import  { useState, useEffect } from "react";
import { Link } from "react-router-dom";  // Importamos Link
import "react-datepicker/dist/react-datepicker.css";  // Estilos de date picker
import "./VRegistroFechas.css";  // Importa los estilos específicos de la página
import logo from "../../assets/icono_oh_sansi.svg";
import notificacion from "../../assets/notificacion.svg";
import user from "../../assets/icon_user.svg"; // Importa los iconos desde la carpeta assets
import editarIcono from "../../assets/editar.svg";  // Cambiado el nombre aquí
import eliminarIcono from "../../assets/eliminar.svg";  // Cambiado el nombre aquí
import axiosInstance from "../../interceptor/interceptor";
import { ENDPOINTS } from "../../api/constans/endpoints";

const VRegistroFechas = () => {
  // Estado para las áreas de competencia
  const [areas, setAreas] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [fechaAEliminar, setFechaAEliminar] = useState(null);
  const [tipoFecha, setTipoFecha] = useState("");  // "inscripcion" o "competencia"

  useEffect(() => {
    const fetchAreas = async () => {
      try {
        // 🔹 Primero, obtener todas las áreas
        const response = await axiosInstance.get(ENDPOINTS.GET_AREAS);
        console.log("Respuesta completa de áreas:", response);
  
        if (Array.isArray(response.data)) {
          setAreas(response.data); // ✅ Mantiene las áreas originales
        } else {
          console.error("La API no devolvió un array:", response.data);
        }
      } catch (error) {
        console.error("Error al obtener áreas:", error);
      }
    };
  
    fetchAreas();
  }, []);
  
  useEffect(() => {
    const fetchFechas = async () => {
      try {
        // 🔹 Obtener todas las fechas registradas en la BD para cada área
        const areasConFechas = await Promise.all(
          areas.map(async (area) => {
            try {
              const cronogramaResponse = await axiosInstance.get(`${ENDPOINTS.GET_CRONOGRAMA}/${area.area_id}`);
              const competenciaResponse = await axiosInstance.get(`${ENDPOINTS.GET_COMPETENCIA}/${area.area_id}`);
  
              return {
                ...area,
                fechaInscripcionInicio: cronogramaResponse.data?.fecha_inicio || new Date().toISOString(),
                fechaInscripcionFin: cronogramaResponse.data?.fecha_fin || new Date().toISOString(),
                fechaCompetenciaInicio: competenciaResponse.data?.fecha_inicio || new Date().toISOString(),
              };
            } catch (error) {
              console.error(`Error al obtener fechas para el área ${area.area_id}:`, error);
              return area; // ✅ Si hay error, devuelve el área sin modificarla
            }
          })
        );
  
        setAreas(areasConFechas); // ✅ Mantiene las áreas y solo agrega las fechas
      } catch (error) {
        console.error("Error al obtener fechas:", error);
      }
    };
  
    if (areas.length > 0) {
      fetchFechas();
    }
  }, [areas]); // ✅ Se ejecuta cuando `areas` ya ha sido cargado
  
  console.log("Estado actual de áreas:", areas);
  
  const areasFiltradas = areas.filter((area) =>
    area.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const handleEliminarFecha = (areaId, tipo) => {
    setTipoFecha(tipo);
    setFechaAEliminar(areaId);
    setShowModal(true);
  };
  
  const confirmarEliminacion = () => {
    setAreas(areas.map(area => {
      if (area.area_id === fechaAEliminar) {
        if (tipoFecha === "inscripcion") {
          area.fechaInscripcionInicio = null;
          area.fechaInscripcionFin = null;
        } else if (tipoFecha === "competencia") {
          area.fechaCompetenciaInicio = null;
          
        }
      }
      return area;
    }));
    setShowModal(false);
  };
  
  const cancelarEliminacion = () => {
    setShowModal(false);
  };
  
  const formatoFecha = (fecha) => {
    // Si no hay fecha, mostramos la fecha actual en formato 0/00/0000
    return fecha ? new Date(fecha).toLocaleDateString() : new Date().toLocaleDateString();
  };
  console.log(areasFiltradas);  // Agrega este log para revisar el contenido de areasFiltradas
  
  return (
    <main className="contenedor">
      <header className="menu_superior">
        <div className="imagen_titulo">
          <img src={logo} alt="Logo O! SanSi" width="36" height="36" />
          <h2 className="titulo">O! SanSi</h2>
        </div>
        <div className="botones_menu">
          <button className="boton_inicio">Inicio</button>
          <button className="boton_roles">Roles</button>
          <button className="boton_competidores">Competidores</button>
          <button className="boton_evento">Evento</button>
          <img src={notificacion} alt="Notificación" width="25" height="25" />
          <div className="usuario_boton">
            <button className="boton_usuario">
              <img src={user} alt="Usuario" width="25" height="25" />
              Usuario
            </button>
          </div>
        </div>
      </header>
  
      <h2>Registrar Fecha</h2>
  
      <div className="barra_busqueda">
        <input
          type="text"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar por área o categoría"
        />
      </div>
  
      <div className="areas-table">
        <table>
          <thead>
            <tr>
              <th>Área</th>
              <th>Fecha Inscripción (Inicio - Fin)</th>
              <th>Fecha Competencia (Inicio)</th>
            </tr>
          </thead>
          <tbody>
            {areasFiltradas.map((area) => (
              <tr key={area.area_id}>
                <td>{area.nombre}</td>
                <td>
                  <div className="fechasInscripcion">
                    {area.fechaInscripcionInicio && area.fechaInscripcionFin ? (
                      `${formatoFecha(area.fechaInscripcionInicio)} - ${formatoFecha(area.fechaInscripcionFin)}`
                    ) : `${formatoFecha()} - ${formatoFecha()}`}
                  </div>
                  <div className="acciones">
                      <Link to={`/editar-fecha-inscripcion/${area.area_id}`}>
                        <button className="boton-editar">
                          <img src={editarIcono} alt="Editar" className="icono_editar" />
                        </button>
                      </Link>
                      <button className="boton-eliminar" onClick={() => handleEliminarFecha(area.area_id, "inscripcion")}>
                      <img src={eliminarIcono} alt="Eliminar" className="icono-eliminar" />
                    </button>
                  </div>
                </td>
                <td>
                  <div className="fechasCompetencias">
                    {area.fechaCompetenciaInicio? (
                      `${formatoFecha(area.fechaCompetenciaInicio)}`
                    ) : `${formatoFecha()} `}
                  </div>
                  <div className="acciones">
                    <Link to={`/editar-fecha-competencia/${area.area_id}`}>
                      <button className="boton-editar">
                        <img src={editarIcono} alt="Editar" className="icono_editar" />
                      </button>
                    </Link>
                    <button className="boton-eliminar" onClick={() => handleEliminarFecha(area.area_id, "competencia")}>
                      <img src={eliminarIcono} alt="Eliminar" className="icono-eliminar" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
  
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <button className="modal-close" onClick={cancelarEliminacion}>×</button>
            <h3>
              {tipoFecha === "inscripcion"
                ? "¿Está seguro de eliminar la fecha de inscripción?"
                : "¿Está seguro de eliminar la fecha de competencia?"}
            </h3>
            <div className="modal-botones">
              <button className="boton-no" onClick={cancelarEliminacion}>No</button>
              <button className="boton-si" onClick={confirmarEliminacion}>Sí</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default VRegistroFechas;