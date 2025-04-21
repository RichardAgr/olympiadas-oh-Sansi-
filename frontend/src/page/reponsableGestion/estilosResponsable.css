import React, { useState } from "react";
import "./estilosResponsable.css";

function EstadoTutores() {
  const [estadoTutores, setEstadoTutores] = useState([
    { id: 1, nombre: "Tutor 1", estado: true },
    { id: 2, nombre: "Tutor 2", estado: false },
  ]);

  const toggleEstado = (id) => {
    setEstadoTutores((prev) =>
      prev.map((tutor) =>
        tutor.id === id ? { ...tutor, estado: !tutor.estado } : tutor
      )
    );
  };

  return (
    <div className="estado-tutores-container">
      <h1>Habilitar/Deshabilitar Tutores</h1>

      {/* Buscador + Filtro */}
      <div className="buscador">
        <input type="text" placeholder="Buscar por nombre" />
      </div>

      {/* Seleccionador Desplegable */}
      <select className="seleccionadorDesplegable" defaultValue="">
        <option value="" disabled>
          -- Ninguno --
        </option>
        <option value="todos">Todos</option>
        <option value="opcion2">Opción 2</option>
        <option value="opcion3">Opción 3</option>
      </select>

      {/* Tabla */}
      <div className="contenedor-tabla">
        <table className="tabla">
          <thead>
            <tr>
              <th>Nombre del Tutor</th>
              <th>Estado</th>
              <th>Competidores Activos</th>
              <th>Descripción de Estado</th>
              <th>Deshabilitar/Habilitar</th>
            </tr>
          </thead>
          <tbody>
            {estadoTutores.map((tutor) => (
              <tr key={tutor.id}>
                <td>{tutor.nombre}</td>
                <td>{tutor.estado ? "Activo" : "Inactivo"}</td>
                <td>0</td>
                <td>{tutor.estado ? "Disponible para asignar" : "Deshabilitado"}</td>
                <td>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={tutor.estado}
                      onChange={() => toggleEstado(tutor.id)}
                    />
                    <span className="slider"></span>
                  </label>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default EstadoTutores;
