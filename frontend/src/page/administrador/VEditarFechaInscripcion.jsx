import React, { useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import es from "date-fns/locale/es"; // Import Spanish
import AdminTopBar from "../../components/AdminTopBar";
import AdminFooter from "../../components/AdminFooter";

import "./VEditarFecha.css";

// Register locale globally for the component
registerLocale("es", es);

const VEditarFechaInscripcion = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Saving:", { startDate, endDate });
  };

  return (
    <>
      <div className="fecha-container">
        <h2>Fecha de Inscripción</h2>
        <form onSubmit={handleSubmit}>
          <div className="calendar-wrapper">
            <div>
              <label>Inicio:</label>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                dateFormat="dd/MM/yyyy"
                locale="es"
                monthsShown={2} // Show two months
                placeholderText="Selecciona fecha"
              />
            </div>
            <div>
              <label>Finaliza:</label>
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                dateFormat="dd/MM/yyyy"
                locale="es"
                monthsShown={2}
                placeholderText="Selecciona fecha"
              />
            </div>
          </div>
          <div className="btn-wrapper">
            <button type="button" className="btn-back">Atrás</button>
            <button type="submit" className="btn-save">Guardar</button>
          </div>
        </form>
      </div>
    </>
  );
};

export default VEditarFechaInscripcion;
