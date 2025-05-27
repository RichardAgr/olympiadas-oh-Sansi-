import { useEffect, useState } from "react";
import axios from "axios";

import rect34 from "../../assets/Rectangle34.png";
import "./AreasCompetencia.css";

const AreasCompetencia = () => {
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: "" });

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
    <div className="area-container">
      <h1 className="area-title">ÁREAS EN COMPETENCIA</h1>

      {notification.show && (
        <div className="notification">
          {notification.message}
        </div>
      )}

      <div className="area-card" style={{ backgroundImage: `url(${rect34})` }}>
        <div className="area-table-container">
          <table className="area-table">
            <thead>
              <tr>
                <th>Área</th>
                <th>Rango de Grados</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {areas.map((area) => (
                <tr key={area.area_id}>
                  <td>{area.nombre}</td>
                  <td>{getFormattedGradeRange(area.categorias)}</td>
                  <td>
                    <button
                      className="pdf-button"
                      onClick={() => handleDownloadPdf(area.area_id, area.nombre)}
                    >
                      Descargar PDF
                    </button>
                  </td>
                </tr>
              ))}
              {areas.length === 0 && (
                <tr>
                  <td colSpan="3">No hay áreas para mostrar.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AreasCompetencia;