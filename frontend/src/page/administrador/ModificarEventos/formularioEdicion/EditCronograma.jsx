import { useState, useEffect } from "react"
import { X, Save, AlertTriangle } from "lucide-react"
import CronogramaForm from "./form/CronogramaForm"
import "./editCronograma.css"

const EditCronograma = ({ area, onClose, onSave, loading }) => {
  const [cronogramas, setCronogramas] = useState([])
  const [errors, setErrors] = useState({})
  const [hasChanges, setHasChanges] = useState(false)
  const [dateWarnings, setDateWarnings] = useState({})

  useEffect(() => {
    setCronogramas([...area.cronogramas])
  }, [area])

  const handleCronogramaChange = (index, field, value) => {
    const updatedCronogramas = [...cronogramas]
    updatedCronogramas[index] = {
      ...updatedCronogramas[index],
      [field]: value,
    }
    setCronogramas(updatedCronogramas)
    setHasChanges(true)

    // Validación inmediata al cambiar fechas
    if (field.includes('fecha')) {
      validateDates(updatedCronogramas)
    }

    if (errors[`${index}_${field}`]) {
      const newErrors = { ...errors }
      delete newErrors[`${index}_${field}`]
      setErrors(newErrors)
    }
  }

  const validateDates = (currentCronogramas = cronogramas) => {
    const newWarnings = {}
    const inscripcion = currentCronogramas.find(c => c.tipo_evento === "Inscripcion")
    const competencia = currentCronogramas.find(c => c.tipo_evento === "Competencia")
    const fin = currentCronogramas.find(c => c.tipo_evento === "Fin")

    // Validar secuencia de fechas
    if (inscripcion && competencia) {
      if (new Date(inscripcion.fecha_fin) > new Date(competencia.fecha_inicio)) {
        const compIndex = currentCronogramas.findIndex(c => c.tipo_evento === "Competencia")
        newWarnings[compIndex] = ["La competencia debe comenzar después del período de inscripción"]
      }
    }

    if (competencia && fin) {
      if (new Date(competencia.fecha_fin) > new Date(fin.fecha_inicio)) {
        const finIndex = currentCronogramas.findIndex(c => c.tipo_evento === "Fin")
        newWarnings[finIndex] = ["El evento de fin debe ser posterior a la competencia"]
      }
    }

    setDateWarnings(newWarnings)
    return Object.keys(newWarnings).length === 0
  }

  const validateForm = () => {
    const newErrors = {}
    const hasDateWarnings = !validateDates()

    cronogramas.forEach((cronograma, index) => {
      // Validación de descripción
      if (cronograma.descripcion && !/^[a-zA-Z0-9\s.,;:()áéíóúÁÉÍÓÚñÑ-]+$/.test(cronograma.descripcion)) {
        newErrors[`${index}_descripcion`] = "La descripción solo puede contener letras, números y signos de puntuación básicos"
      }

      // Validación de fechas
      if (cronograma.fecha_inicio && cronograma.fecha_fin) {
        if (new Date(cronograma.fecha_inicio) > new Date(cronograma.fecha_fin)) {
          newErrors[`${index}_fecha_fin`] = "La fecha de fin debe ser posterior o igual a la fecha de inicio"
        }
      }

      // Validación de año de olimpiada
      if (cronograma.anio_olimpiada <= 0) {
        newErrors[`${index}_anio_olimpiada`] = "Debe seleccionar un año válido"
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0 && !hasDateWarnings
  }

  const handleSave = () => {
    if (validateForm()) {
      onSave(cronogramas)
    }
  }

  const handleClose = () => {
    if (hasChanges) {
      if (window.confirm("¿Estás seguro de que deseas salir sin guardar los cambios?")) {
        onClose()
      }
    } else {
      onClose()
    }
  }

  return (
    <div className="modal-overlayEventA">
      <div className="modal-contentEventA">
        <div className="modal-headerEventA">
          <h2 className="modal-titleEventA">Editar Cronogramas - {area.nombre}</h2>
          <button className="close-buttonEventA" onClick={handleClose} disabled={loading}>
            <X size={24} />
          </button>
        </div>

        <div className="modal-bodyEventA">
          {(Object.keys(errors).length > 0 || Object.keys(dateWarnings).length > 0) && (
            <div className="validation-summaryEventA">
              <AlertTriangle size={20} />
              <span>Por favor, corrige los errores antes de guardar</span>
            </div>
          )}

          <div className="cronogramas-formsEventA">
            {cronogramas.map((cronograma, index) => (
              <CronogramaForm
                key={cronograma.cronograma_id}
                cronograma={cronograma}
                index={index}
                onChange={handleCronogramaChange}
                errors={errors}
                dateWarnings={dateWarnings[index] || []}
                allCronogramas={cronogramas}
              />
            ))}
          </div>
        </div>

        <div className="modal-footerEventA">
          <button className="cancel-buttonEventA" onClick={handleClose} disabled={loading}>
            <X size={18} />
            <span>Cancelar</span>
          </button>
          <button
            className="save-buttonEventA"
            onClick={handleSave}
            disabled={loading || Object.keys(errors).length > 0 || Object.keys(dateWarnings).length > 0}
          >
            <Save size={18} />
            <span>{loading ? "Guardando..." : "Guardar Cambios"}</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default EditCronograma