import "./VRegistroOrg.css"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import "../../App.css"

function RegistrarOrganizador() {
  const navigate = useNavigate()
  const [search, setSearch] = useState("")
  const [areas, setAreas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const cargarAreas = async () => {
    try {
      setLoading(true)
      const response = await axios.get("http://127.0.0.1:8000/api/areasRegistradas")
      const flattenedData = response.data.data.flatMap(item => item.data)
      setAreas(flattenedData)
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

  const formatDate = (dateString) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }

  const filteredAreas = areas.filter(area =>
    area.area?.toLowerCase().includes(search.toLowerCase())
  )

  const totalPages = Math.ceil(filteredAreas.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const currentItems = filteredAreas.slice(startIndex, startIndex + itemsPerPage)

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  return (
    <div className="home-container">
      <h1>Áreas Registradas</h1>

      {/* Input suelto (fuera del contenedor buscador) */}
      <input
        type="text"
        placeholder="Buscar por nombre"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value)
          setCurrentPage(1)
        }}
        className="input-busqueda"
      />

      {loading ? (
        <div className="loading">Cargando datos...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <>
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
                {currentItems.length > 0 ? (
                  currentItems.map((dato, index) => (
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

          {/* PAGINACIÓN */}
          {totalPages > 1 && (
            <div className="pagination">
              <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>{"<"}</button>
              {Array.from({ length: Math.min(10, totalPages) }, (_, i) => {
                const half = Math.floor(10 / 2)
                let startPage = Math.max(currentPage - half, 1)
                let endPage = startPage + 9
                if (endPage > totalPages) {
                  endPage = totalPages
                  startPage = Math.max(endPage - 9, 1)
                }
                const page = startPage + i
                if (page > totalPages) return null
                return (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={currentPage === page ? "active" : ""}
                  >
                    {page}
                  </button>
                )
              })}
              <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>{">"}</button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default RegistrarOrganizador

