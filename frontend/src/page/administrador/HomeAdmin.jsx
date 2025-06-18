import { Link, useParams } from "react-router-dom";
import bannerImage from "../../assets/banner.png";
import areaIcon from "../../assets/areas.png";
import categoriaIcon from"../../assets/Nivel.jpg";
import areaRegIcon from"../../assets/AR.jpeg";
import "../../App.css";

const HomeAdmin = () => {
  
  const { id_competencia } = useParams();
  return (
    <div className="home-container">
      <div className="admin-welcome-container">
        <h1>Bienvenido al Panel de Administración</h1>
        <p>Administre el evento, gestione personas y defina costos…</p>
      </div>

      <div className="card-grid">
        <Link to={`/admin/HomeAdmin/${id_competencia}/areas`} className="card">
          <img src={areaIcon} alt="Áreas" />
          <span>Áreas</span>
        </Link>

        <Link to={`/admin/HomeAdmin/${id_competencia}/Registro-categorias`} className="card">
          <img src={categoriaIcon} alt="Niveles/Categorías" />
          <span>Niveles/Categorías</span>
        </Link>

        <Link to={`/admin/HomeAdmin/${id_competencia}/verAreasRegistradas`} className="card">
          <img src={areaRegIcon} alt="Ver Áreas Registradas" />
          <span>Ver Áreas Registradas</span>
        </Link>

        <Link to="configurar/datosCompetencia" className="card">
          <img src="https://ohsansi.umss.edu.bo/user/themes/quark/images/logo.png" alt="Logo oh sansi" />
          <span>Configurar Competencia</span>
        </Link>
      </div>


      <div className="banner">
        <img src={bannerImage} alt="Banner Olimpiadas" />
        <div className="banner-text">
          <h2>PRÓXIMAS OLIMPIADAS INICIA</h2>
          <p>01 - Septiembre - 2025</p>
        </div>
      </div>
    </div>
  );
};

export default HomeAdmin;
