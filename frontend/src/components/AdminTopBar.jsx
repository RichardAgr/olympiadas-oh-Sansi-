import { Link } from "react-router-dom";
import logo from '../assets/logo.png';
import { UserCircle, Bell } from 'lucide-react'; 

const TopBar = () => {
  return (
    <nav className="topbar">
      <div className="topbar-left">
        <img src={logo} alt="Logo" className="logo" />
      </div>
      <ul className="topbar-menu">
        <li><Link to="/admin">Inicio</Link></li>
        <li><Link to="/admin/visualizarRegistro">Ir a Registro</Link>
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


