import { useState, useEffect } from "react"
import {useParams } from "react-router-dom";
import { GraduationCap, Megaphone, Video} from "lucide-react"
 import PdfUploader from "../../../components/pdfConfiguracionData/pdfUploader"
import VideoUploader from "../../../components/videoUplaodaer/VideosUpLoader"
import axios from "axios";
import "./ConfigurarDatosCompetencia.css"

export default function ConfigurarDatosCompetencia() {
  const { id_competencia } = useParams();
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/areasCategoriasGrados/${id_competencia}`);
        if (response.data.success) {
          setAreas(response.data.data);
        }
      } catch (err) {
        setError("Error al cargar las áreas");
        console.error("Error fetching areas:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAreas();
  }, []);

  if (loading) {
    return <div className="ContainerConfigData">Cargando áreas...</div>;
  }

  if (error) {
    return <div className="ContainerConfigData">{error}</div>;
  }
  
  return (
    <div className="ContainerConfigData">
      <div className="page-headerConfigData">
        <h1 className="titulo-configData">Portal de Competencias Académicas</h1>
        <p>Sube y administra documentos y videos de las competencias</p>
      </div>

      <section id="areas-section" className="areas-section">
        <h2 className="section-titleConfigData">
          <GraduationCap className="section-icon" /> Áreas Académicas
        </h2>
        <div className="cards-container">
              {areas.map((area) => (
                  <PdfUploader 
                        idArchivo={area.area_id} 
                        title={area.nombre} 
                        type="area"
            />
          ))}
        </div>
      </section>

      <section id="convocatoria-section" className="convocatoria-section">
        <h2 className="section-titleConfigData">
          <Megaphone className="section-icon" /> Convocatoria
        </h2>
        <div className="cards-container">
          <PdfUploader idArchivo={id_competencia} title="Convocatoria Oficial" type="convocatoria"/>
        </div>
      </section>

      <section id="videos-section" className="videos-section">
        <h2 className="section-titleConfigData">
          <Video className="section-icon" /> Videos Instructivos
        </h2>
        <div className="cards-container">
          <VideoUploader title="Inscripcion Manual" type="manual" />
          <VideoUploader title="Inscripcion con Excel" type="excel" />
          <VideoUploader title="Subir Boleta de Pago"  type="boleta" />
        </div>
      </section>
    </div>
  )
}
