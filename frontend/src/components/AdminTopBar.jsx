import { useEffect, useRef, useState  } from "react";
import { useNavigate,Link, NavLink, useLocation, useParams } from "react-router-dom";
import logo from "../assets/logo.png";
import { UserCircle, Bell } from "lucide-react";
import "./estilos/estilosTopBar.css";
import axios from "axios";

const AdminTopBar = () => {
  const [showRolesMenu, setShowRolesMenu] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // 👉 responsive menu
  const timeoutRef = useRef(null);
  const location = useLocation();
  const [userMenuOpen, setUserMenuOpen] = useState(false); 
  const { id_competencia } = useParams();

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
    location.pathname.includes("/admin/visualizarRegistro")
/*     location.pathname.includes("/admin/tutores"); */
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
            to={`/admin/HomeAdmin/${id_competencia}`}
            className={location.pathname === `/admin/HomeAdmin/${id_competencia}` ? "active" : ""}
          >
            Inicio
          </Link>
        </li>

        

        <li>
          <NavLink
            to={`/admin/HomeAdmin/${id_competencia}/Evento`} 
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Evento
          </NavLink>
        </li>
        <li>
          <Link
            to={`/admin/HomeAdmin/${id_competencia}/visualizarRegistro`} 
            className={location.pathname === "/admin/visualizarRegistro" ? "active-option": ""}
          >
            Responsable de Gestion
          </Link>
        </li>

        <li className="user-menu"  onClick={toggleUserMenu}>
          <div className="menu-toggle">
            <UserCircle size={22} color="white" />
            <span>Admin</span>
          </div>
          {userMenuOpen && (
            <ul className="menu-dropdown">
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

export default AdminTopBar;
