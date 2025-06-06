import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import ComponenteCompetenciaForm from "./componentesCompe/crearCompetencia/ComponenteCompetenciaForm"
import FormEditar from "./componentesCompe/modalEditar/FormEditar"
import NotificacionCompetencia from "./componentesCompe/notificacionCompetencia/NotificacionCompetencia"
import ModalDelete from "./componentesCompe/modalDelete/ModalDelete"
import axios from "axios"
import "./crearCompetenciaAdmin.css"

const CrearCompetenciaAdmin = () => {
  const [activeTab, setActiveTab] = useState("lista") // 'lista' o 'crear'
  const [competencias, setCompetencias] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [notifications, setNotifications] = useState([])
  const [editModal, setEditModal] = useState({ isOpen: false, competencia: null })
    const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    competencia: null,
    action: null,
  })
  const navigate = useNavigate()
  const handleLogout = async () => {
    try {
      await axios.post("http://127.0.0.1:8000/api/logout", {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`
        }
      });

      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      localStorage.removeItem("rol");

      navigate("/homePrincipal");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      localStorage.clear();
      navigate("/homePrincipal");
    }
  };

  useEffect(() => {
    cargarCompetencias()
  }, [])

  const cargarCompetencias = async () => {
    setLoading(true)
    try {
      const response = await axios.get('http://localhost:8000/api/obtenerCompetencias');
      console.log(response.data.data)
      setCompetencias(response.data.data);
      setLoading(false)
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
      await axios.patch(`http://localhost:8000/api/${competenciaId}/estado`, {
        estado: nuevoEstado
      });
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

  const eliminarCompetencia= async (competenciaId)=>{
    try {
      await axios.delete(`http://localhost:8000/api/eliminarCompetencia/${competenciaId}`)
      setCompetencias((prev) => prev.filter((comp) => comp.competencia_id !== competenciaId))
    showNotification("Competencia eliminada exitosamente")
    } catch (error) {
      console.error("Error al eliminar competencia:", error)
      showNotification("Error al eliminar la competencia", "error")      
    }
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
  navigate(`/admin/HomeAdmin/${competenciaId}`)
}

    const handleDeleteClick = (competencia) => {
    setConfirmModal({
      isOpen: true,
      competencia,
      action: "delete",
    })
  }

    const handleConfirmDelete = () => {
    if (confirmModal.competencia) {
      eliminarCompetencia(confirmModal.competencia.competencia_id)
    }
    setConfirmModal({ isOpen: false, competencia: null, action: null })
  }

  const handleCloseConfirmModal = () => {
    setConfirmModal({ isOpen: false, competencia: null, action: null })
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
  if (!fecha) return "Fecha no definida"; 
  
  const opciones = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC' 
  };

  try {
    const fechaObj = new Date(fecha);
    
    if (isNaN(fechaObj.getTime())) {
      throw new Error('Fecha inválida');
    }
    
    return fechaObj.toLocaleDateString('es-ES', opciones);
  } catch (error) {
    console.error('Error al formatear fecha:', error);
    return "Fecha inválida";
  }
}

  const onCompetenciaCreada = (nuevaCompetencia) => {
    setCompetencias((prev) => [...prev, nuevaCompetencia])
    setActiveTab("lista")
  }

  return (
    <div className="containerHomeCompCrear">
      <div className="headerHomeCompCrear">
        <h1 className="titleHomeCompCrear">Gestión de Competencias</h1>
        <p className="subtitleHomeCompCrear">Administra y supervisa todas las competencias</p>
      </div>

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
        <button className="tabButtonCompCrear" onClick={handleLogout} > 🚪 Cerrar Sesión </button>
      </div>

      {/* Content */}
      <div className="contentContainerCompCrear">
        {activeTab === "lista" ? (
          <div className="listaContainerCompCrear">
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
                        <button onClick={() => handleDeleteClick(competencia)} className="destroyButtonCompCrear">
                          Eliminar
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

      <ModalDelete
        isOpen={confirmModal.isOpen}
        onClose={handleCloseConfirmModal}
        onConfirm={handleConfirmDelete}
        title="¿Eliminar Competencia?"
        message={`¿Estás seguro de que deseas eliminar la competencia "${confirmModal.competencia?.nombre_competencia}"? Esta acción no se puede deshacer.`}
        confirmText="Sí, Eliminar"
        cancelText="Cancelar"
        type="danger"
      />
    </div>
  )
}

export default CrearCompetenciaAdmin