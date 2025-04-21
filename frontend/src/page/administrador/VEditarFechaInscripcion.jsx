import { useState, useEffect } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import { useNavigate, useParams } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import es from "date-fns/locale/es";
import "./VEditarFecha.css";

registerLocale("es", es);

const VEditarFechaInscripcion = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { areaId } = useParams();

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/evento/fechas/${areaId}/inscripcion`);
        const data = await res.json();
        if (data) {
          const offsetMs = new Date().getTimezoneOffset() * 60000;
          if (data.inicio) setStartDate(new Date(Date.parse(data.inicio) + offsetMs));
          if (data.fin) setEndDate(new Date(Date.parse(data.fin) + offsetMs));
        }
      } catch (err) {
        console.error("Error loading existing dates", err);
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

    setError("");

    const body = {
      area_id: areaId,
      tipo: "inscripcion",
      nombre_evento: "Fecha de inscripción",
      inicio: new Date(startDate).toISOString().split("T")[0],
      fin: new Date(endDate).toISOString().split("T")[0],
    };
    console.log("Enviando a la API:", body);

    try {
      const res = await fetch("http://localhost:8000/api/evento/fechas", { //change to a global varaible
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const result = await res.json();
      console.log("✅ Guardado:", result);
      alert("Fecha de inscripción guardada con éxito ✅");
      navigate("/admin/Evento");
    } catch (error) {
      console.error("❌ Error al guardar fechas:", error);
    }
  };

  return (
    <div className="fecha-container">
      <h2>Fecha de Inscripción</h2>
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

export default VEditarFechaInscripcion;
