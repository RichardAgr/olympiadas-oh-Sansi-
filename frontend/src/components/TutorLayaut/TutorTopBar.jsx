import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useParams, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import { UserCircle, Bell } from 'lucide-react';
import axios from "axios";
import "./estilosTopBar.css";
import "../estilos/estilosTopBar.css";

const TutorTopBar = () => {
  const [showRolesMenu, setShowRolesMenu] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // 👉 responsive menu
  const [notificationCount, setNotificationCount] = useState(0); // Estado para el contador de notificaciones
  const timeoutRef = useRef(null);
  const location = useLocation();
 
  // 👉 ID temporal estático desde el backend
  const {id} = useParams();
  const navigate = useNavigate(); // Para manejar la navegación programáticamente
  const [userMenuOpen, setUserMenuOpen] = useState(false); 

  // Función para obtener el conteo de notificaciones
  useEffect(() => {
    const fetchNotificationCount = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/notificaciones/${id}`);
        if (response.data.success && response.data.data) {
          setNotificationCount(response.data.data.total_activas);
        }
      } catch (error) {
        console.error("Error al obtener notificaciones:", error);
      }
    };

    fetchNotificationCount();
    
    // Opcional: Configurar un intervalo para actualizar las notificaciones periódicamente
    const intervalId = setInterval(fetchNotificationCount, 60000); // Actualizar cada minuto
    
    return () => clearInterval(intervalId); // Limpiar el intervalo al desmontar
  }, [id]);

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
        <img src={logo || "/placeholder.svg"} alt="Logo" className="logo" />

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
            <div className="notification-icon-container">
              <Bell size={22} color="#0A2E8C" />
              {notificationCount > 0 && (
                <span className="notification-badge">{notificationCount}</span>
              )}
            </div>
          </button>
        </li>

        <li className="user-menu" onClick={toggleUserMenu}>
          <div className="menu-toggle">
            <UserCircle size={22} color="white" />
            <span>Tu</span>
          </div>
          {userMenuOpen && (
            <ul className="menu-dropdown">
              <li><Link to={`/homeTutor/${id}/tutor/MiPerfil`}>Mi perfil</Link></li>
              <li><Link to={`/homeTutor/${id}/tutor/Configuracion`}>Configuración</Link></li>
              <li><Link to={`/homePrincipal`}>Cerrar Sesion</Link></li>
            </ul>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default TutorTopBar;
