import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react"
import {UserRoundPen,FileSpreadsheet,Upload} from "lucide-react"
import { getTutorById} from "../../../../public/riki/homeTutor/datosTutor";
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
        const response = await getTutorById(id)
        setTutor(response)
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
    console.log("Inscripción manual iniciada")
    // Aquí iría la lógica para abrir un formulario de inscripción manual
  }

  const handleExcelUpload = () => {
    navigate(`/homeTutor/${id}/tutor/InscripcionExcel`)
  }

  const handleUploadClick = () => {
    console.log("Subir comprobante")
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
      <div className="right-column">
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
          <span className="upload-icon"><Upload/></span>
          Subir
        </button>
      </div>
    </div>
      </div>
    </div>
  );
}

export default TutorHome;