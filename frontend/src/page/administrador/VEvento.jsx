import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./VEvento.css";

const VEvento = () => {
  const [areas, setAreas] = useState([]);
  const navigate = useNavigate();

  const formatDate = (isoString) => {
    if (!isoString) return "Sin fecha";
    const [year, month, day] = isoString.split("T")[0].split("-");
    return `${day}/${month}/${year}`;
  };

  const fetchData = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/evento/fechas");
      const data = await res.json();
      setAreas(data);
    } catch (err) {
      console.error("Error fetching areas:", err);
    }
  };

  const deleteFechas = async (areaId, tipo) => {
    try {
      await fetch("http://localhost:8000/api/evento/fechas", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ area_id: areaId, tipo }),
      });
      fetchData();
    } catch (err) {
      console.error("Error deleting dates:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="evento-container">
      <h2>Registrar Fechas</h2>

      <input
        className="search"
        placeholder="Buscar por nombre de Área o Categoría"
      />

      <table>
        <thead>
          <tr>
            <th>Área</th>
            <th>Fecha de Inscripción<br />Inicio - Fin</th>
            <th>Fecha de Competencia<br />Inicio - Fin</th>
          </tr>
        </thead>
        <tbody>
          {areas.map((area) => (
            <tr key={area.id}>
              <td>{area.nombre}</td>

              <td>
                {area.fechas_inscripcion?.inicio ? (
                  <>
                    {formatDate(area.fechas_inscripcion.inicio)} - {formatDate(area.fechas_inscripcion.fin)}
                    <button
                      className="icon-btn"
                      onClick={() => navigate(`/admin/Evento/FechaInscripcion/${area.id}/null`)}
                    >✏️</button>
                    <button
                      className="icon-btn"
                      onClick={() => deleteFechas(area.id, "inscripcion")}
                    >🗑️</button>
                  </>
                ) : (
                  <>
                    Sin Asignar
                    <button
                      className="icon-btn"
                      onClick={() => navigate(`/admin/Evento/FechaInscripcion/${area.id}/null`)}
                    >✏️</button>
                    <button
                      className="icon-btn"
                      onClick={() => deleteFechas(area.id, "inscripcion")}
                    >🗑️</button>
                  </>
                )}
              </td>

              <td>
                {area.fechas_competencia?.inicio ? (
                  <>
                    {formatDate(area.fechas_competencia.inicio)} - {formatDate(area.fechas_competencia.fin)}
                    <button
                      className="icon-btn"
                      onClick={() => navigate(`/admin/Evento/FechaInscripcion/${area.id}/${area.fechas_competencia.id || "null"}`)}
                    >✏️</button>
                    <button
                      className="icon-btn"
                      onClick={() => deleteFechas(area.id, "competencia")}
                    >🗑️</button>
                  </>
                ) : (
                  <>
                    Sin Asignar
                    <button
                      className="icon-btn"
                      onClick={() => navigate(`/admin/Evento/FechaInscripcion/${area.id}/null`)}
                    >✏️</button>
                    <button
                      className="icon-btn"
                      onClick={() => deleteFechas(area.id, "competencia")}
                    >🗑️</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VEvento;
