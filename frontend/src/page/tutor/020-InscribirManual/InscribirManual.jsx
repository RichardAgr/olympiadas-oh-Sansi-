import { useState } from "react";
import { useParams } from "react-router-dom";
import "./InscribirManual.css";
import SegundoPaso from "./SegundoPaso";
import TercerPaso from "./TercerPaso";
import axios from "axios";

function InscribirManual() {
  const {id}=useParams()
  const [competidorId, setCompetidorId] = useState(null);
  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    ci: "",
    fecha_nacimiento: "",
    colegio: "",
    curso: "",
    nivel: "",
    departamento: "",
    provincia: "",
    //area: "",
    //categoria: "",
    //rango: "",
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmitStep1 = (e) => {
    e.preventDefault();
    const newErrors = {};

    const soloLetrasRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;

  if (formData.nombres.trim().length < 3 || !soloLetrasRegex.test(formData.nombres)) {
    newErrors.nombres = "Nombre no válido.";
  }

  if (formData.apellidos.trim().length < 6 || !soloLetrasRegex.test(formData.apellidos)) {
    newErrors.apellidos = "Apellido no válido.";
  }

  if (formData.ci.trim().length < 7) {
    newErrors.ci = "CI no válido.";
  }

  if (formData.colegio.trim().length < 5 || !soloLetrasRegex.test(formData.colegio)) {
    newErrors.colegio = "Colegio no válido.";
  }

  if (formData.provincia.trim().length < 4 || !soloLetrasRegex.test(formData.provincia)) {
    newErrors.provincia = "Provincia no válida.";
  }

  if (!formData.curso) newErrors.curso = "Debe seleccionar un curso.";
  if (!formData.nivel) newErrors.nivel = "Debe seleccionar un nivel educativo.";
  if (!formData.departamento) newErrors.departamento = "Debe seleccionar un departamento.";

  const selectedYear = new Date(formData.fecha_nacimiento).getFullYear();
  const currentYear = new Date().getFullYear();
  if (!formData.fecha_nacimiento) {
    newErrors.fecha_nacimiento = "Debe ingresar una fecha de nacimiento.";
  } else if (selectedYear > currentYear - 5) {
    newErrors.fecha_nacimiento = "Fecha de nacimiento no válida.";
  }

    setErrors(newErrors);

    // Traducción básica de curso + nivel a grado_id (ajusta esto si tu backend usa otros ID)
const calcularGradoId = (nivel, curso) => {
  if (nivel === "Primaria") return Number(curso); // 1 a 6
  if (nivel === "Secundaria") return 6 + Number(curso); // 7 a 12
  return null;
};

const grado_id = calcularGradoId(formData.nivel, formData.curso);

// Validación extra (por si acaso)
if (!grado_id) {
  alert("No se pudo determinar el grado escolar.");
  return;
}

setFormData(prev => ({ ...prev, grado_id })); // 💡 Agregamos grado_id aquí

    if (Object.keys(newErrors).length === 0) {
      setCurrentStep(2);
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handlePaso2Next = (paso2Data, nuevoCompetidorId) => {
    setFormData((prev) => ({ ...prev, ...paso2Data }));
    setCompetidorId(Number(nuevoCompetidorId));
    setCurrentStep(3);
  };

  return (
    <div className="inscribir-manual-container">
      <h1 className="inscribir-manual-title">Inscripción Competidor</h1>

      {/* Pasos */}
      <div className="steps">
        <div className="step">
          <div className={`step-number ${currentStep === 1 ? "active" : ""}`}>01</div>
        </div>
        <div className="step-line"></div>
        <div className="step">
          <div className={`step-number ${currentStep === 2 ? "active" : ""}`}>02</div>
        </div>
        <div className="step-line"></div>
        <div className="step">
          <div className={`step-number ${currentStep === 3 ? "active" : ""}`}>03</div>
        </div>
      </div>

      {currentStep === 1 && (
        <form onSubmit={handleSubmitStep1} className="inscribir-manual-form">
          <div className="form-group">
            <label>Nombres del competidor:</label>
            <input
              type="text"
              name="nombres"
              value={formData.nombres}
              onChange={handleChange}
              className={errors.nombres ? "input-error" : ""}
            />
            {errors.nombres && <div className="error-message">{errors.nombres}</div>}
          </div>

          <div className="form-group">
            <label>Apellidos del competidor:</label>
            <input
              type="text"
              name="apellidos"
              value={formData.apellidos}
              onChange={handleChange}
              className={errors.apellidos ? "input-error" : ""}
            />
            {errors.apellidos && <div className="error-message">{errors.apellidos}</div>}
          </div>

          <div className="form-group">
            <label>CI del competidor:</label>
            <input
              type="text"
              name="ci"
              value={formData.ci}
              onChange={handleChange}
              className={errors.ci ? "input-error" : ""}
            />
            {errors.ci && <div className="error-message">{errors.ci}</div>}
          </div>

          <div className="form-group">
            <label>Fecha de Nacimiento:</label>
            <input
              type="date"
              name="fecha_nacimiento"
              value={formData.fecha_nacimiento}
              onChange={handleChange}
            />
            {errors.fecha_nacimiento && <div className="error-message">{errors.fecha_nacimiento}</div>}
          </div>

          <div className="form-group">
            <label>Colegio:</label>
            <input
              type="text"
              name="colegio"
              value={formData.colegio}
              onChange={handleChange}
              className={errors.colegio ? "input-error" : ""}
            />
            {errors.colegio && <div className="error-message">{errors.colegio}</div>}
          </div>

          <div className="form-group">
            <label>Curso:</label>
            <select name="curso" value={formData.curso} onChange={handleChange}>
              <option value="">Ninguno</option>
              <option value="1">1ro</option>
              <option value="2">2do</option>
              <option value="3">3ro</option>
              <option value="4">4to</option>
              <option value="5">5to</option>
              <option value="6">6to</option>
            </select>
            {errors.curso && <div className="error-message">{errors.curso}</div>}
          </div>

          <div className="form-group">
            <label>Nivel Educativo:</label>
            <div className="vertical-radio-group">
              <div className="radio-option-vertical">
                <input
                  type="radio"
                  id="primaria"
                  name="nivel"
                  value="Primaria"
                  checked={formData.nivel === "Primaria"}
                  onChange={handleChange}
                />
                <label htmlFor="primaria">Primaria</label>
              </div>
              <div className="radio-option-vertical">
                <input
                  type="radio"
                  id="secundaria"
                  name="nivel"
                  value="Secundaria"
                  checked={formData.nivel === "Secundaria"}
                  onChange={handleChange}
                />
                <label htmlFor="secundaria">Secundaria</label>
              </div>
            </div>
            {errors.nivel && <div className="error-message">{errors.nivel}</div>}
          </div>

          <div className="form-group">
            <label>Departamento:</label>
            <select
              name="departamento"
              value={formData.departamento}
              onChange={handleChange}
            >
              <option value="">Ninguno</option>
              <option value="Beni">Beni</option>
              <option value="Chuquisaca">Chuquisaca</option>
              <option value="Cochabamba">Cochabamba</option>
              <option value="La Paz">La Paz</option>
              <option value="Oruro">Oruro</option>
              <option value="Pando">Pando</option>
              <option value="Potosí">Potosí</option>
              <option value="Santa Cruz">Santa Cruz</option>
              <option value="Tarija">Tarija</option>
            </select>
            {errors.departamento && <div className="error-message">{errors.departamento}</div>}
          </div>

          <div className="form-group">
            <label>Provincia:</label>
            <input
              type="text"
              name="provincia"
              value={formData.provincia}
              onChange={handleChange}
              className={errors.provincia ? "input-error" : ""}
            />
            {errors.provincia && <div className="error-message">{errors.provincia}</div>}
          </div>

          <div className="submit-button-container">
            <button type="button" className="submit-button cancel" onClick={handleBack}>
              Cancelar
            </button>
            <button type="submit" className="submit-button">
              Siguiente
            </button>
          </div>
        </form>
      )}

      {currentStep === 2 && (
        <SegundoPaso
          formData={formData}
          //setFormData={setFormData}
          onBack={handleBack}
          onNext={handlePaso2Next}
        />
      )}

      {currentStep === 3 && (
        <TercerPaso
        step={setCurrentStep}
        onBack={handleBack}
        competidorId={competidorId} // Pasar competidorId aquí
        onReset={() => {
          setCurrentStep(1);
          setFormData({});
          setCompetidorId(null);
        }}
        
      />
      )}
    </div>
  );
}

export default InscribirManual;