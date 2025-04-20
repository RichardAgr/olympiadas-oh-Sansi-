import { Eye } from "lucide-react"
import { useNavigate } from "react-router-dom"
import "./competidorCard.css"

const CompetidorCard= ({ competitor, onReview }) => {
  const navigate = useNavigate()
  const getStatusClass = () => {
    switch (competitor.estado) {
      case "Habilitado":
        return "status-enabled"
      case "Pendiente":
        return "status-pending"
      case "Deshabilitado":
        return "status-disabled"
      default:
        return ""
    }
  }

  const handleReviewClick = () => {
    navigate(`/respGest/DatosCompetidor/${competitor.competidor_id}`)
  }

  return (
    <div className={`competitor-card ${getStatusClass()}`}>
      <div className="competitor-info">
        <h2 className="competitor-name">{competitor.nombre_completo}</h2>
        <div className="competitor-details">
          <div className="detail-row">
            <span className="detail-label">Área:</span>
            <span className="detail-value">{competitor.area_competencia}</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Estado:</span>
            <span className={`status-badge ${competitor.estado.toLowerCase()}`}>{competitor.estado}</span>
          </div>
        </div>
      </div>

      <button className={`review-button ${competitor.estado.toLowerCase()}`} onClick={handleReviewClick}>
{/*         <Eye size={16} /> */}
        <span>Revisar</span>
      </button>
    </div>
  )
}

export default CompetidorCard
