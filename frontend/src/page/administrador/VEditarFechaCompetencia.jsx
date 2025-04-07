import React, { useState, useEffect } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import { useNavigate, useParams } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import es from "date-fns/locale/es";
import "./VEditarFecha.css";

registerLocale("es", es);

// ✅ FIX: Safe date parser avoiding timezone shifting
const parseDateSafely = (iso) => {
  if (!iso) return null;
  const [year, month, day] = iso.split("T")[0].split("-");
  return new Date(`${year}-${month}-${day}T00:00:00`);
};

const VEditarFechaCompetencia = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const navigate = useNavigate();
  const { areaId, competenciaId } = useParams();

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/evento/fechas/${areaId}/competencia`);
        const data = await res.json();

        if (data?.inicio && data?.fin) {
          setStartDate(parseDateSafely(data.inicio));
          setEndDate(parseDateSafely(data.fin));
        }
      } catch (err) {
        console.error("Error loading competencia date:", err);
      }
    };
    loadData();
  }, [areaId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (startDate && endDate && endDate < startDate) {
      alert("Seleccione una fecha correcta ❌");
      return;
    }

    const body = {
      area_id: areaId,
      tipo: "competencia",
      nombre_evento: "Fecha de competencia",
      inicio: startDate.toISOString().split("T")[0],
      fin: endDate.toISOString().split("T")[0],
    };

    try {
      const res = await fetch("http://localhost:8000/api/evento/fechas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const result = await res.json();
      console.log("✅ Guardado:", result);

      alert("Fecha de competencia guardada con éxito ✅");
      navigate("/admin/Evento");
    } catch (error) {
      console.error("❌ Error al guardar fechas:", error);
    }
  };

  return (
    <div className="fecha-container">
      <h2>Fecha de Competencia</h2>
      <form onSubmit={handleSubmit}>
        <div className="calendar-wrapper">
          <div className="date-group">
            <label>Inicio:</label>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              dateFormat="dd/MM/yyyy"
              locale="es"
              monthsShown={2}
              placeholderText="Selecciona fecha"
              className="styled-datepicker"
            />
          </div>

          <div className="date-group">
            <label>Finaliza:</label>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              dateFormat="dd/MM/yyyy"
              locale="es"
              monthsShown={2}
              placeholderText="Selecciona fecha"
              className="styled-datepicker"
            />
          </div>
        </div>

        <div className="btn-wrapper">
          <button type="button" className="btn-back" onClick={() => navigate(-1)}>
            Atrás
          </button>
          <button type="submit" className="btn-save">
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
};

export default VEditarFechaCompetencia;