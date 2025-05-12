import { useState } from "react";
import PropTypes from "prop-types";
import { CheckCircle } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "./TercerPaso.css";
import { useParams} from "react-router-dom";
import axios from "axios";

function TercerPaso({ competidorId, onBack, onSubmit, onReset}) {
  // Ahora puedes usar el competidorId aquí
  /* console.log("ID del competidor en el tercer paso:", competidorId); */
  const [cantidadTutores, setCantidadTutores] = useState(1);
  const [tutores, setTutores] = useState([
    { nombres: "", apellidos: "", correo_electronico: "", telefono: "", ci: "", relacion: "" },
    { nombres: "", apellidos: "", correo_electronico: "", telefono: "", ci: "", relacion: "" },
  ]);
  const tutoresFinal = tutores.slice(0, cantidadTutores).map((t, i) => ({
    ...t,
    nivel_responsabilidad: i === 0 ? "principal" : "secundario"
  }));
  const [errors, setErrors] = useState([{}, {}]);
  const [exito, setExito] = useState(false);
  const { id} = useParams();

  const handleTutorChange = (index, e) => {
    const { name, value } = e.target;
    const nuevosTutores = [...tutores];
    nuevosTutores[index][name] = value;
    setTutores(nuevosTutores);
  };

  const validateTutor = (tutor) => {
    const err = {};
    if (tutor.nombres.trim().length < 3) err.nombres = "Mínimo 3 caracteres.";
    if (tutor.apellidos.trim().length < 6) err.apellidos = "Mínimo 6 caracteres.";
    if (!/\S+@\S+\.\S+/.test(tutor.correo_electronico)) err.correo = "Correo inválido.";
    if (tutor.telefono.trim().length < 7) err.telefono = "Mínimo 7 dígitos.";
    if (tutor.ci.trim().length < 7) err.ci = "Mínimo 7 caracteres.";
    if (!tutor.relacion) err.relacion = "Seleccione una relación.";
    return err;
  };

  const handleSubmit = async() => {
    const errores = tutores.slice(0, cantidadTutores).map(validateTutor);
    setErrors(errores);

    const tieneErrores = errores.some(err => Object.keys(err).length > 0);
    console.log({
      competidor_id: competidorId,
      tutores: tutoresFinal
    });
    if (!tieneErrores) {
      try {
        const response = await axios.post(
          `http://localhost:8000/api/tutor/${id}/registrar-tutores`,
          //{ tutores: tutores.slice(0, cantidadTutores) }
          { tutores: tutoresFinal,  competidor_id: competidorId }
        
        );
/*         console.log("Tutores registrados:", response.data); */
        setExito(true);
      } catch (error) {
        console.error("Error al registrar tutores:", error.response?.data || error.message);
  console.log("Detalles de error:", error.response?.data?.errors);
      }
    }
  };

  const generarBoletaPDF = async () => {
    try {
      const response = await axios.post(`http://127.0.0.1:8000/api/boleta/generar/${competidorId}`);
      const boletaData = response.data.boleta;
  
      // Asegurarse de que boletaData tiene los datos necesarios
      if (!boletaData || !boletaData.numero_boleta || !boletaData.nombre_pagador || !boletaData.monto_total) {
        console.error("Datos incompletos para generar la boleta:", boletaData);
        return;
      }
  
      const doc = new jsPDF();
  
      doc.setFontSize(10);
      doc.text("UNIVERSIDAD MAYOR DE SAN SIMON", 14, 10);
      doc.text("DIRECCION ADMINISTRATIVA Y FINANCIERA", 14, 15);
  
      doc.setFontSize(12);
      doc.setTextColor(255, 0, 0);
      doc.text(`Nro. ${boletaData.numero_boleta}`, 160, 15);
  
      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text("BOLETA DE PAGO", 105, 30, { align: "center" });
  
      //doc.setFontSize(12);
      //doc.text("Periodo :", 14, 45);
      //doc.text(periodo, 45, 45);
  
      doc.text("Área :", 14, 52);
      doc.text(boletaData.area || "No especificado", 45, 52);
  
      doc.text("Nombre :", 14, 59);
      doc.text(boletaData.nombre_pagador || "No especificado", 45, 59);  // Nombre del tutor
  
      doc.text("Monto Total (Bs) :", 14, 66);
      doc.text(boletaData.monto_total.toString() || "0", 60, 66);
  
      // Preparar los datos de los competidores para la tabla
      const bodyData = boletaData.competidores.map((c, i) => [
        `${i + 1}.`, 
        c.nombre,  // Nombre del competidor
        c.categoria || "No especificada",  // Si la categoría es nula o vacía, mostrar un valor por defecto
        c.monto.toFixed(2)  // Monto con 2 decimales
      ]);
  
      // Agregar la tabla con los competidores
      autoTable(doc, {
        startY: 75,
        head: [["Nro", "Nombre Competidor", "Categoría", "Monto"]],
        body: bodyData,
        styles: { fontSize: 10, cellPadding: 3 },
        headStyles: { fillColor: [255, 255, 255], textColor: 0 },
      });
  
      // Guardar el archivo PDF
      doc.save(`boleta_${boletaData.numero_boleta}.pdf`);
    } catch (error) {
      console.error("Error al generar boleta:", error.response?.data || error.message);
    }
  };
  
  const renderTutorCard = (index) => {
    const tutor = tutores[index];
    const err = errors[index] || {};

    return (
      <div className="tutor-card" key={index}>
        <div className="form-group">
          <label>Nombres:</label>
          <div className="form-control-wrapper">
            <input
              type="text"
              name="nombres"
              value={tutor.nombres}
              onChange={(e) => handleTutorChange(index, e)}
              className={err.nombres ? "input-error" : ""}
            />
            {err.nombres && <div className="error-message">{err.nombres}</div>}
          </div>
        </div>

        <div className="form-group">
          <label>Apellidos:</label>
          <div className="form-control-wrapper">
            <input
              type="text"
              name="apellidos"
              value={tutor.apellidos}
              onChange={(e) => handleTutorChange(index, e)}
              className={err.apellidos ? "input-error" : ""}
            />
            {err.apellidos && <div className="error-message">{err.apellidos}</div>}
          </div>
        </div>

        <div className="form-group">
          <label>Correo Electrónico:</label>
          <div className="form-control-wrapper">
            <input
              type="email"
              name="correo_electronico"
              value={tutor.correo_electronico}
              onChange={(e) => handleTutorChange(index, e)}
              className={err.correo ? "input-error" : ""}
            />
            {err.correo_electronico && <div className="error-message">{err.correo_electronico}</div>}
          </div>
        </div>

        <div className="form-group">
          <label>Teléfono:</label>
          <div className="form-control-wrapper">
            <input
              type="text"
              name="telefono"
              value={tutor.telefono}
              onChange={(e) => handleTutorChange(index, e)}
              className={err.telefono ? "input-error" : ""}
            />
            {err.telefono && <div className="error-message">{err.telefono}</div>}
          </div>
        </div>

        <div className="form-group">
          <label>CI:</label>
          <div className="form-control-wrapper">
            <input
              type="text"
              name="ci"
              value={tutor.ci}
              onChange={(e) => handleTutorChange(index, e)}
              className={err.ci ? "input-error" : ""}
            />
            {err.ci && <div className="error-message">{err.ci}</div>}
          </div>
        </div>

        <div className="form-group">
          <label>Relación con el competidor:</label>
          <div className="form-control-wrapper">
            <div className="radio-group">
              {["Padre", "Madre", "Profesor"].map((rel) => (
                <label key={rel}>
                  <input
                    type="radio"
                    name={`relacion-${index}`}
                    value={rel}
                    checked={tutor.relacion === rel}
                    onChange={(e) => handleTutorChange(index, {
                      target: { name: "relacion", value: e.target.value },
                    })}
                  />
                  {rel}
                </label>
              ))}
            </div>
            {err.relacion && <div className="error-message">{err.relacion}</div>}
          </div>
        </div>
      </div>
    );
  };

  const renderExito = () => (
    <div className="exito-container">
      <CheckCircle size={80} color="#3b82f6" strokeWidth={2} />
      <h2>¡Competidor inscrito con éxito!</h2>
      <button className="descargar-button" onClick={generarBoletaPDF}>
        Descargar Boleta
      </button>
      <button className="descargar-button"onClick={onReset}>
        Nueva inscripcion
      </button>
    </div>
  );

  return (
    <div className="tercer-paso-container">
      {exito ? (
        renderExito()
      ) : (
        <>
          <h2>Datos de Tutor (es)</h2>
          <div className="form-group">
            <label>Cantidad de tutores:</label>
            <select
              className="short-select"
              value={cantidadTutores}
              onChange={(e) => setCantidadTutores(Number(e.target.value))}
            >
              <option value={1}>1</option>
              <option value={2}>2</option>
            </select>
          </div>

          {renderTutorCard(0)}
          {cantidadTutores === 2 && renderTutorCard(1)}

          <div className="submit-button-container">
            <button className="submit-button cancel" onClick={onBack}>
              Volver
            </button>
            <button className="submit-button" onClick={handleSubmit}>
              Guardar
            </button>
          </div>
        </>
      )}
    </div>
  );
}

TercerPaso.propTypes = {
  competidorId: PropTypes.number.isRequired,
  onBack: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default TercerPaso;