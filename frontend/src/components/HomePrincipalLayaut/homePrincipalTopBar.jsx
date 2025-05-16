import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useParams, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import { UserCircle, Bell } from "lucide-react";
import "./estilosTopBar.css";

const homePrincipalTopBar = () => {
  const [showRolesMenu, setShowRolesMenu] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // 👉 responsive menu
  const timeoutRef = useRef(null);
  const location = useLocation();
 

  // 👉 ID temporal estático desde el backend
  const {id}= useParams();
  const navigate = useNavigate(); // Para manejar la navegación programáticamente
  const [userMenuOpen, setUserMenuOpen] = useState(false); 

  

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
            to={`/homePrincipal`}
            className={location.pathname == (`/homePrincipal`) ? "active" : ""}
          >
            Inicio
          </Link>
        </li>

        <li className="roles-dropdown">
            Competidores
        </li>
        
        <li className="roles-dropdown">
          <Link to={`/homePrincipal/login`}
            className={location.pathname === `/homePrincipal/login`  ? "active" : ""}>
          Login
          </Link>
        </li>


       
      </ul>
    </nav>
  );
};

export default homePrincipalTopBar;
