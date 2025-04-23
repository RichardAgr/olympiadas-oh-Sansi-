import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./HomeRespGest.css";

function HomeRespGest() {
  const [dashboardData, setDashboardData] = useState({
    totalPagos: "0.00",
    competenciasActivas: 0,
    competidoresHabilitados: 0,
    proximaCompetencia: "No hay competencias programadas"
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/estadisticasRespoGestion")
      .then(response => {
        if (response.data.success) {
          setDashboardData(prev => ({
            ...prev,
            ...response.data.data
          }));
        }
      })
      .catch(error => {
        console.error("Hubo un error al obtener los datos:", error);
        setError("Error al cargar los datos del dashboard");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Desestructuración con valores por defecto
  const {
    totalPagos,
    competenciasActivas,
    competidoresHabilitados,
    proximaCompetencia
  } = dashboardData;

  if (loading) {
    return <div className="panel-container">Cargando datos...</div>;
  }

  if (error) {
    return <div className="panel-container error-message">{error}</div>;
  }

  return (
    <div className="panel-container">
      {/* Encabezado */}
      <div className="header-section">
        <h1>Bienvenido al Panel de Gestión</h1>
        <p className="subtext">
          Administre las inscripciones, valide pagos, gestione tutores
        </p>
      </div>

      {/* Cuerpo principal */}
      <div className="main-section">
        {/* Columna izquierda */}
        <div className="left-column">
          {/* Total pagos recibidos */}
          <div className="info-box">
            <h2>Total de Pagos Recibidos</h2>
            <p className="big-number">
              Bs {totalPagos}
            </p>
          </div>

          {/* Botón: Habilitar/Deshabilitar Tutores */}
          <div className="button-box">
            <Link to={"/respGest/EstadoTutores"}>
              <button>Habilitar/Deshabilitar Tutores</button>
            </Link>
            <p>Administre el estado de los tutores</p>
          </div>

          {/* Botón: Habilitar/Deshabilitar Competidores */}
          <div className="button-box">
            <Link to={"/respGest/EstadoCompetidores"}>
              <button>Habilitar/Deshabilitar Competidores</button>
            </Link>
            <p>Administre el estado de los Competidores.</p>
          </div>
        </div>

        {/* Columna derecha */}
        <div className="right-column">
          {/* Competencias activas */}
          <div className="info-box">
            <h2>Competencias Activas</h2>
            <p className="big-number">{competenciasActivas}</p>
            <p className="small-text">Próxima: {proximaCompetencia}</p>
          </div>

          {/* Total competidores habilitados */}
          <div className="info-box">
            <h2>Total Competidores Habilitados</h2>
            <p className="big-number">{competidoresHabilitados}</p>
          </div>

          {/* Botón: Detalle de Competidores */}
          <div className="button-box">
            <Link to={"/respGest/DetalleCompetidoresInscritos"}>
              <button>Detalle de Competidores</button>
            </Link>
            <p>Visualiza detalles de competidores inscritos en competencia</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomeRespGest;