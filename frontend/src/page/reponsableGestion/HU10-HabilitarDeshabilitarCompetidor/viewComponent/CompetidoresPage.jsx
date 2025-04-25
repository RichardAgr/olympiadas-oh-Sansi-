import { useState, useEffect } from "react"
import { Search} from "lucide-react"
import CompetidorCard from "../../../../components/competidorCard/CompetidorCard"
import "./competidoresPage.css"
import axios from "axios"

export default function CompetidoresPage() {
  const [competitors, setCompetitors] = useState([])
  const [filteredCompetitors, setFilteredCompetitors] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchCompetitors = async () => {
      try {
        setIsLoading(true)
        const res = await axios.get("http://127.0.0.1:8000/api/competidores")
        
        if (res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`); 
        }
        /* console.log(res.data.data) */
        const data = res.data.data
        setCompetitors(data)
        setFilteredCompetitors(data)
        setIsLoading(false)
      } catch (err) {
        setError("Error al cargar los datos")
        setIsLoading(false)
        console.error(err)
      }
    }

    fetchCompetitors()
  }, [])

  useEffect(() => {
    let filtered = competitors

    if (searchTerm) {
      filtered = filtered.filter((competitor) =>
        competitor.nombre_completo.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filtrar por estado
    if (selectedStatus !== "all") {
      filtered = filtered.filter((competitor) => competitor.estado === selectedStatus)
    }

    setFilteredCompetitors(filtered)
  }, [searchTerm, selectedStatus, competitors])

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  const handleStatusChange = (status) => {
    if (selectedStatus === status) {
      setSelectedStatus("all")
    } else {
      setSelectedStatus(status)
    }
  }

  return (
    <div className="competitors-container">
      <div className="filters-container">
        <div className="search-sectionH">
          <div className="search-containerH">
            <Search className="search-iconH" size={18} />
            <input
              type="text"
              placeholder="Buscar por nombre del competidor"
              value={searchTerm}
              onChange={handleSearch}
              className="search-inputH"
            />
          </div>
        </div>

        <div className="status-filters">
          <label className="radio-label">
            <input
              type="radio"
              name="status"
              checked={selectedStatus === "all"}
              onChange={() => handleStatusChange("all")}
              className="radio-inputH"
            />
            <span className="radio-text">Todos</span>
          </label>
          <label className="radio-label">
            <input
              type="radio"
              name="status"
              checked={selectedStatus === "Habilitado"}
              onChange={() => handleStatusChange("Habilitado")}
              className="radio-inputH"
            />
            <span className="radio-text">Habilitado</span>
          </label>
          <label className="radio-label">
            <input
              type="radio"
              name="status"
              checked={selectedStatus === "Pendiente"}
              onChange={() => handleStatusChange("Pendiente")}
              className="radio-inputH"
            />
            <span className="radio-text">Pendiente</span>
          </label>
          <label className="radio-label">
            <input
              type="radio"
              name="status"
              checked={selectedStatus === "Deshabilitado"}
              onChange={() => handleStatusChange("Deshabilitado")}
              className="radio-inputH"
            />
            <span className="radio-text">Deshabilitado</span>
          </label>
        </div>
      </div>

      {isLoading ? (
        <div className="loading">Cargando competidores...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : filteredCompetitors.length === 0 ? (
        <div className="no-results">No se encontraron competidores</div>
      ) : (
        <div className="competitors-list">
          {filteredCompetitors.map((competitor) => (
             <CompetidorCard key={competitor.competidor_id} competitor={competitor} />
          ))}
        </div>
      )}
    </div>
  )
}
