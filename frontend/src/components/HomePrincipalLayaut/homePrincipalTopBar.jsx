import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import logo from "../../assets/logo.png";
import { UserCircle } from "lucide-react";
import "./estilosTopBar.css";

const HomePrincipalTopBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  const toggleUserMenu = () => {
    setUserMenuOpen((prev) => !prev);
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
          <NavLink
            to="/homePrincipal"
            end
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Inicio
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/homePrincipal/areasCompetencia"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Áreas en Competencia
          </NavLink>
        </li>

        {/* Quitamos Login de aquí para meterlo en el menú desplegable */}
        
        <li className="user-menu" onClick={toggleUserMenu}>
          <div className="menu-toggle">
            <UserCircle size={22} color="white" />
          </div>
          {userMenuOpen && (
            <ul className="menu-dropdown">
              <li>
                <NavLink to="/homePrincipal/login">Login</NavLink>
              </li>
              <li>
                <NavLink to="/homePrincipal">Cerrar Sesión</NavLink>
              </li>
            </ul>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default HomePrincipalTopBar;
