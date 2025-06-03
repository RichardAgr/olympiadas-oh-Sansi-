import { use, useEffect, useState } from "react";
import axios from "axios";
import fondo from "../../assets/fondo_areasCompetencia.png";
import { CalendarDays, MapPin } from "lucide-react";
import "./AreasCompetencia.css";

const AreasCompetencia = () => {
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: "" });
  //Buscador
  const [searchTerm, setSearchTerm]=useState("");
  const normalizeText = (text) =>
  text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const filteredAreas = areas.filter(area =>
  normalizeText(area.nombre).includes(normalizeText(searchTerm))
);
  //Fin Buscador

  const extractGradeInfo = (gradeString) => {
    const match = gradeString.match(/(\d+)\w+\s(Primaria|Secundaria)/);
    return match ? {
      number: parseInt(match[1]),
      level: match[2]
    } : null;
  };

  const getFormattedGradeRange = (categorias) => {
    if (!categorias || categorias.length === 0) return "No especificado";
    

    const allGrades = categorias.flatMap(categoria => {
      if (categoria.rango_grado.includes(" a ")) {
        const [start, end] = categoria.rango_grado.split(" a ");
        return [
          extractGradeInfo(start),
          extractGradeInfo(end)
        ];
      }
      return [extractGradeInfo(categoria.rango_grado)];
    }).filter(Boolean);

    if (allGrades.length === 0) return "No especificado";

    const primariaGrades = allGrades.filter(g => g.level === "Primaria");
    const secundariaGrades = allGrades.filter(g => g.level === "Secundaria");

    const minPrimaria = primariaGrades.length > 0 ? 
      Math.min(...primariaGrades.map(g => g.number)) : null;
    const maxPrimaria = primariaGrades.length > 0 ? 
      Math.max(...primariaGrades.map(g => g.number)) : null;

    const minSecundaria = secundariaGrades.length > 0 ? 
      Math.min(...secundariaGrades.map(g => g.number)) : null;
    const maxSecundaria = secundariaGrades.length > 0 ? 
      Math.max(...secundariaGrades.map(g => g.number)) : null;

    // Construir el string de resultado
    let result = "";
    
    if (minPrimaria !== null && maxPrimaria !== null) {
      result += `${minPrimaria}° Primaria`;
      
      if (minSecundaria !== null && maxSecundaria !== null) {
        result += ` a ${maxSecundaria}° Secundaria`;
      } else if (maxPrimaria !== minPrimaria) {
        result += ` a ${maxPrimaria}° Primaria`;
      }
    } else if (minSecundaria !== null && maxSecundaria !== null) {
      result += `${minSecundaria}° Secundaria`;
      if (maxSecundaria !== minSecundaria) {
        result += ` a ${maxSecundaria}° Secundaria`;
      }
    }

    return result || "No especificado";
  };

  const handleDownloadPdf = async (areaId, areaNombre) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/documentos-areas/${areaId}`);
      
      if (response.data.success && response.data.url_pdf) {
        const link = document.createElement('a');
        link.href = response.data.url_pdf;
        link.download = `Documentación_${areaNombre}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        setNotification({
          show: true,
          message: response.data.message || `El área ${areaNombre} no tiene documentación PDF disponible`
        });
      }
    } catch (error) {
      console.error("Error al descargar el PDF:", error);
      setNotification({
        show: true,
        message: `Error al intentar descargar la documentación de ${areaNombre}`
      });
    }
  };

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/areasCategoriasGrados")
      .then((res) => {
        if (res.data && res.data.success && Array.isArray(res.data.data)) {
          setAreas(res.data.data);
          setError(null);
        } else {
          setError("Los datos no están en el formato esperado.");
          setAreas([]);
        }
      })
      .catch((err) => {
        console.error("Error al cargar las áreas:", err);
        setError("Error al cargar las áreas.");
        setAreas([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => {
        setNotification({ show: false, message: "" });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification.show]);

  if (loading) {
    return <div>Cargando áreas...</div>;
  }

  if (error) {
    return <div style={{ color: "red" }}>{error}</div>;
  }

  return (
    <div className="imagen-AreasCompetencia"
    style={{ backgroundImage: `url(${fondo})` }}>
    <div className="eventoH-grid-container" >
      {notification.show && ( // Mostrar notificación si está activa
        <div className="notificationAreaCom"> 
          {notification.message}
        </div>
      )}
      <div >
        <h1 className="area-title">ÁREAS EN COMPETENCIA</h1>
        <div className="buscadorHomePage-wrapper">
  <input
    type="text"
    placeholder="Buscar área por nombre..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value.replace(/[^a-zA-ZñÑáéíóúÁÉÍÓÚ\s]/g, ''))}
    className="buscadorHomePage-input"
  />
</div>

      <div className="eventoH-card-grid">
          {/*Inicio Mapeo*/}
          {filteredAreas.map((area) => (
        <div key={area.area_id} className="eventoH-card" > 
            {/* 🏷️ Area Name */}
            <h3 className="eventoH-nombre" >{area.nombre}</h3>
            <p >{getFormattedGradeRange(area.categorias)}</p>
            {/* 📅 Fecha de Inscripción */}
            <div className="eventoH-info-group">
              <p className="eventoH-info-label">Fecha de Inscripción:</p>
              <div
                className="eventoH-icon-row"
              >
                <CalendarDays size={20} className="eventoH-icon clickable calendar" />
                <span className="eventoH-info-value">
                  {area.fecha_inscripcion_inicio} al {area.fecha_inscripcion_fin}
                </span>
              </div>
            </div>
            {/* 📆 Fecha de Competencia */}
            <div className="eventoH-info-group">
              <p className="eventoH-info-label">Fecha de Competencia:</p>
              <div
                className="eventoH-icon-row"
                
              >
                <CalendarDays size={20} className="eventoH-icon clickable calendar" />
                <span className="eventoH-info-value">
                  {area.fecha_competencia_inicio} al {area.fecha_competencia_fin}
                </span>
              </div>
            </div>

            {/* 📆 Fecha de Competencia */}
            <div className="eventoH-info-group">
              <p className="eventoH-info-label">Fecha de Culminacion:</p>
              <div
                className="eventoH-icon-row"
                
              >
                <CalendarDays size={20} className="eventoH-icon clickable calendar" />
                <span className="eventoH-info-value">
                  {area.fecha_fin_inicio} al {area.fecha_fin_fin}
                </span>
              </div>
            </div>

            {/* 📍 Lugar */}
            <div className="eventoH-location-row">
              <MapPin size={20} className="evento-icon" />
              <span className="eventoH-info-value location">
               Cochabamba-Bolivia
              </span>
            </div>
             <button
                className="pdf-button"
                onClick={() => handleDownloadPdf(area.area_id, area.nombre)}
                >
                Descargar PDF
              </button>
          </div>
          ))}
              {filteredAreas.length === 0 && (
  <div className="no-resultsBuscadorHomePage">
    No se encontraron áreas con ese nombre.
  </div>
)}
        {/*//Finaliza el mapeo de áreas*/ }
        
      </div>
    </div>
    </div>
    </div>
    
  );
};

export default AreasCompetencia;