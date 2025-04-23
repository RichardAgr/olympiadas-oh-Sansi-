import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import logo from "../../assets/logo.png";
import { UserCircle, Bell } from "lucide-react";

const TutorTopBar = () => {
  const [showRolesMenu, setShowRolesMenu] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // 👉 responsive menu
  const timeoutRef = useRef(null);
  const location = useLocation();

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
            to="/tutor/${id}"
            className={location.pathname === "/tutor" ? "active" : ""}
          >
            Inicio
          </Link>
        </li>

        <li className="roles-dropdown">
        {/*<Link to="/respGest/ListIns" className={location.pathname === "/homeRespGestion/ListIns" ? "active" : ""}>
            Competidores
          </Link>*/}
          Competidores
        </li>



        <li className={location.pathname === "/respGest" ? "active" : ""}>
          {/*<NavLink to="/respGest/ValidarPagos">Boletas de Pagos</NavLink>*/}
            Boletas de Pagos
        </li>


        <li>
          <button
            className="notification-button"
            aria-label="Notificaciones"
          >
            <Bell size={22} color="#0A2E8C" />
          </button>
        </li>

        <li>
          <div className="admin-badge">
            <UserCircle size={22} color="white" />
            <span>Tu</span>
          </div>
        </li>
      </ul>
    </nav>
  );
};

export default TutorTopBar;
