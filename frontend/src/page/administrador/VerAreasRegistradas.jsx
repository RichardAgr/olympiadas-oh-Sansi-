import "./VRegistroOrg.css"
import { useState, useEffect } from "react"
import buscador from "../../assets/buscador.svg"
import { useLocation, useNavigate } from "react-router-dom"
import axios from "axios"
import "../../App.css"

function RegistrarOrganizador() {
  const navigate = useNavigate()
  const [search, setSearch] = useState("")
  const [areas, setAreas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const cargarAreas = async () => {
    try {
      setLoading(true)
      const response = await axios.get("http://127.0.0.1:8000/api/areasRegistradas")
      const flattenedData = response.data.data.flatMap(item => item.data)
      setAreas(flattenedData)
      console.log(flattenedData)
      setError(null)
    } catch (err) {
      console.error("Error al cargar áreas:", err)
      setError("Error al cargar los datos. Por favor, intente nuevamente.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    cargarAreas()
  }, [])

  // formatear la fecha
  const formatDate = (dateString) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }

  return (
    <div className="home-container">
      <h1>Areas Registradas</h1>
      <div className="buscador">
        <button className="boton-buscar">
          <img src={buscador || "/placeholder.svg"} alt="Buscar" />
        </button>
        <input
          type="text"
          placeholder="Buscar por nombre"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="loading">Cargando datos...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <div className="contenedor-tabla">
          <table className="tabla">
            <thead>
              <tr>
                <th>Área</th>
                <th>Nivel/Categoría</th>
                <th>Grado</th>
                <th>Costo (Bs)</th>
                <th>Tipo de Evento</th>
                <th>Fecha Inicio</th>
                <th>Fecha Fin</th>
                <th>Descripción</th>
              </tr>
            </thead>
            <tbody>
              {areas.length > 0 ? (
                areas.map((dato, index) => (
                  <tr key={index}>
                    <td>{dato.area || "-"}</td>
                    <td>{dato.nivel_categoria || "-"}</td>
                    <td>{dato.grado || "-"}</td>
                    <td>{dato.costo || "-"}</td>
                    <td>{dato.tipo_evento || "-"}</td>
                    <td>{formatDate(dato.fecha_inicio) || "-"}</td>
                    <td>{formatDate(dato.fecha_fin) || "-"}</td>
                    <td>{dato.descripcion || "-"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="no-data">
                    No se encontraron resultados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default RegistrarOrganizador