import { useState, useEffect } from "react"
import "./formEditar.css"

const FormEditar = ({ competencia, isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState({
    nombre_competencia: "",
    descripcion: "",
    fecha_inicio: "",
    fecha_fin: "",
    estado: true,
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (competencia && isOpen) {
      setFormData({
        nombre_competencia: competencia.nombre_competencia || "",
        descripcion: competencia.descripcion || "",
        fecha_inicio: competencia.fecha_inicio || "",
        fecha_fin: competencia.fecha_fin || "",
        estado: competencia.estado || false,
      })
      setErrors({})
    }
  }, [competencia, isOpen])

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
      return
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

    if (!formData.nombre_competencia.trim()) {
      newErrors.nombre_competencia = "El nombre de la competencia es obligatorio"
    } else if (formData.nombre_competencia.length < 3) {
      newErrors.nombre_competencia = "El nombre debe tener al menos 3 caracteres"
    }

    if (!formData.descripcion.trim()) {
      newErrors.descripcion = "La descripción es obligatoria"
    } else if (formData.descripcion.length < 10) {
      newErrors.descripcion = "La descripción debe tener al menos 10 caracteres"
    }

    if (!formData.fecha_inicio) {
      newErrors.fecha_inicio = "La fecha de inicio es obligatoria"
    }

    if (!formData.fecha_fin) {
      newErrors.fecha_fin = "La fecha de fin es obligatoria"
    }

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
      // AQUÍ DEBES IMPLEMENTAR LA LLAMADA A LA API PARA ACTUALIZAR
      // Ejemplo de cómo sería la llamada con axios:
      /*
      const response = await axios.put(`http://tu-api-url/competencias/${competencia.competencia_id}`, {
        nombre_competencia: formData.nombre_competencia,
        descripcion: formData.descripcion,
        fecha_inicio: formData.fecha_inicio,
        fecha_fin: formData.fecha_fin,
        estado: formData.estado
      });
      
      if (response.status === 200) {
        onSave(response.data, 'Competencia actualizada exitosamente');
      }
      */

      // Simulación de actualización exitosa
      setTimeout(() => {
        const competenciaActualizada = {
          ...competencia,
          ...formData,
        }
        onSave(competenciaActualizada, "Competencia actualizada exitosamente")
        setIsSubmitting(false)
      }, 1000)
    } catch (error) {
      console.error("Error al actualizar competencia:", error)
      onSave(null, "Error al actualizar la competencia", "error")
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="modalOverlayCompCrear" onClick={handleClose}>
      <div className="modalContentCompCrear" onClick={(e) => e.stopPropagation()}>
        <div className="modalHeaderCompCrear">
          <h2 className="modalTitleCompCrear">Editar Competencia</h2>
          <button onClick={handleClose} className="modalCloseCompCrear" disabled={isSubmitting}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modalFormCompCrear">
          <div className="inputGroupCompCrear">
            <label htmlFor="edit_nombre_competencia" className="labelCompCrear">
              Nombre de la Competencia *
            </label>
            <input
              type="text"
              id="edit_nombre_competencia"
              name="nombre_competencia"
              value={formData.nombre_competencia}
              onChange={handleInputChange}
              className={`inputCompCrear ${errors.nombre_competencia ? "errorCompCrear" : ""}`}
              placeholder="Ej: Olimpiada de Matemáticas 2024"
              maxLength="50"
            />
            {errors.nombre_competencia && <span className="errorMessageCompCrear">{errors.nombre_competencia}</span>}
          </div>

          <div className="inputGroupCompCrear">
            <label htmlFor="edit_descripcion" className="labelCompCrear">
              Descripción *
            </label>
            <textarea
              id="edit_descripcion"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleInputChange}
              className={`textareaCompCrear ${errors.descripcion ? "errorCompCrear" : ""}`}
              placeholder="Describe los objetivos y características de la competencia..."
              rows="3"
            />
            {errors.descripcion && <span className="errorMessageCompCrear">{errors.descripcion}</span>}
          </div>

          <div className="dateRowCompCrear">
            <div className="inputGroupCompCrear">
              <label htmlFor="edit_fecha_inicio" className="labelCompCrear">
                Fecha de Inicio *
              </label>
              <input
                type="date"
                id="edit_fecha_inicio"
                name="fecha_inicio"
                value={formData.fecha_inicio}
                onChange={handleInputChange}
                className={`inputCompCrear ${errors.fecha_inicio ? "errorCompCrear" : ""}`}
              />
              {errors.fecha_inicio && <span className="errorMessageCompCrear">{errors.fecha_inicio}</span>}
            </div>

            <div className="inputGroupCompCrear">
              <label htmlFor="edit_fecha_fin" className="labelCompCrear">
                Fecha de Fin *
              </label>
              <input
                type="date"
                id="edit_fecha_fin"
                name="fecha_fin"
                value={formData.fecha_fin}
                onChange={handleInputChange}
                className={`inputCompCrear ${errors.fecha_fin ? "errorCompCrear" : ""}`}
              />
              {errors.fecha_fin && <span className="errorMessageCompCrear">{errors.fecha_fin}</span>}
            </div>
          </div>

          <div className="modalActionsCompCrear">
            <button type="button" onClick={handleClose} className="buttonSecondaryCompCrear" disabled={isSubmitting}>
              Cancelar
            </button>
            <button type="submit" className="buttonPrimaryCompCrear" disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default FormEditar