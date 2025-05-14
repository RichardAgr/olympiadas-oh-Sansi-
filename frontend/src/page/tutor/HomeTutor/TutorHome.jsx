import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react"
import {UserRoundPen,FileSpreadsheet,Upload} from "lucide-react"
import axios from "axios"
import './tutorHome.css'


function TutorHome () {
  const navigate = useNavigate()
  const {id}= useParams();
  const [tutor, setTutor] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchTutorData = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/tutor/perfil/${id}`)
        setTutor(response.data)
        setLoading(false)
      } catch (err) {
        console.error("Error al obtener datos del tutor:", err)
        setError("No se pudieron cargar los datos del tutor")
        setLoading(false)
      }
    }
    
    fetchTutorData()
  }, [id])

  const handleManualInscription = () => {
    // Aquí iría la lógica para abrir un formulario de inscripción manual
    navigate(`/homeTutor/${id}/tutor/InscribirManual/`);
  }

  const handleExcelUpload = () => {
    navigate(`/homeTutor/${id}/tutor/InscripcionExcel`)
  }

  const handleUploadClick = () => {
    navigate(`/homeTutor/${id}/tutor/SubirComprobante`)
  }

  const viewRecibe = () => {
    navigate(`/homeTutor/${id}/tutor/VerRecibos`)
  }

    const viewRecibe2 = () => {
    navigate(`/homeTutor/${id}/tutor/VerRecibos2`)
  }

  if (loading) return <div className="loading">Cargando...</div>
  if (error) return <div className="error">{error}</div>
  if (!tutor) return <div className="error">No se encontró el tutor</div>
  
  return (
    <div className="tutor-home-container">
      <div className="left-column">
      <div className="informacion-general">
      <h2>Información General</h2>

      <div className="datos-personales-card">
        <h3>Datos personales del tutor</h3>
        <div className="datos-container">
          <div className="dato-field">
            <label>Nombres:</label>
            <div className="dato-value">{tutor.nombres}</div>
          </div>

          <div className="dato-field">
            <label>Apellidos:</label>
            <div className="dato-value">{tutor.apellidos}</div>
          </div>

          <div className="dato-field">
            <label>Correo Electrónico:</label>
            <div className="dato-value">{tutor.correo_electronico}</div>
          </div>

          <div className="dato-field">
            <label>CI:</label>
            <div className="dato-value">{tutor.ci}</div>
          </div>

          <div className="dato-field">
            <label>Teléfono:</label>
            <div className="dato-value">{tutor.telefono}</div>
          </div>
        </div>
      </div>

      <div className="contador-card">
        <h3>Cantidad Competidores Asignados:</h3>
        <div className="contador-value">{tutor.competidores_asignados}</div>
      </div>

      <div className="contador-card areas-card">
        <h3>Areas Asignadas:</h3>
        <div className="contador-value">{tutor.areas_asignadas}</div>
      </div>
    </div>


      </div>
      <div className="right-columnTutor">
      <div className="inscribir-competidores-card">
      <h3>Inscribir Competidores:</h3>
      <div className="buttons-container">
        <button className="inscribir-btn manual-btn" onClick={handleManualInscription}>
          <span className="icon"><UserRoundPen/></span>
          Manualmente
        </button>

        <button className="inscribir-btn excel-btn" onClick={handleExcelUpload}>
          <span className="icon"><FileSpreadsheet/></span>
          Excel
        </button>
      </div>
    </div>
    <div className="subir-comprobante-card">
      <h3>Subir Comprobante de Pago:</h3>
      <div className="upload-container">
        <button className="upload-btn" onClick={handleUploadClick}>
          <span className="upload-iconHome"><Upload/></span>
          Subir
        </button>
      </div>
    </div>
    <div className="subir-comprobante-card"onClick={viewRecibe}>
      <h3>Ver Recibos:</h3>
      <div className="upload-container">
       <p>
        Los recibos que se muestran son los que se tienen que llevar para hacer la cancelacion de la inscripcion.
       </p>
      </div>
    </div>
    <div className="subir-comprobante-card"onClick={viewRecibe2}>
      <h3>Preuebas:</h3>
      <div className="upload-container">
      </div>
    </div>
      </div>
    </div>
  );
}

export default TutorHome;