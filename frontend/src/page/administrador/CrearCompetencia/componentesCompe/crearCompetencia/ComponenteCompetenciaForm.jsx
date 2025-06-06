import { useState } from "react"
import "./componenteCompetenciaForm.css"

const ComponenteCompetenciaForm = () => {
    const [formData, setFormData] = useState({
    nombre_competencia: "",
    descripcion: "",
    fecha_inicio: "",
    fecha_fin: "",
    estado: true,
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Función para validar solo letras y números
  const validateAlphanumeric = (value) => {
    const regex = /^[a-zA-Z0-9\s]*$/
    return regex.test(value)
  }

  // Función para validar fechas
  const validateDates = (fechaInicio, fechaFin) => {
    if (!fechaInicio || !fechaFin) return true
    return new Date(fechaInicio) < new Date(fechaFin)
  }

  // Manejar cambios en los inputs
  const handleInputChange = (e) => {
    const { name, value, type } = e.target

    // Validación en tiempo real para campos alfanuméricos
    if ((name === "nombre_competencia" || name === "descripcion") && !validateAlphanumeric(value)) {
      return // No actualizar si contiene caracteres especiales
    }

    const newValue = type === "select-one" ? value === "true" : value

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }))

    // Limpiar errores cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  // Validar formulario
  const validateForm = () => {
    const newErrors = {}

    // Validar nombre de competencia
    if (!formData.nombre_competencia.trim()) {
      newErrors.nombre_competencia = "El nombre de la competencia es obligatorio"
    } else if (formData.nombre_competencia.length < 3) {
      newErrors.nombre_competencia = "El nombre debe tener al menos 3 caracteres"
    }

    // Validar descripción
    if (!formData.descripcion.trim()) {
      newErrors.descripcion = "La descripción es obligatoria"
    } else if (formData.descripcion.length < 10) {
      newErrors.descripcion = "La descripción debe tener al menos 10 caracteres"
    }

    // Validar fecha de inicio
    if (!formData.fecha_inicio) {
      newErrors.fecha_inicio = "La fecha de inicio es obligatoria"
    }

    // Validar fecha de fin
    if (!formData.fecha_fin) {
      newErrors.fecha_fin = "La fecha de fin es obligatoria"
    }

    // Validar que fecha inicio sea menor que fecha fin
    if (formData.fecha_inicio && formData.fecha_fin && !validateDates(formData.fecha_inicio, formData.fecha_fin)) {
      newErrors.fecha_fin = "La fecha de fin debe ser posterior a la fecha de inicio"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // AQUÍ DEBES IMPLEMENTAR LA LLAMADA A LA API
      // Ejemplo de cómo sería la llamada con axios:
      /*
      const response = await axios.post('http://tu-api-url/competencias', {
        nombre_competencia: formData.nombre_competencia,
        descripcion: formData.descripcion,
        fecha_inicio: formData.fecha_inicio,
        fecha_fin: formData.fecha_fin,
        estado: formData.estado
      });
      
      if (response.status === 201) {
        alert('Competencia creada exitosamente');
        // Llamar callback si existe
        if (onCompetenciaCreada) {
          onCompetenciaCreada(response.data);
        }
        // Resetear formulario
        setFormData({
          nombre_competencia: '',
          descripcion: '',
          fecha_inicio: '',
          fecha_fin: '',
          estado: true
        });
      }
      */

      // Simulación de envío exitoso (remover cuando implementes la API real)
      setTimeout(() => {
        const nuevaCompetencia = {
          competencia_id: Date.now(), // ID temporal
          ...formData,
        }
        console.log(nuevaCompetencia)

        alert("Competencia creada exitosamente")

        // Llamar callback si existe
        if (onCompetenciaCreada) {
          onCompetenciaCreada(nuevaCompetencia)
        }

        // Resetear formulario
        setFormData({
          nombre_competencia: "",
          descripcion: "",
          fecha_inicio: "",
          fecha_fin: "",
          estado: true,
        })
        setIsSubmitting(false)
      }, 1000)
    } catch (error) {
      // MANEJO DE ERRORES DE LA API
      console.error("Error al crear competencia:", error)
      alert("Error al crear la competencia. Por favor, intenta nuevamente.")
      setIsSubmitting(false)
    }
  }

  return (
    <div className="formWrapperCompCrear">
      <div className="headerCompCrear">
        <h2 className="titleCompCrear">Crear Nueva Competencia</h2>
        <p className="subtitleCompCrear">Complete todos los campos para registrar una nueva competencia</p>
      </div>

      <form onSubmit={handleSubmit} className="formCompCrear">
        <div className="inputGroupCompCrear">
          <label htmlFor="nombre_competencia" className="labelCompCrear">
            Nombre de la Competencia *
          </label>
          <input
            type="text"
            id="nombre_competencia"
            name="nombre_competencia"
            value={formData.nombre_competencia}
            onChange={handleInputChange}
            className={`inputCompCrear ${errors.nombre_competencia ? "errorCompCrear" : ""}`}
            placeholder="Ej: Olimpiada de Matemáticas 2024"
            maxLength="50"
          />
          {errors.nombre_competencia && <span className="errorMessageCompCrear">{errors.nombre_competencia}</span>}
          <small className="helpTextCompCrear">Solo se permiten letras, números y espacios</small>
        </div>

        <div className="inputGroupCompCrear">
          <label htmlFor="descripcion" className="labelCompCrear">
            Descripción *
          </label>
          <textarea
            id="descripcion"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleInputChange}
            className={`textareaCompCrear ${errors.descripcion ? "errorCompCrear" : ""}`}
            placeholder="Describe los objetivos y características de la competencia..."
            rows="4"
          />
          {errors.descripcion && <span className="errorMessageCompCrear">{errors.descripcion}</span>}
          <small className="helpTextCompCrear">Solo se permiten letras, números y espacios</small>
        </div>

        <div className="dateRowCompCrear">
          <div className="inputGroupCompCrear">
            <label htmlFor="fecha_inicio" className="labelCompCrear">
              Fecha de Inicio *
            </label>
            <input
              type="date"
              id="fecha_inicio"
              name="fecha_inicio"
              value={formData.fecha_inicio}
              onChange={handleInputChange}
              className={`inputCompCrear ${errors.fecha_inicio ? "errorCompCrear" : ""}`}
            />
            {errors.fecha_inicio && <span className="errorMessageCompCrear">{errors.fecha_inicio}</span>}
          </div>

          <div className="inputGroupCompCrear">
            <label htmlFor="fecha_fin" className="labelCompCrear">
              Fecha de Fin *
            </label>
            <input
              type="date"
              id="fecha_fin"
              name="fecha_fin"
              value={formData.fecha_fin}
              onChange={handleInputChange}
              className={`inputCompCrear ${errors.fecha_fin ? "errorCompCrear" : ""}`}
            />
            {errors.fecha_fin && <span className="errorMessageCompCrear">{errors.fecha_fin}</span>}
          </div>
        </div>

        <div className="inputGroupCompCrear">
          <label htmlFor="estado" className="labelCompCrear">
            Estado *
          </label>
          <select
            id="estado"
            name="estado"
            value={formData.estado}
            onChange={handleInputChange}
            className="selectCompCrear"
          >
            <option value={true}>Activo</option>
            <option value={false}>Inactivo</option>
          </select>
        </div>

        <div className="buttonGroupCompCrear">
          <button
            type="button"
            className="buttonSecondaryCompCrear"
            onClick={() => {
              setFormData({
                nombre_competencia: "",
                descripcion: "",
                fecha_inicio: "",
                fecha_fin: "",
                estado: true,
              })
              setErrors({})
            }}
          >
            Limpiar
          </button>
          <button type="submit" className="buttonPrimaryCompCrear" disabled={isSubmitting}>
            {isSubmitting ? "Creando..." : "Crear Competencia"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default ComponenteCompetenciaForm