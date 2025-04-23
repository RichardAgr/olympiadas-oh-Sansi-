import { useState, useEffect } from "react";
import axios from "axios";

function DetalleCompetidoresInscritos() {
  const [competidores, setCompetidores] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/detallesCompetidor")
      .then((res) => setCompetidores(res.data))
      .catch((err) => console.error("Error cargando datos:", err));
  }, []);

  const competidoresFiltrados = competidores.filter((comp) =>
    comp.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div>
      <h1>Detalle Competidores Inscritos</h1>
      <div className="buscador">
        <input
          type="text"
          placeholder="Buscar por nombre"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
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
            {competidoresFiltrados.map((comp, index) => (
              <tr key={index}>
                <td>{comp.nombre}</td>
                <td>{comp.colegio}</td>
                <td>{comp.ci}</td>
                <td>{comp.curso}</td>
                <td>{comp.estado}</td>
                <td>{comp.area}</td>
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
