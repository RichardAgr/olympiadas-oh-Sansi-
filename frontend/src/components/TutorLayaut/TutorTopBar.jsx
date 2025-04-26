import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useParams, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import { UserCircle, Bell } from "lucide-react";
import "./estilosTopBar.css";

const TutorTopBar = () => {
  const [showRolesMenu, setShowRolesMenu] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // 👉 responsive menu
  const timeoutRef = useRef(null);
  const location = useLocation();
 

  // 👉 ID temporal estático desde el backend
  const {id}= useParams();
  const navigate = useNavigate(); // Para manejar la navegación programáticamente
  const [userMenuOpen, setUserMenuOpen] = useState(false); 

  const handleViewNotificacion = () => {
    navigate(`/homeTutor/${id}/tutor/NotificacionesTutor`);
  }

  useEffect(() => {
    setShowRolesMenu(false);
    setMenuOpen(false); // Cierra el menú al cambiar de ruta
  }, [location.pathname]);

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen)
  }

  return (
    <nav className="topbar">
      <div className="topbar-left">
        <img src={logo} alt="Logo" className="logo" />

        <button
          className="hamburger-btn"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Abrir menú"
        >
          ☰
        </button>
      </div>

      <ul className={`topbar-menu ${menuOpen ? "show" : ""}`}>
        <li>
          <Link
            to={`/homeTutor/${id}/tutor`}
            className={location.pathname == (`/homeTutor/${id}/tutor`) ? "active" : ""}
          >
            Inicio
          </Link>
        </li>

        <li className="roles-dropdown">
          <Link
            to={`/homeTutor/${id}/tutor/ListaCompetidores`}
            className={location.pathname.startsWith (`/homeTutor/${id}/tutor/ListaCompetidores`)   ? "active" : ""  }
          >
            Competidores
          </Link>
        </li>
        
        <li className="roles-dropdown">
          <Link to={`/homeTutor/${id}/tutor/VerBoletas`}
            className={location.pathname === `/homeTutor/${id}/tutor/VerBoletas`  ? "active" : ""}>
          Boletas de Pagos 
          </Link>
        </li>

        <li>
          <button className="notification-button" aria-label="Notificaciones"
            onClick={handleViewNotificacion}>
            <Bell size={22} color="#0A2E8C" />
          </button>
        </li>

        <li className="user-dropdown" onClick={toggleUserMenu}>
          <div className="admin-badge">
            <UserCircle size={22} color="white" />
            <span>Tu</span>
          </div>
          {userMenuOpen && (
            <ul className="dropdown-menu">
              <li><Link to={`/homeTutor/${id}/tutor/MiPerfil`}>Mi perfil</Link></li>
              <li><Link to={`/homeTutor/${id}/tutor/Configuracion`}>Configuración</Link></li>
              <li><Link to={`/login`}>Cerrar Sesion</Link></li>
            </ul>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default TutorTopBar;
