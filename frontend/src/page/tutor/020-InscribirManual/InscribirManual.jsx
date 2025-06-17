import { useState } from "react"
import { useParams } from "react-router-dom"
import Swal from "sweetalert2"
import SegundoPaso from "./SegundoPaso"
import TercerPaso from "./TercerPaso"
import "./InscribirManual.css"

function InscribirManual() {
  const { id } = useParams()
  const [competidorId, setCompetidorId] = useState(null)
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
  })

  const [currentStep, setCurrentStep] = useState(1)
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" })
    }
  }

  const validateStep1 = () => {
    const newErrors = {}
    const soloLetrasRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/
    const soloNumerosRegex = /^[0-9]+$/

    // Validación: nombres
    if (!formData.nombres.trim()) {
      newErrors.nombres = "El nombre es obligatorio."
    } else if (formData.nombres.trim().length < 3) {
      newErrors.nombres = "El nombre debe tener al menos 3 caracteres."
    } else if (!soloLetrasRegex.test(formData.nombres)) {
      newErrors.nombres = "El nombre solo debe contener letras."
    }

    // Validación: apellidos
    if (!formData.apellidos.trim()) {
      newErrors.apellidos = "El apellido es obligatorio."
    } else if (formData.apellidos.trim().length < 3) {
      newErrors.apellidos = "El apellido debe tener al menos 3 caracteres."
    } else if (!soloLetrasRegex.test(formData.apellidos)) {
      newErrors.apellidos = "El apellido solo debe contener letras."
    }

    // Validación: carnet de identidad (ci)
    if (!formData.ci.trim()) {
      newErrors.ci = "El CI es obligatorio."
    } else if (!soloNumerosRegex.test(formData.ci)) {
      newErrors.ci = "El CI solo debe contener números."
    } else if (formData.ci.trim().length < 7) {
      newErrors.ci = "El CI debe tener al menos 7 dígitos."
    }

    // Validación: colegio
    if (!formData.colegio.trim()) {
      newErrors.colegio = "El nombre del colegio es obligatorio."
    } else if (formData.colegio.trim().length < 5) {
      newErrors.colegio = "El nombre del colegio debe tener al menos 5 caracteres."
    } else if (!soloLetrasRegex.test(formData.colegio)) {
      newErrors.colegio = "El nombre del colegio solo debe contener letras."
    }

    // Validación: provincia
    if (!formData.provincia.trim()) {
      newErrors.provincia = "La provincia es obligatoria."
    } else if (formData.provincia.trim().length < 4) {
      newErrors.provincia = "La provincia debe tener al menos 4 caracteres."
    } else if (!soloLetrasRegex.test(formData.provincia)) {
      newErrors.provincia = "La provincia solo debe contener letras."
    }

    // Validación: curso
    if (!formData.curso) {
      newErrors.curso = "Debe seleccionar un curso."
    }

    // Validación: nivel educativo
    if (!formData.nivel) {
      newErrors.nivel = "Debe seleccionar un nivel educativo."
    }

    // Validación: departamento
    if (!formData.departamento) {
      newErrors.departamento = "Debe seleccionar un departamento."
    }

    // Validación: fecha de nacimiento
    const selectedYear = new Date(formData.fecha_nacimiento).getFullYear()
    const currentYear = new Date().getFullYear()

    if (!formData.fecha_nacimiento) {
      newErrors.fecha_nacimiento = "Debe ingresar una fecha de nacimiento."
    } else if (selectedYear > currentYear - 5) {
      newErrors.fecha_nacimiento = "La fecha de nacimiento indica que es demasiado joven (mínimo 5 años)."
    }

    return newErrors
  }

  const calcularGradoId = (nivel, curso) => {
    if (nivel === "Primaria") return Number(curso)
    if (nivel === "Secundaria") return 6 + Number(curso)
    return null
  }

  const handleSubmitStep1 = (e) => {
    e.preventDefault()
    const newErrors = validateStep1()
    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      const grado_id = calcularGradoId(formData.nivel, formData.curso)
      setFormData((prev) => ({ ...prev, grado_id }))
      setCurrentStep(2)

      Swal.fire({
        icon: "success",
        title: "¡Datos guardados!",
        text: "Procede a seleccionar el área de competencia",
        timer: 1500,
        showConfirmButton: false,
      })
    } else {
      Swal.fire({
        icon: "error",
        title: "Error en los datos",
        text: "Por favor, corrige los errores en el formulario",
      })
    }
  }

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const handlePaso2Next = (datosCompetencia, nuevoCompetidorId) => {
    // Combinar datos del competidor con datos de competencia
    setFormData((prev) => ({
      ...prev,
      ...datosCompetencia,
    }))
    // competidorId será null hasta el paso 3
    setCompetidorId(nuevoCompetidorId)
    setCurrentStep(3)
  }

  const handleCancelar = () => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Se perderán todos los datos ingresados hasta ahora",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, cancelar",
      cancelButtonText: "No, continuar",
    }).then((result) => {
      if (result.isConfirmed) {
        window.history.back()
      }
    })
  }

  const handleReset = () => {
    setCurrentStep(1)
    setFormData({
      nombres: "",
      apellidos: "",
      ci: "",
      fecha_nacimiento: "",
      colegio: "",
      curso: "",
      nivel: "",
      departamento: "",
      provincia: "",
    })
    setCompetidorId(null)
    setErrors({})
  }

  return (
    <div className="inscribir-manual-container-InscMan">
      {isLoading && (
        <div className="loading-overlay-InscMan">
          <div className="loading-content-InscMan">
            <div className="spinner-InscMan"></div>
            <p>Procesando...</p>
          </div>
        </div>
      )}

      <h1 className="inscribir-manual-title-InscMan">Inscripción Competidor</h1>

      {/* Pasos */}
      <div className="steps-InscMan">
        <div className="step-InscMan">
          <div className={`step-number-InscMan ${currentStep === 1 ? "active" : ""}`}>01</div>
        </div>
        <div className="step-line-InscMan"></div>
        <div className="step-InscMan">
          <div className={`step-number-InscMan ${currentStep === 2 ? "active" : ""}`}>02</div>
        </div>
        <div className="step-line-InscMan"></div>
        <div className="step-InscMan">
          <div className={`step-number-InscMan ${currentStep === 3 ? "active" : ""}`}>03</div>
        </div>
      </div>

      {currentStep === 1 && (
        <form onSubmit={handleSubmitStep1} className="inscribir-manual-form-InscMan">
          <div className="form-group-InscMan">
            <label>Nombres del competidor:</label>
            <input
              type="text"
              name="nombres"
              value={formData.nombres}
              onChange={handleChange}
              className={errors.nombres ? "input-error-InscMan" : ""}
            />
            {errors.nombres && <div className="error-message-InscMan">{errors.nombres}</div>}
          </div>

          <div className="form-group-InscMan">
            <label>Apellidos del competidor:</label>
            <input
              type="text"
              name="apellidos"
              value={formData.apellidos}
              onChange={handleChange}
              className={errors.apellidos ? "input-error-InscMan" : ""}
            />
            {errors.apellidos && <div className="error-message-InscMan">{errors.apellidos}</div>}
          </div>

          <div className="form-group-InscMan">
            <label>CI del competidor:</label>
            <input
              type="text"
              name="ci"
              value={formData.ci}
              onChange={handleChange}
              className={errors.ci ? "input-error-InscMan" : ""}
            />
            {errors.ci && <div className="error-message-InscMan">{errors.ci}</div>}
          </div>

          <div className="form-group-InscMan">
            <label>Fecha de Nacimiento:</label>
            <input
              type="date"
              name="fecha_nacimiento"
              value={formData.fecha_nacimiento}
              onChange={handleChange}
              className={errors.fecha_nacimiento ? "input-error-InscMan" : ""}
            />
            {errors.fecha_nacimiento && <div className="error-message-InscMan">{errors.fecha_nacimiento}</div>}
          </div>

          <div className="form-group-InscMan">
            <label>Colegio:</label>
            <input
              type="text"
              name="colegio"
              value={formData.colegio}
              onChange={handleChange}
              className={errors.colegio ? "input-error-InscMan" : ""}
            />
            {errors.colegio && <div className="error-message-InscMan">{errors.colegio}</div>}
          </div>

          <div className="form-group-InscMan">
            <label>Curso:</label>
            <select name="curso" value={formData.curso} onChange={handleChange}>
              <option value="">Seleccionar curso</option>
              <option value="1">1ro</option>
              <option value="2">2do</option>
              <option value="3">3ro</option>
              <option value="4">4to</option>
              <option value="5">5to</option>
              <option value="6">6to</option>
            </select>
            {errors.curso && <div className="error-message-InscMan">{errors.curso}</div>}
          </div>

          <div className="form-group-InscMan">
            <label>Nivel Educativo:</label>
            <div className="vertical-radio-group-InscMan">
              <div className="radio-option-vertical-InscMan">
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
              <div className="radio-option-vertical-InscMan">
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
            {errors.nivel && <div className="error-message-InscMan">{errors.nivel}</div>}
          </div>

          <div className="form-group-InscMan">
            <label>Departamento:</label>
            <select name="departamento" value={formData.departamento} onChange={handleChange}>
              <option value="">Seleccionar departamento</option>
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
            {errors.departamento && <div className="error-message-InscMan">{errors.departamento}</div>}
          </div>

          <div className="form-group-InscMan">
            <label>Provincia:</label>
            <input
              type="text"
              name="provincia"
              value={formData.provincia}
              onChange={handleChange}
              className={errors.provincia ? "input-error-InscMan" : ""}
            />
            {errors.provincia && <div className="error-message-InscMan">{errors.provincia}</div>}
          </div>

          <div className="submit-button-container-InscMan">
            <button type="button" className="submit-button-InscMan cancel" onClick={handleCancelar}>
              Cancelar
            </button>
            <button type="submit" className="submit-button-InscMan">
              Siguiente
            </button>
          </div>
        </form>
      )}

      {currentStep === 2 && (
        <SegundoPaso formData={formData} onBack={handleBack} onNext={handlePaso2Next} setIsLoading={setIsLoading} />
      )}

      {currentStep === 3 && (
        <TercerPaso
          formData={formData} // Pasar todos los datos del formulario
          competidorCI={formData.ci}
          onBack={handleBack}
          onReset={handleReset}
          setIsLoading={setIsLoading}
        />
      )}
    </div>
  )
}

export default InscribirManual