import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useParams, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { UserCircle } from "lucide-react";
import axios from "axios";
import "./estilos/estilosTopBar.css";

const RespGestTopBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const timeoutRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const { id } = useParams();
  const userId = JSON.parse(localStorage.getItem("user"))?.responsable_id;

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };

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
          <Link
            to="/respGest/ListIns"
            className={location.pathname === "/respGest/ListIns" ? "active" : ""}
          >
            Inscripción
          </Link>
        </li>

        <li className={location.pathname === "/respGest/ValidarPagos" ? "active" : ""}>
          <Link to="/respGest/ValidarPagos">Validación de Pagos</Link>
        </li>

        <li className={location.pathname === "/respGest/VisualListTutor" ? "active" : ""}>
          <Link to="/respGest/VisualListTutor">Tutores</Link>
        </li>

        <li className="user-menu" onClick={toggleUserMenu}>
          <div className="menu-toggle">
            <UserCircle size={22} color="white" />
            <span>Tu</span>
          </div>
          {userMenuOpen && (
            <ul className="menu-dropdown">
              <li>
                <Link to={`/respGest/MiPerfil/${userId}`}>Mi perfil</Link>
              </li>

              
              <li><Link to="/respGest/Configuracion">Configuración</Link></li>
              <li><a onClick={handleLogout}>Cerrar Sesión</a></li>
            </ul>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default RespGestTopBar;