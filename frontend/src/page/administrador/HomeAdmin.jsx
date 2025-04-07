import { Link } from "react-router-dom";
import bannerImage from "../../assets/banner.png";
import areaIcon from "../../assets/areas.png";
import categoriaIcon from"../../assets/Nivel.jpg";
import areaRegIcon from"../../assets/AR.jpeg";
import "../../App.css";

const HomeAdmin = () => {
  return (
    <div className="home-container">
      <div className="admin-welcome-container">
        <h1>Bienvenido al Panel de Administración</h1>
        <p>Administre el evento, gestione personas y defina costos…</p>
      </div>

      <div className="card-grid">
        <Link to="/admin/areas" className="card">
          <img src={areaIcon} alt="Áreas" />
          <span>Áreas</span>
        </Link>

        <Link to="/admin/Registro-categorias" className="card">
          <img src={categoriaIcon} alt="Niveles/Categorías" />
          <span>Niveles/Categorías</span>
        </Link>

        <Link to="/admin/verAreasRegistradas" className="card">
          <img src={areaRegIcon} alt="Ver Áreas Registradas" />
          <span>Ver Áreas Registradas</span>
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
