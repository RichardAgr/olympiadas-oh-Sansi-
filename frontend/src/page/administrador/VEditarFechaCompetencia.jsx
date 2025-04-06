import React, { useState, useEffect } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import { useNavigate, useParams } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import es from "date-fns/locale/es";
import "./VEditarFecha.css";

// Set Spanish calendar
registerLocale("es", es);

const VEditarFechaCompetencia = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const { areaId, competenciaId } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!startDate || !endDate || endDate < startDate) {
      setError(true);
      return;
    }

    const body = {
      area_id: areaId,
      tipo: "competencia",
      nombre_evento: "Fecha de competencia",
      inicio: new Date(startDate).toISOString().split("T")[0],
      fin: new Date(endDate).toISOString().split("T")[0],
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
              onChange={(date) => {
                setStartDate(date);
                setError(false);
              }}
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
              onChange={(date) => {
                setEndDate(date);
                setError(false);
              }}
              dateFormat="dd/MM/yyyy"
              locale="es"
              monthsShown={2}
              placeholderText="Selecciona fecha"
              className={`styled-datepicker ${error ? "error-datepicker" : ""}`}
            />
          </div>
        </div>

        {error && (
          <p style={{ color: "red", fontWeight: "bold", marginBottom: "1rem" }}>
            Seleccione una fecha correcta
          </p>
        )}

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
