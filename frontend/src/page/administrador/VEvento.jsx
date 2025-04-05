import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Edit, Trash2 } from "lucide-react";
import "./VEvento.css";

const formatDate = (isoString) => {
  if (!isoString) return "Sin fecha";
  const [year, month, day] = isoString.split("T")[0].split("-");
  return `${day}/${month}/${year}`;
};

const VEvento = () => {
  const [areas, setAreas] = useState([]);
  const [search, setSearch] = useState(""); 
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

  const filteredAreas = areas.filter((area) =>
    area.nombre.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="evento-container">
      <h2>Registrar Fechas</h2>

      <input
        className="search"
        placeholder="Buscar por nombre de Área o Categoría"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
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
          {/* ✅ Use filteredAreas instead of full areas */}
          {filteredAreas.map((area) => (
            <tr key={area.id}>
              <td>{area.nombre}</td>

              {/* INSCRIPCIÓN */}
              <td>
                <div className="fecha-bloque">
                  <span>
                    {area.fechas_inscripcion?.inicio
                      ? `${formatDate(area.fechas_inscripcion.inicio)} - ${formatDate(area.fechas_inscripcion.fin)}`
                      : "Sin Asignar"}
                  </span>
                  <button
                    className="icon-btn"
                    onClick={() => navigate(`/admin/Evento/FechaInscripcion/${area.id}/null`)}
                  >
                    <Edit size={20} color="white" />
                  </button>
                  <button
                    className="icon-btn"
                    onClick={() => deleteFechas(area.id, "inscripcion")}
                  >
                    <Trash2 size={20} color="white" />
                  </button>
                </div>
              </td>

              {/* COMPETENCIA */}
              <td>
                <div className="fecha-bloque">
                  <span>
                    {area.fechas_competencia?.inicio
                      ? `${formatDate(area.fechas_competencia.inicio)} - ${formatDate(area.fechas_competencia.fin) || "Sin fecha"}`
                      : "Sin Asignar"}
                  </span>
                  <button
                    className="icon-btn"
                    onClick={() =>
                      navigate(`/admin/Evento/FechaCompetencia/${area.id}/${area.competencia_id}`)
                    }
                  >
                    <Edit size={20} color="white" />
                  </button>
                  <button
                    className="icon-btn"
                    onClick={() => deleteFechas(area.id, "competencia")}
                  >
                    <Trash2 size={20} color="white" />
                  </button>
                </div>
              </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VEvento;
