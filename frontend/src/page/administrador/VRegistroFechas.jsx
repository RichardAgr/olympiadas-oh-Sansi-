import React, { useState } from "react";
import { Link } from "react-router-dom";  // Importamos Link
import "react-datepicker/dist/react-datepicker.css";  // Estilos de date picker
import "./VRegistroFechas.css";  // Importa los estilos específicos de la página
import logo from "../../assets/icono_oh_sansi.svg";
import notificacion from "../../assets/notificacion.svg";
import user from "../../assets/icon_user.svg"; // Importa los iconos desde la carpeta assets
import editarIcono from "../../assets/editar.svg";  // Cambiado el nombre aquí
import eliminarIcono from "../../assets/eliminar.svg";  // Cambiado el nombre aquí

const VRegistroFechas = () => {
  // Estado para las áreas de competencia (predeterminadas)
  const [areas, setAreas] = useState([
    {
     id: 1,
     nombre: "Astronomia - Astrofisica",
     fechaInscripcionInicio: new Date("2025-04-01"),
     fechaInscripcionFin: new Date("2025-04-10"),
     fechaCompetenciaInicio: new Date("2025-04-15"),
     fechaCompetenciaFin: new Date("2025-04-20"),
   },
   {
     id: 2,
     nombre: "Biologia",
     fechaInscripcionInicio: new Date("2025-04-05"),
     fechaInscripcionFin: new Date("2025-04-15"),
     fechaCompetenciaInicio: new Date("2025-04-18"),
     fechaCompetenciaFin: new Date("2025-04-22"),
   },
   {
     id: 3,
     nombre: "Fisica",
     fechaInscripcionInicio: null,
     fechaInscripcionFin: null,
     fechaCompetenciaInicio: null,
     fechaCompetenciaFin: null,
   },
   {
     id:4 ,
     nombre: "Informatica",
     fechaInscripcionInicio: new Date("2025-04-10"),
     fechaInscripcionFin: new Date("2025-04-20"),
     fechaCompetenciaInicio: new Date("2025-04-25"),
     fechaCompetenciaFin: new Date("2025-04-30"),
   },
   {
     id: 5,
     nombre: "Matematicas",
     fechaInscripcionInicio: null,
     fechaInscripcionFin: null,
     fechaCompetenciaInicio: null,
     fechaCompetenciaFin: null,
   },
   {
     id: 6,
     nombre: "Quimica",
     fechaInscripcionInicio: null,
     fechaInscripcionFin: null,
     fechaCompetenciaInicio: null,
     fechaCompetenciaFin: null,
   },
   {
     id: 7,
     nombre: "Robotica",
     fechaInscripcionInicio: null,
     fechaInscripcionFin: null,
     fechaCompetenciaInicio: null,
     fechaCompetenciaFin: null,
   },
  ]);

  const [busqueda, setBusqueda] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [fechaAEliminar, setFechaAEliminar] = useState(null);
  const [tipoFecha, setTipoFecha] = useState("");  // "inscripcion" o "competencia"

  const areasFiltradas = areas.filter(area =>
    area.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const handleEliminarFecha = (areaId, tipo) => {
    setTipoFecha(tipo);
    setFechaAEliminar(areaId);
    setShowModal(true);
  };

  const confirmarEliminacion = () => {
    setAreas(areas.map(area => {
      if (area.id === fechaAEliminar) {
        if (tipoFecha === "inscripcion") {
          area.fechaInscripcionInicio = null;
          area.fechaInscripcionFin = null;
        } else if (tipoFecha === "competencia") {
          area.fechaCompetenciaInicio = null;
          area.fechaCompetenciaFin = null;
        }
      }
      return area;
    }));
    setShowModal(false);
  };

  const cancelarEliminacion = () => {
    setShowModal(false);
  };

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
              <th>Fecha Competencia (Inicio - Fin)</th>
            </tr>
          </thead>
          <tbody>
            {areasFiltradas.map((area) => (
              <tr key={area.id}>
                <td>{area.nombre}</td>
                <td>
                  <div className="fechasInscripcion">
                    {area.fechaInscripcionInicio && area.fechaInscripcionFin ? (
                      `${area.fechaInscripcionInicio.toLocaleDateString()} - ${area.fechaInscripcionFin.toLocaleDateString()}`
                    ) : (
                      "Sin Asignar"
                    )}
                  </div>
                  <div className="acciones">
                    <Link to={`/editar-fecha-inscripcion/${area.id}`}>
                      <button className="boton-editar">
                        <img src={editarIcono} alt="Editar" className="icono_editar" />
                      </button>
                    </Link>
                    <button className="boton-eliminar" onClick={() => handleEliminarFecha(area.id, "inscripcion")}>
                      <img src={eliminarIcono} alt="Eliminar" className="icono-eliminar" />
                    </button>
                  </div>
                </td>
                <td>
                  <div className="fechasCompetencias">
                    {area.fechaCompetenciaInicio && area.fechaCompetenciaFin ? (
                      `${area.fechaCompetenciaInicio.toLocaleDateString()} - ${area.fechaCompetenciaFin.toLocaleDateString()}`
                    ) : (
                      "Sin Asignar"
                    )}
                  </div>
                  <div className="acciones">
                    <Link to={`/editar-fecha-competencia/${area.id}`}>
                      <button className="boton-editar">
                        <img src={editarIcono} alt="Editar" className="icono_editar" />
                      </button>
                    </Link>
                    <button className="boton-eliminar" onClick={() => handleEliminarFecha(area.id, "competencia")}>
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