import { useState, useEffect } from "react"
import { X, Save, AlertTriangle } from "lucide-react"
import CronogramaForm from "./form/CronogramaForm"
import "./editCronograma.css"

const EditCronograma = ({ area, onClose, onSave, loading }) => {
  const [cronogramas, setCronogramas] = useState([])
  const [errors, setErrors] = useState({})
  const [hasChanges, setHasChanges] = useState(false)

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

    if (errors[`${index}_${field}`]) {
      const newErrors = { ...errors }
      delete newErrors[`${index}_${field}`]
      setErrors(newErrors)
    }
  }

  const validateForm = () => {
    const newErrors = {}

    cronogramas.forEach((cronograma, index) => {
      if (cronograma.descripcion && !/^[a-zA-Z0-9\s.,;:()áéíóúÁÉÍÓÚñÑ-]+$/.test(cronograma.descripcion)) {
        newErrors[`${index}_descripcion`] =
          "La descripción solo puede contener letras, números y signos de puntuación básicos"
      }

      if (cronograma.fecha_inicio && cronograma.fecha_fin) {
        if (new Date(cronograma.fecha_inicio) > new Date(cronograma.fecha_fin)) {
          newErrors[`${index}_fecha_fin`] = "La fecha de fin debe ser posterior o igual a la fecha de inicio"
        }
      }
    })

    const inscripcion = cronogramas.find((c) => c.tipo_evento === "Inscripcion")
    const competencia = cronogramas.find((c) => c.tipo_evento === "Competencia")
    const fin = cronogramas.find((c) => c.tipo_evento === "Fin")

    if (inscripcion?.fecha_fin && competencia?.fecha_inicio) {
      if (new Date(inscripcion.fecha_fin) > new Date(competencia.fecha_inicio)) {
        const compIndex = cronogramas.findIndex((c) => c.tipo_evento === "Competencia")
        newErrors[`${compIndex}_fecha_inicio`] = "La competencia debe iniciar después del fin de inscripciones"
      }
    }

    if (competencia?.fecha_fin && fin?.fecha_inicio) {
      if (new Date(competencia.fecha_fin) > new Date(fin.fecha_inicio)) {
        const finIndex = cronogramas.findIndex((c) => c.tipo_evento === "Fin")
        newErrors[`${finIndex}_fecha_inicio`] = "El fin debe ser después del fin de la competencia"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = () => {
    if (validateForm()) {
      onSave(cronogramas)
    }
  }

  const handleClose = () => {
    if (hasChanges) {
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
          {Object.keys(errors).length > 0 && (
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
            disabled={loading || Object.keys(errors).length > 0}
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
