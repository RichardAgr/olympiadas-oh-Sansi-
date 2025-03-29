import { Link, useLocation } from "react-router-dom";
import logo from '../assets/logo.png';
import { UserCircle, Bell } from 'lucide-react';
import { useEffect, useRef, useState } from "react";

const TopBar = () => {
  const [showRolesMenu, setShowRolesMenu] = useState(false);
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
  }, [location.pathname]);

  const isRolesRoute = location.pathname.includes('/admin/visualizarRegistro') || location.pathname.includes('/admin/tutores');

  return (
    <nav className="topbar">
      <div className="topbar-left">
        <img src={logo} alt="Logo" className="logo" />
      </div>

      <ul className="topbar-menu">
        <li>
          <Link 
            to="/admin" 
            className={location.pathname === '/admin' ? 'active' : ''}
          >
            Inicio
          </Link>
        </li>

        <li
          className="roles-dropdown"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <span
            className="dropdown-label"
            style={{
              borderBottom: (showRolesMenu || isRolesRoute) ? '3px solid #061A8B' : '3px solid transparent',
              color: (showRolesMenu || isRolesRoute) ? '#061A8B' : undefined
            }}
          >
            Roles
          </span>
          {showRolesMenu && (
            <ul className="dropdown-menu">
              <li className={location.pathname === '/admin/visualizarRegistro' ? 'active-option' : ''}>
                <Link to="/admin/visualizarRegistro">Resp. de Gestión</Link>
              </li>
              <li className={location.pathname === '/admin/tutores' ? 'active-option' : ''}>
                <Link to="/admin/tutores">Tutores</Link>
              </li>
            </ul>
          )}
        </li>

        <li><a href="#">Competidores</a></li>
        <li><a href="#">Evento</a></li>

        <li>
          <button className="notification-button">
            <Bell size={22} color="#0A2E8C" />
          </button>
        </li>
        <li>
          <div className="admin-badge">
            <UserCircle size={22} color="white" />
            <span>Admin</span>
          </div>
        </li>
      </ul>
    </nav>
  );
};

export default TopBar;
