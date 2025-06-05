import { Calendar, Clock, Edit3, DollarSign } from "lucide-react"
import "./AreaCard.css"

const AreaCard = ({ area, onEdit, loading }) => {
  const formatDate = (dateString) => {
    if (dateString === "1900-01-01") return "No definida"
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

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

  return (
    <div className="area-cardEventA">
      <div className="card-headerEventA">
        <h3 className="area-nameEventA">{area.nombre}</h3>
        <div className="area-costEventA">
          <span>Bs. {area.costo.toFixed(2)}</span>
        </div>
      </div>

      <p className="area-descriptionEventA">{area.descripcion}</p>

      <div className="cronogramas-previewEventA">
        <div className="cronogramas-headerEventA">
          <Calendar size={20} />
          <h4 className="cronogramas-titleEventA">Cronogramas:</h4>
        </div>
        <div className="cronogramas-listEventA">
          {area.cronogramas.map((cronograma) => (
            <div key={cronograma.cronograma_id} className="cronograma-itemEventA">
              <div className="cronograma-headerEventA">
                <span className="event-iconEventA" style={{ color: getEventColor(cronograma.tipo_evento) }}>
                  {getEventIcon(cronograma.tipo_evento)}
                </span>
                <span className="event-typeEventA">{cronograma.tipo_evento}</span>
              </div>
              <div className="cronograma-datesEventA">
                <div className="date-itemEventA">
                  <Clock size={14} />
                  <span className="date-labelEventA">Inicio:</span>
                  <span className="date-valueEventA">{formatDate(cronograma.fecha_inicio)}</span>
                </div>
              </div>
              <div className="cronograma-datesEventA">
                <div className="date-itemEventA">
                  <Clock size={14} />
                  <span className="date-labelEventA">Fin:</span>
                  <span className="date-valueEventA">{formatDate(cronograma.fecha_fin)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button className="edit-buttonEventA" onClick={() => onEdit(area)} disabled={loading}>
        <Edit3 size={18} />
        <span>{loading ? "Cargando..." : "Editar Cronogramas"}</span>
      </button>
    </div>
  )
}

export default AreaCard
