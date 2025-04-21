import React, { useState, useEffect } from "react";
import axios from "axios";

function DetalleCompetidoresInscritos() {
  const [competidores, setCompetidores] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [cursoSeleccionado, setCursoSeleccionado] = useState("");

  const cursos = [
    "-- Todos --",
    "1ro Primaria",
    "2ro Primaria", 
    "3ro Primaria",
    "4to Primaria",
    "5to Primaria",
    "6to Primaria",
    "1ro Secundaria",
    "2ro Secundaria",
    "3ro Secundaria", 
    "4to Secundaria",
    "5to Secundaria",
    "6to Secundaria"
  ];

  useEffect(() => {
    axios
      .get("/src/competidores.json")
      .then((res) => setCompetidores(res.data))
      .catch((err) => console.error("Error cargando datos:", err));
  }, []);

  const competidoresFiltrados = competidores.filter((comp) => {
    const search = busqueda.toLowerCase();
    const matchNombreCI =
      comp.nombre.toLowerCase().includes(search) ||
      comp.ci.toLowerCase().includes(search);

    const matchCurso =
      cursoSeleccionado === "" ||
      cursoSeleccionado === "-- Todos --" ||
      comp.curso === cursoSeleccionado;

    return matchNombreCI && matchCurso;
  });

  return (
    <div>
      <h1>Detalle Competidores Inscritos</h1>

      <div className="buscador">
        <input
          type="text"
          placeholder="Buscar por nombre o CI"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      <div className="filtro-curso" style={{ marginTop: "12px", marginBottom: "20px" }}>
        <select
          className="filtro-select"
          value={cursoSeleccionado}
          onChange={(e) => setCursoSeleccionado(e.target.value)}
          style={{
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            fontSize: "14px",
            width: "100%",
            maxWidth: "300px"
          }}
        >
          {cursos.map((curso, idx) => (
            <option key={idx} value={curso}>
              {curso}
            </option>
          ))}
        </select>
      </div>

      <div className="contenedor-tabla">
        <table className="tabla">
          <thead>
            <tr>
              <th>Nombre Estudiante</th>
              <th>Colegio</th>
              <th>CI</th>
              <th>Curso</th>
              <th>Estado</th>
              <th>Competencia</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {competidoresFiltrados.map((comp) => (
              <tr key={comp.id}>
                <td>{comp.nombre}</td>
                <td>{comp.colegio}</td>
                <td>{comp.ci}</td>
                <td>{comp.curso}</td>
                <td>{comp.estado}</td>
                <td>{comp.competencia}</td>
                <td>{comp.fecha}</td>
              </tr>
            ))}
            {competidoresFiltrados.length === 0 && (
              <tr>
                <td colSpan="7">No se encontraron resultados.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DetalleCompetidoresInscritos;
