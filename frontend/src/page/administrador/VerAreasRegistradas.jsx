import "./VRegistroOrg.css";
import React, { useState } from "react";
import buscador from "../../assets/buscador.svg";
import { useLocation, useNavigate, Link } from "react-router-dom";
import "../../App.css";


const datosEjemplo = [
  { id: 1, area: "Astronomia y Astrofisica", nombreNivCat: "3p", grados: "3ro Primaria", costo: "15", fechInscripcion: "05/04/2025 - 07/06/2025", fechCompetencia:"05/04/2025 - 07/06/2025" }
];

const filasPorPagina = 4;


function RegistrarOrganizador() {
  const navigate = useNavigate(); 
    /**/
  const [search, setSearch] = useState(""); // Estado del buscador
  const location = useLocation();
  /*Para la tabla */
const [paginaActual, setPaginaActual] = React.useState(1);

// Filtrar datos según la búsqueda
const datosFiltrados = datosEjemplo.filter((dato) =>
    dato.area.toLowerCase().includes(search.toLowerCase())
  );
  

// Aplicar paginación sobre los datos filtrados
const totalPaginas = Math.ceil(datosFiltrados.length / filasPorPagina);
const indiceInicio = (paginaActual - 1) * filasPorPagina;
const indiceFin = indiceInicio + filasPorPagina;
const datosPagina = datosFiltrados.slice(indiceInicio, indiceFin);

const paginaAnterior = () => {
  if (paginaActual > 1) setPaginaActual(paginaActual - 1);
};

const paginaSiguiente = () => {
  if (paginaActual < totalPaginas) setPaginaActual(paginaActual + 1);
};
  return (
    
    <div className="home-container">
        <h1>Areas Registradas</h1>
        <div className="buscador">
        <button className="boton-buscar">
        <img src={buscador} alt="Buscar" /> </button>
          <input
            type="text"
            placeholder="Buscar por nombre"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="contenedor-tabla">
      <table className="tabla">
        <thead>
          <tr>
            <th>Area</th>
            <th>Nombre Nivel/Categoria</th>
            <th>Grados</th>
            <th>Costo (Bs)</th>
            <th>Fecha Inscripcion Inicio-Fin</th>
            <th>Fecha Competencia Inicio-Fin</th>
          </tr>
        </thead>
        <tbody>
          {[...datosPagina, ...Array(Math.max(0, filasPorPagina - datosPagina.length)).fill({})].map((dato, index) => (
            <tr key={index}>
              <td>{dato.area || ""}</td>
              <td>{dato.nombreNivCat || ""}</td>
              <td>{dato.grados || ""}</td>
              <td>{dato.costo || ""}</td>
              <td>{dato.fechInscripcion || ""}</td>
              <td>{dato.fechCompetencia}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
  <button onClick={() => setPaginaActual(paginaActual - 1)} disabled={paginaActual === 1}>{"<"}</button>
  {Array.from({ length: totalPaginas }, (_, i) => (
    <button
      key={i}
      onClick={() => setPaginaActual(i + 1)}
      className={paginaActual === i + 1 ? "active" : ""}
    >
      {i + 1}
    </button>
  ))}
  <button onClick={() => setPaginaActual(paginaActual + 1)} disabled={paginaActual === totalPaginas}>{">"}</button>
</div>

    </div>
        
    </div>
  );
}
export default RegistrarOrganizador;