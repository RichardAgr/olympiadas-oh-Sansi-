import { useState, useEffect } from "react"
import ComponenteCompetenciaForm from "./componentesCompe/crearCompetencia/ComponenteCompetenciaForm"
import FormEditar from "./componentesCompe/modalEditar/FormEditar"
import NotificacionCompetencia from "./componentesCompe/notificacionCompetencia/NotificacionCompetencia"
import "./crearCompetenciaAdmin.css"

const CrearCompetenciaAdmin = () => {
  const [activeTab, setActiveTab] = useState("lista") // 'lista' o 'crear'
  const [competencias, setCompetencias] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterEstado, setFilterEstado] = useState("todos") // 'todos', 'activo', 'inactivo'
  const [notifications, setNotifications] = useState([])
  const [editModal, setEditModal] = useState({ isOpen: false, competencia: null })

  // Datos de ejemplo (remover cuando implementes la API real)
  const competenciasEjemplo = [
    {
      competencia_id: 1,
      nombre_competencia: "Olimpiada de Matematicas 2024",
      descripcion: "Competencia nacional de matemáticas para estudiantes de secundaria",
      fecha_inicio: "2024-03-15",
      fecha_fin: "2024-03-20",
      estado: true,
    },
    {
      competencia_id: 2,
      nombre_competencia: "Concurso de Ciencias 2024",
      descripcion: "Competencia de ciencias naturales y experimentales",
      fecha_inicio: "2024-04-10",
      fecha_fin: "2024-04-15",
      estado: false,
    },
    {
      competencia_id: 3,
      nombre_competencia: "Festival de Robotica 2024",
      descripcion: "Competencia de robótica y programación para jóvenes innovadores",
      fecha_inicio: "2024-05-01",
      fecha_fin: "2024-05-05",
      estado: true,
    },
  ]

  // Cargar competencias al montar el componente
  useEffect(() => {
    cargarCompetencias()

  }, [])

  const cargarCompetencias = async () => {
    setLoading(true)
    try {
      // AQUÍ DEBES IMPLEMENTAR LA LLAMADA A LA API PARA OBTENER COMPETENCIAS
      // Ejemplo de cómo sería la llamada con axios:
      /*
      const response = await axios.get('http://tu-api-url/competencias');
      setCompetencias(response.data);
      */

      // Simulación de carga (remover cuando implementes la API real)
      setTimeout(() => {
        setCompetencias(competenciasEjemplo)
        setLoading(false)
      }, 1000)
    } catch (error) {
      console.error("Error al cargar competencias:", error)
      setLoading(false)
    }
  }

  const showNotification = (message, type = "success") => {
    const id = Date.now()
    const notification = { id, message, type }
    setNotifications((prev) => [...prev, notification])
  }

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  // Cambiar estado de competencia (activar/desactivar)
  const toggleEstadoCompetencia = async (competenciaId, nuevoEstado) => {
    try {
      // AQUÍ DEBES IMPLEMENTAR LA LLAMADA A LA API PARA ACTUALIZAR EL ESTADO
      // Ejemplo de cómo sería la llamada con axios:
      /*
      await axios.patch(`http://tu-api-url/competencias/${competenciaId}`, {
        estado: nuevoEstado
      });
      */

      // Actualizar estado local (simulación)
      setCompetencias((prev) =>
        prev.map((comp) => (comp.competencia_id === competenciaId ? { ...comp, estado: nuevoEstado } : comp)),
      )

      showNotification(`Competencia ${nuevoEstado ? "activada" : "desactivada"} exitosamente`)
    } catch (error) {
      console.error("Error al actualizar estado:", error)
      showNotification("Error al actualizar el estado de la competencia", "error")
    }
  }

  const handleEdit = (competencia) => {
    setEditModal({ isOpen: true, competencia })
  }

  const handleCloseModal = () => {
    setEditModal({ isOpen: false, competencia: null })
  }

  const handleSaveEdit = (competenciaActualizada, message, type = "success") => {
    if (competenciaActualizada) {
      setCompetencias((prev) =>
        prev.map((comp) =>
          comp.competencia_id === competenciaActualizada.competencia_id ? competenciaActualizada : comp,
        ),
      )
    }
    showNotification(message, type)
    setEditModal({ isOpen: false, competencia: null })
  }

  const handleViewDetails = (competenciaId) => {
    // Aquí puedes usar Next.js router para navegar
    window.location.href = `/competencia/${competenciaId}`
  }

  // Filtrar competencias
  const competenciasFiltradas = competencias.filter((comp) => {
    return (
      comp.nombre_competencia.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comp.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  // Formatear fecha para mostrar
  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Callback cuando se crea una nueva competencia
  const onCompetenciaCreada = (nuevaCompetencia) => {
    setCompetencias((prev) => [...prev, nuevaCompetencia])
    setActiveTab("lista")
  }

  return (
    <div className="containerHomeCompCrear">
      {/* Header */}
      <div className="headerHomeCompCrear">
        <h1 className="titleHomeCompCrear">Gestión de Competencias</h1>
        <p className="subtitleHomeCompCrear">Administra y supervisa todas las competencias</p>
      </div>

      {/* Navigation Tabs */}
      <div className="tabsContainerCompCrear">
        <button
          className={`tabButtonCompCrear ${activeTab === "lista" ? "activeTabCompCrear" : ""}`}
          onClick={() => setActiveTab("lista")}
        >
          <span className="tabIconCompCrear">📋</span>
          Ver Competencias
        </button>
        <button
          className={`tabButtonCompCrear ${activeTab === "crear" ? "activeTabCompCrear" : ""}`}
          onClick={() => setActiveTab("crear")}
        >
          <span className="tabIconCompCrear">➕</span>
          Crear Competencia
        </button>
      </div>

      {/* Content */}
      <div className="contentContainerCompCrear">
        {activeTab === "lista" ? (
          <div className="listaContainerCompCrear">
            {/* Filters and Search */}
            <div className="filtersContainerCompCrear">
              <div className="searchContainerCompCrear">
                <input
                  type="text"
                  placeholder="Buscar competencias..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="searchInputCompCrear"
                />
                <span className="searchIconCompCrear">🔍</span>
              </div>
            </div>

            {/* Loading */}
            {loading && (
              <div className="loadingContainerCompCrear">
                <div className="loadingSpinnerCompCrear"></div>
                <p>Cargando competencias...</p>
              </div>
            )}

            {/* Competencias List */}
            {!loading && (
              <div className="competenciasGridCompCrear">
                {competenciasFiltradas.length === 0 ? (
                  <div className="emptyStateCompCrear">
                    <div className="emptyIconCompCrear">📝</div>
                    <h3>No hay competencias</h3>
                    <p>No se encontraron competencias que coincidan con los filtros aplicados.</p>
                    <button onClick={() => setActiveTab("crear")} className="createFirstButtonCompCrear">
                      Crear primera competencia
                    </button>
                  </div>
                ) : (
                  competenciasFiltradas.map((competencia) => (
                    <div key={competencia.competencia_id} className="competenciaCardCompCrear">
                      <div className="cardHeaderCompCrear">
                        <h3 className="cardTitleCompCrear">{competencia.nombre_competencia}</h3>
                        <div
                          className={`statusBadgeCompCrear ${competencia.estado ? "activeBadgeCompCrear" : "inactiveBadgeCompCrear"}`}
                        >
                          {competencia.estado ? "Activo" : "Inactivo"}
                        </div>
                      </div>

                      <p className="cardDescriptionCompCrear">{competencia.descripcion}</p>

                      <div className="cardDatesCompCrear">
                        <div className="dateItemCompCrear">
                          <span className="dateLabelCompCrear">Inicio:</span>
                          <span className="dateValueCompCrear">{formatearFecha(competencia.fecha_inicio)}</span>
                        </div>
                        <div className="dateItemCompCrear">
                          <span className="dateLabelCompCrear">Fin:</span>
                          <span className="dateValueCompCrear">{formatearFecha(competencia.fecha_fin)}</span>
                        </div>
                      </div>

                      <div className="cardActionsCompCrear">
                        <button
                          onClick={() => toggleEstadoCompetencia(competencia.competencia_id, !competencia.estado)}
                          className={`actionButtonCompCrear ${competencia.estado ? "deactivateButtonCompCrear" : "activateButtonCompCrear"}`}
                        >
                          {competencia.estado ? "🔴 Desactivar" : "🟢 Activar"}
                        </button>

                        <button onClick={() => handleEdit(competencia)} className="editButtonCompCrear">
                          Editar
                        </button>

                        <button
                          onClick={() => handleViewDetails(competencia.competencia_id)}
                          className="viewButtonCompCrear"
                        >
                          Ir a Competencia
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="crearContainerCompCrear">
            <ComponenteCompetenciaForm onCompetenciaCreada={onCompetenciaCreada} />
          </div>
        )}
      </div>
      {/* Notificaciones */}
      {notifications.map((notification) => (
        <NotificacionCompetencia
          key={notification.id}
          message={notification.message}
          type={notification.type}
          onClose={() => removeNotification(notification.id)}
        />
      ))}

      {/* Modal de Edición */}
     <FormEditar
        competencia={editModal.competencia}
        isOpen={editModal.isOpen}
        onClose={handleCloseModal}
        onSave={handleSaveEdit}
      /> 
    </div>
  )
}

export default CrearCompetenciaAdmin