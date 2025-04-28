import { useParams} from 'react-router-dom';
import { useState, useEffect } from "react"
import { getNotificacionesByUsuario} from '../../../../public/riki/HU25/notificacion';
import NotificacionesList from '../../../components/notificacionesList/NotificacionesList';
import "./notificacionesTutor.css"

function NotificacionesTutor() {
  const [notificaciones, setNotificaciones] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { id } = useParams();
  useEffect(() => {
    const fetchNotificaciones = async () => {
      try {
        setLoading(true)
        const data = await getNotificacionesByUsuario(id)
        setNotificaciones(data[id] || [])
      } catch (err) {
        setError("Error al cargar las notificaciones")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchNotificaciones()
  }, [id])

  return (
    <div className="app-container">
      <h1>Notificaciones</h1>
      {loading ? (
        <p>Cargando notificaciones...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        
        <NotificacionesList notificaciones={notificaciones} setNotificaciones={setNotificaciones} />
      )}
    </div>
  ); 
}

export default NotificacionesTutor;
