import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarDays, MapPin } from "lucide-react";
import "./VEvento.css";

const formatDate = (isoString) => {
  if (!isoString) return "Sin Asignar";
  const [year, month, day] = isoString.split("T")[0].split("-");
  return `${day}/${month}/${year}`;
};

const VEvento = () => {
  const [areas, setAreas] = useState([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const itemsPorPagina = 3;

  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/evento/fechas");
      const data = await res.json();
      setAreas(data);
    } catch (err) {
      console.error("Error fetching areas:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalPaginas = Math.ceil(areas.length / itemsPorPagina);
  const startIndex = (paginaActual - 1) * itemsPorPagina;
  const endIndex = startIndex + itemsPorPagina;
  const areasPaginadas = areas.slice(startIndex, endIndex);

  return (
    <div className="evento-grid-container">
      <h2 className="evento-title">Próximos eventos</h2>

      <div className="evento-card-grid">
        {areasPaginadas.map((area) => (
          <div className="evento-card" key={area.id}>
            {/* Placeholder for Area Image */}
            <div className="evento-image-placeholder" />

            <h3 className="evento-nombre">{area.nombre}</h3>

            {/* Fecha de Inscripción */}
            <div className="evento-info-group">
              <p className="evento-info-label">Fecha de Inscripción:</p>
              <div className="evento-icon-row"
                onClick={() =>
                  navigate(`/admin/Evento/FechaInscripcion/${area.id}/null`)
                }
              >
 
                <CalendarDays size={20} className="evento-icon clickable calendar" />
                <span className="evento-info-value">
                  {area.fechas_inscripcion?.inicio
                    ? `${formatDate(area.fechas_inscripcion.inicio)} - ${formatDate(area.fechas_inscripcion.fin)}`
                    : "Sin Asignar"}
                </span>
              </div>
            </div>

            {/* Fecha de Competencia */}
            <div className="evento-info-group">
              <p className="evento-info-label">Fecha de Competencia:</p>
              <div
                className="evento-icon-row"
                onClick={() => {
                  const competenciaId = area.competencia_id ?? "null";
                  navigate(`/admin/Evento/FechaCompetencia/${area.id}/${competenciaId}`);
                }}
              >
                <CalendarDays size={20} className="evento-icon clickable calendar" />
                <span className="evento-info-value">
                  {area.fechas_competencia?.inicio
                    ? `${formatDate(area.fechas_competencia.inicio)} - ${formatDate(area.fechas_competencia.fin)}`
                    : "Sin Asignar"}
                </span>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button
          onClick={() => setPaginaActual(paginaActual - 1)}
          disabled={paginaActual === 1}
        >
          {"<"}
        </button>
        {Array.from({ length: totalPaginas }, (_, i) => (
          <button
            key={i}
            onClick={() => setPaginaActual(i + 1)}
            className={paginaActual === i + 1 ? "active" : ""}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() => setPaginaActual(paginaActual + 1)}
          disabled={paginaActual === totalPaginas}
        >
          {">"}
        </button>
      </div>
    </div>
  );
};

export default VEvento;
