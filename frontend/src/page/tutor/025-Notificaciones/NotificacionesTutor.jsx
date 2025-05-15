import { useParams} from 'react-router-dom';
import { useState, useEffect } from "react"
import NotificacionesList from '../../../components/notificacionesList/NotificacionesList';
import axios from  "axios"
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
        const response = await axios.get(`http://127.0.0.1:8000/api/tutor/VerNotificaciones/${id}/Notificaciones`)
        setNotificaciones(response.data.data || [])
      } catch (err) {
        setError(`Error al cargar las notificaciones:${err.message}`)
        console.error(err.message)
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
        
        <NotificacionesList idTutor={id} notificaciones={notificaciones} setNotificaciones={setNotificaciones} />
      )}
    </div>
  ); 
}

export default NotificacionesTutor;
