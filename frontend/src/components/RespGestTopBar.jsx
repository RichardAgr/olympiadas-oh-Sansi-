import { useEffect, useRef, useState } from "react";
import { useNavigate,Link, NavLink, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";
import { UserCircle, Bell } from "lucide-react";
import "./estilos/estilosTopBar.css";
import axios from "axios";

const RespGestTopBar = () => {
  const [showRolesMenu, setShowRolesMenu] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); 
  const timeoutRef = useRef(null);
  const location = useLocation();
   const [userMenuOpen, setUserMenuOpen] = useState(false); 

  const navigate = useNavigate();


  const handleMouseEnter = () => {
    clearTimeout(timeoutRef.current);
    setShowRolesMenu(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setShowRolesMenu(false), 150);
  };

  useEffect(() => {
    setShowRolesMenu(false);
    setMenuOpen(false); // Cierra el menú al cambiar de ruta
  }, [location.pathname]);

  const isRolesRoute =
    location.pathname.includes("/respGest/ListIns") ||
    location.pathname.includes("/respGest/ListaTutores")||
    location.pathname.includes("/respGest/ValidarPagos");
  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen)
  }

  const handleLogout = async () => {
    try {
      await axios.post("http://127.0.0.1:8000/api/logout", {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`
        }
      });

      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      localStorage.removeItem("rol");

      navigate("/homePrincipal");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      localStorage.clear();
      navigate("/homePrincipal");
    }
  };

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
            to="/respGest"
            className={location.pathname === "/respGest" ? "active" : ""}
          >
            Inicio
          </Link>
        </li>

        <li className="roles-dropdown">
        <Link to="/respGest/ListIns" className={location.pathname === "/homeRespGestion/ListIns" ? "active" : ""}>
            Inscripción
          </Link>
        </li>



        <li className={location.pathname === "/respGest" ? "active" : ""}>
          <NavLink to="/respGest/ValidarPagos">Validacion de Pagos</NavLink>
        </li>

        <li  className={location.pathname === "/respGest" ? "active" : ""}>
        <NavLink
        to="/respGest/VisualListTutor"
       
            >
            Tutores
          </NavLink>
        </li>

        <li className="user-menu" onClick={toggleUserMenu}>
          <div className="menu-toggle">
            <UserCircle size={22} color="white" />
          </div>
          {userMenuOpen && (
            <ul className="menu-dropdown">
              <li><Link to={`/respGest/MiPerfil/${userId}`}>Mi perfil</Link></li>
              <li><Link to="/respGest/Configuracion">Configuración</Link></li>
              <li>
                <a onClick={handleLogout}>Cerrar Sesión</a>
              </li>
            </ul>
          )}

        </li>
      </ul>
    </nav>
  );
};

export default RespGestTopBar;