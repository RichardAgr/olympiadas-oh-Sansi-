import { Calendar, Clock, FileText, Hash, AlertTriangle } from "lucide-react"
import "./cronogramaForm.css"

const CronogramaForm = ({ cronograma, index, onChange, errors, dateWarnings, allCronogramas }) => {
  const aniosOlimpiada = [2025, 2026, 2027]

  const getEventIcon = (tipoEvento) => {
    switch (tipoEvento) {
      case "Inscripcion": return "📝"
      case "Competencia": return "🏆"
      case "Fin": return "🎯"
      default: return "📅"
    }
  }

  const getEventColor = (tipoEvento) => {
    switch (tipoEvento) {
      case "Inscripcion": return "#4CAF50"
      case "Competencia": return "#FF9800"
      case "Fin": return "#F44336"
      default: return "#9E9E9E"
    }
  }

  const handleInputChange = (field, value) => {
    onChange(index, field, value)
  }

  const validateDescription = (value) => {
    return /^[a-zA-Z0-9\s.,;:()áéíóúÁÉÍÓÚñÑ-]*$/.test(value)
  }

  // Calcular fechas mínimas/máximas según tipo de evento
  const getDateConstraints = () => {
    if (cronograma.tipo_evento === "Competencia") {
      const inscripcion = allCronogramas.find(c => c.tipo_evento === "Inscripcion")
      return {
        min: inscripcion?.fecha_fin || undefined,
        max: allCronogramas.find(c => c.tipo_evento === "Fin")?.fecha_inicio || undefined
      }
    }
    if (cronograma.tipo_evento === "Fin") {
      const competencia = allCronogramas.find(c => c.tipo_evento === "Competencia")
      return {
        min: competencia?.fecha_fin || undefined,
        max: undefined
      }
    }
    return { min: undefined, max: undefined }
  }

  const { min, max } = getDateConstraints()

  return (
    <div className="cronograma-formEventA">
      <div className="form-headerEventA">
        <span className="form-iconEventA" style={{ color: getEventColor(cronograma.tipo_evento) }}>
          {getEventIcon(cronograma.tipo_evento)}
        </span>
        <h3 className="form-titleEventA">{cronograma.tipo_evento}</h3>
      </div>

      {dateWarnings.length > 0 && (
        <div className="date-warningsEvent">
          {dateWarnings.map((warning, i) => (
            <div key={i} className="warning-messageEvent">
              <AlertTriangle size={16} />
              <span>{warning}</span>
            </div>
          ))}
        </div>
      )}

      <div className="form-gridEventA">
        <div className="form-groupEventA">
          <label className="form-labelEventA">
            <FileText size={16} />
            <span>Descripción:</span>
          </label>
          <textarea
            className={`form-textareaEventA ${errors[`${index}_descripcion`] ? "errorEventA" : ""}`}
            value={cronograma.descripcion}
            onChange={(e) => validateDescription(e.target.value) && handleInputChange("descripcion", e.target.value)}
            placeholder={`Describe el evento de ${cronograma.tipo_evento.toLowerCase()}...`}
            rows="3"
          />
          {errors[`${index}_descripcion`] && (
            <span className="error-messageEventA">{errors[`${index}_descripcion`]}</span>
          )}
        </div>

        <div className="form-rowEventA">
          <div className="form-groupEventA">
            <label className="form-labelEventA">
              <Calendar size={16} />
              <span>Fecha de Inicio:</span>
            </label>
            <input
              type="date"
              className={`form-inputEventA ${errors[`${index}_fecha_inicio`] ? "errorEventA" : ""}`}
              value={cronograma.fecha_inicio === "1900-01-01" ? "" : cronograma.fecha_inicio}
              onChange={(e) => handleInputChange("fecha_inicio", e.target.value || "1900-01-01")}
              min={min}
              max={max}
            />
            {errors[`${index}_fecha_inicio`] && (
              <span className="error-messageEventA">{errors[`${index}_fecha_inicio`]}</span>
            )}
          </div>

          <div className="form-groupEventA">
            <label className="form-labelEventA">
              <Calendar size={16} />
              <span>Fecha de Fin:</span>
            </label>
            <input
              type="date"
              className={`form-inputEventA ${errors[`${index}_fecha_fin`] ? "errorEventA" : ""}`}
              value={cronograma.fecha_fin === "1900-01-01" ? "" : cronograma.fecha_fin}
              onChange={(e) => handleInputChange("fecha_fin", e.target.value || "1900-01-01")}
              min={cronograma.fecha_inicio !== "1900-01-01" ? cronograma.fecha_inicio : min}
            />
            {errors[`${index}_fecha_fin`] && (
              <span className="error-messageEventA">{errors[`${index}_fecha_fin`]}</span>
            )}
          </div>
        </div>

        <div className="form-groupEventA">
          <label className="form-labelEventA">
            <Hash size={16} />
            <span>Año Olimpiada:</span>
          </label>
          <select
            className={`form-selectEventA ${errors[`${index}_anio_olimpiada`] ? "errorEventA" : ""}`}
            value={cronograma.anio_olimpiada}
            onChange={(e) => handleInputChange("anio_olimpiada", parseInt(e.target.value))}
          >
            <option value={0}>Seleccionar año</option>
            {aniosOlimpiada.map((anio) => (
              <option key={anio} value={anio}>{anio}</option>
            ))}
          </select>
          {errors[`${index}_anio_olimpiada`] && (
            <span className="error-messageEventA">{errors[`${index}_anio_olimpiada`]}</span>
          )}
        </div>
      </div>
    </div>
  )
}

export default CronogramaForm