import { useEffect, useState } from "react";
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
  const [search, setSearch] = useState("");

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

  const filteredAreas = areas.filter((area) =>
    area.nombre.toLowerCase().includes(search.toLowerCase())
  );

  const totalPaginas = Math.ceil(filteredAreas.length / itemsPorPagina);
  const startIndex = (paginaActual - 1) * itemsPorPagina;
  const endIndex = startIndex + itemsPorPagina;
  const areasPaginadas = filteredAreas.slice(startIndex, endIndex);

  return (
    <div className="evento-grid-container">
      <h2 className="evento-title">Próximos eventos</h2>

      <input
        className="search"
        type="text"
        placeholder="Buscar por nombre de Área"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPaginaActual(1); 
        }}
      />

      <div className="evento-card-grid">
        {areasPaginadas.map((area) => (
          <div className="evento-card" key={area.id}>
            <div className="evento-image-placeholder" />

            <h3 className="evento-nombre">{area.nombre}</h3>

            <div className="evento-info-group">
              <p className="evento-info-label">Fecha de Inscripción:</p>
              <div
                className="evento-icon-row"
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

            <div className="evento-info-group">
              <p className="evento-info-label">Fecha de Culminacion:</p>
              <div
                className="evento-icon-row"
                onClick={() => {
                  const competenciaId = area.competencia_id ?? "null";
                  navigate(`/admin/Evento/FechaCompetencia/${area.id}/${competenciaId}`);
                }}
              >
                <CalendarDays size={20} className="evento-icon clickable calendar" />
                <span className="evento-info-value">
                  {area.fechas_fin?.inicio
                    ? `${formatDate(area.fechas_fin.inicio)} - ${formatDate(area.fechas_fin.fin)}`
                    : "Sin Asignar"}
                </span>
              </div>
            </div>

          </div>
        ))}
      </div>

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
