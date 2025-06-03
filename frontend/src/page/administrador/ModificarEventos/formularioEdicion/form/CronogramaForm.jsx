"use client"
import { Calendar, Clock, Tag, Hash, FileText } from "lucide-react"
import "./cronogramaForm.css"

const CronogramaForm = ({ cronograma, index, onChange, errors }) => {
  const tiposEvento = ["Inscripcion", "Competencia", "Fin"]
  const aniosOlimpiada = [ 2025, 2026,2027]

  const getEventIcon = (tipoEvento) => {
    switch (tipoEvento) {
      case "Inscripcion":
        return "📝"
      case "Competencia":
        return "🏆"
      case "Fin":
        return "🎯"
      default:
        return "📅"
    }
  }

  const getEventColor = (tipoEvento) => {
    switch (tipoEvento) {
      case "Inscripcion":
        return "#4CAF50"
      case "Competencia":
        return "#FF9800"
      case "Fin":
        return "#F44336"
      default:
        return "#9E9E9E"
    }
  }

  const handleInputChange = (field, value) => {
    onChange(index, field, value)
  }

  const validateDescription = (value) => {
    return /^[a-zA-Z0-9\s.,;:()áéíóúÁÉÍÓÚñÑ-]*$/.test(value)
  }

  return (
    <div className="cronograma-formEventA">
      <div className="form-headerEventA">
        <span className="form-iconEventA" style={{ color: getEventColor(cronograma.tipo_evento) }}>
          {getEventIcon(cronograma.tipo_evento)}
        </span>
        <h3 className="form-titleEventA">{cronograma.tipo_evento}</h3>
      </div>

      <div className="form-gridEventA">
        <div className="form-groupEventA">
          <label className="form-labelEventA">
            <FileText size={16} />
            <span>Descripción:</span>
          </label>
          <textarea
            className={`form-textareaEventA ${errors[`${index}_descripcion`] ? "errorEventA" : ""}`}
            value={cronograma.descripcion}
            onChange={(e) => {
              if (validateDescription(e.target.value)) {
                handleInputChange("descripcion", e.target.value)
              }
            }}
            placeholder="Describe este evento del cronograma..."
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
            />
            {errors[`${index}_fecha_inicio`] && (
              <span className="error-messageEventA">{errors[`${index}_fecha_inicio`]}</span>
            )}
          </div>

          <div className="form-groupEventA">
            <label className="form-labelEventA">
              <Clock size={16} />
              <span>Fecha de Fin:</span>
            </label>
            <input
              type="date"
              className={`form-inputEventA ${errors[`${index}_fecha_fin`] ? "errorEventA" : ""}`}
              value={cronograma.fecha_fin === "1900-01-01" ? "" : cronograma.fecha_fin}
              onChange={(e) => handleInputChange("fecha_fin", e.target.value || "1900-01-01")}
            />
            {errors[`${index}_fecha_fin`] && (
              <span className="error-messageEventA">{errors[`${index}_fecha_fin`]}</span>
            )}
          </div>
        </div>

        <div className="form-rowEventA">
          <div className="form-groupEventA">
            <label className="form-labelEventA">
              <Tag size={16} />
              <span>Tipo de Evento:</span>
            </label>
            <select
              className="form-selectEventA"
              value={cronograma.tipo_evento}
              onChange={(e) => handleInputChange("tipo_evento", e.target.value)}
            >
              {tiposEvento.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {getEventIcon(tipo)} {tipo}
                </option>
              ))}
            </select>
          </div>

          <div className="form-groupEventA">
            <label className="form-labelEventA">
              <Hash size={16} />
              <span>Año Olimpiada:</span>
            </label>
            <select
              className="form-selectEventA"
              value={cronograma.anio_olimpiada}
              onChange={(e) => handleInputChange("anio_olimpiada", Number.parseInt(e.target.value))}
            >
              <option value={0}>Seleccionar año</option>
              {aniosOlimpiada.map((anio) => (
                <option key={anio} value={anio}>
                  {anio}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CronogramaForm
