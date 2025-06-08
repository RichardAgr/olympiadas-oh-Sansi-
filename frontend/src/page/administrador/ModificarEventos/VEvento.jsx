import { useState, useEffect } from "react"
import { Calendar, Settings } from "lucide-react"
import {useParams } from "react-router-dom"
import AreaCard from "./areaCard/AreaCard"
import EditCronograma from "./formularioEdicion/EditCronograma"
import Notificacion from "./notificacion/Notificacion"
import api from "../../../components/Tokens/api"
import "./VEvento.css"

const VEvento = () => {
  const { id_competencia } = useParams();
  const [areas, setAreas] = useState([])
  const [selectedArea, setSelectedArea] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [notification, setNotification] = useState(null)
  const [loading, setLoading] = useState(false)

  const showNotification = (message, type = "success") => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 5000)
  }

  useEffect(() => {
    loadAreas()
  }, [])

  const loadAreas = async () => {
    try {
      setLoading(true)
      const response = await api.get(`http://localhost:8000/api/areasRegistradas/${id_competencia}`)
      const areasData = response.data

      const areasWithCronogramas = await Promise.all(
         areasData.map(async (area) => {
           try {
             const cronogramasResponse = await api.get(`http://localhost:8000/api/area/${area.area_id}/cronogramas`)
             return {
               ...area,
               cronogramas: cronogramasResponse.data.cronogramas
             }
           } catch (error) {
             console.error(`Error loading cronogramas for area ${area.area_id}:`, error)
             return { ...area, cronogramas: [] }
           }
         })
       )
       setAreas(areasWithCronogramas)

    } catch (error) {
      console.error("Error loading areas:", error)
      showNotification("Error al cargar las áreas", "error")
    } finally {
      setLoading(false)
    }
  }

  const loadAreaCronogramas = async (areaId) => {
    try {
      const response = await api.get(`http://localhost:8000/api/area/${areaId}/cronogramas`)
      return response.data.cronogramas
    } catch (error) {
      console.error("Error loading area cronogramas:", error)
      showNotification("Error al cargar los cronogramas del área", "error")
      return []
    }
  }

  const handleEditArea = async (area) => {
    try {
      setLoading(true)

      // Cargar cronogramas actualizados del área
      const cronogramas = await loadAreaCronogramas(area.area_id)
      const areaWithCronogramas = { ...area, cronogramas }

      setSelectedArea(areaWithCronogramas)
      setIsModalOpen(true)
    } catch (error) {
      showNotification("Error al cargar los datos del área", "error")
    } finally {
      setLoading(false)
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedArea(null)
  }

  const handleSaveCronogramas = async (updatedCronogramas) => {
    try {
      setLoading(true)

      // Preparar datos para enviar al backend
      const cronogramasData = {
        cronogramas: updatedCronogramas.map((cronograma) => ({
          cronograma_id: cronograma.cronograma_id,
          descripcion: cronograma.descripcion,
          fecha_inicio: cronograma.fecha_inicio,
          fecha_fin: cronograma.fecha_fin,
          tipo_evento: cronograma.tipo_evento,
          anio_olimpiada: cronograma.anio_olimpiada,
        })),
      }
      console.log(cronogramasData)

      const response = await api.put(`http://localhost:8000/api/editarCronograma/${selectedArea.area_id}`, cronogramasData)
    
      if (response.status === 200) {
        setAreas(prevAreas =>
          prevAreas.map(area =>
            area.area_id === selectedArea.area_id
              ? { ...area, cronogramas: response.data.cronogramas }
              : area
          )
        )
    
        showNotification('Cronogramas actualizados exitosamente', 'success')
        handleCloseModal()
      }
      
    } catch (error) {
      console.error("Error saving cronogramas:", error)

      // Manejo específico de errores de Laravel
      if (error.response) {
        const { status, data } = error.response

        switch (status) {
          case 422:
            showNotification(
              `Error de validación: ${data.details ? Object.values(data.details).flat().join(", ") : data.error}`,
              "error",
            )
            break
          case 404:
            showNotification("Área o cronograma no encontrado", "error")
            break
          case 500:
            showNotification("Error interno del servidor", "error")
            break
          default:
            showNotification("Error al guardar los cronogramas", "error")
        }
      } else {
        showNotification("Error de conexión con el servidor", "error")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="area-manager-containerEventA AppEventA">
      <div className="headerEventA">
        <div className="header-iconEventA">
          <Calendar size={48} />
        </div>
        <h1 className="titleEventA">Gestión de Áreas y Cronogramas</h1>
        <p className="subtitleEventA">Administra las áreas de competencia y sus cronogramas</p>
      </div>

      {loading && (
        <div className="loading-overlayEventA">
          <div className="loading-spinnerEventA">
            <Settings className="spin" size={32} />
            <span>Cargando...</span>
          </div>
        </div>
      )}

      <div className="areas-gridEventA">
        {areas.map((area) => (
          <AreaCard key={area.area_id} area={area} onEdit={handleEditArea} loading={loading} />
        ))}
      </div>

      {isModalOpen && selectedArea && (
        <EditCronograma
          area={selectedArea}
          onClose={handleCloseModal}
          onSave={handleSaveCronogramas}
          loading={loading}
        />
      )}
     {notification && (
        <Notificacion message={notification.message} type={notification.type} onClose={() => setNotification(null)} />
      )} 
    </div>
  )
}

export default VEvento

