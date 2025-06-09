import { useState, useEffect } from "react";
import "./detalleCompetidoresInscritos.css";
import axios from "axios";


function DetalleCompetidoresInscritos() {
  const [competidores, setCompetidores] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const user = JSON.parse(localStorage.getItem('user'));
  const competenciaId = user?.competencia_id;

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/detallesCompetidor/${competenciaId}`)
      .then((res) => setCompetidores(res.data))
      .catch((err) => console.error("Error cargando datos:", err));
  }, []);

  const competidoresFiltrados = competidores.filter((comp) =>
    comp.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="container-detallesCompetidoresRespGesL">
      <h1 className="titulo-principalRespGesL">Detalle Competidores Inscritos</h1>
      
      <div className="buscador-containerRespGesL">
        <input
          type="text"
          className="input-buscadorRespGesL"
          placeholder="Buscar por nombre"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>
      
      <div className="tabla-contenedorRespGesL">
        <table className="tabla-estiloRespGesL">
          <thead className="tabla-cabeceraRespGesL">
            <tr>
              <th className="columna-nombreRespGesL">Nombre Estudiante</th>
              <th className="columna-colegioRespGesL">Colegio</th>
              <th className="columna-ciRespGesL">CI</th>
              <th className="columna-cursoRespGesL">Curso</th>
              <th className="columna-estadoRespGesL">Estado</th>
              <th className="columna-competenciaRespGesL">Competencia</th>
              <th className="columna-fechaRespGesL">Fecha</th>
            </tr>
          </thead>
          <tbody className="tabla-cuerpoRespGesL">
            {competidoresFiltrados.map((comp, index) => (
              <tr key={index} className="fila-datosRespGesL">
                <td className="celda-nombreRespGesL">{comp.nombre}</td>
                <td className="celda-colegioRespGesL">{comp.colegio}</td>
                <td className="celda-ciRespGesL">{comp.ci}</td>
                <td className="celda-cursoRespGesL">{comp.curso}</td>
                <td className={`celda-estadoRespGesL ${comp.estado.toLowerCase()}`}>
                  {comp.estado}
                </td>
                <td className="celda-competenciaRespGesL">{comp.area}</td>
                <td className="celda-fechaRespGesL">{comp.fecha}</td>
              </tr>
            ))}
            {competidoresFiltrados.length === 0 && (
              <tr className="fila-vaciaRespGesL">
                <td colSpan="7" className="mensaje-vacioRespGesL">
                  No se encontraron resultados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DetalleCompetidoresInscritos;
