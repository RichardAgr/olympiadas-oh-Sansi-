import "./VRegistroOrg.css";
import logo from "../../assets/icono_oh_sansi.svg";
import notificacion from "../../assets/notificacion.svg";
import user from "../../assets/icon_user.svg";
import buscador from "../../assets/buscador.svg";
import excel from "../../assets/excel.svg";
import addUsuario from "../../assets/perfil_usuario_add.svg";
import TablaConPaginacion from "../../hooks/tabla_hook" ;
import { useState } from "react"; // Importar estado
import { useLocation } from "react-router-dom";

function RegistrarOrganizador() {
  const [search, setSearch] = useState(""); // Estado del buscador
  const location = useLocation();
  
  return (
    <main className="contenedor">
      <header className="menu_superior">

       <div className="imagen_titulo">
       <img src= {logo} alt="Logo svg" width="36" height="36" /> 
       <h2  className="titulo">O! SanSi</h2>
      </div> 
      
      <div className="botones_menu">
      <button className="boton_inicio">Inicio</button>
      <button
            className={`boton_roles ${location.pathname === "/VRegistroOrg" ? "activo" : ""}`}
          >
            Roles
          </button>
      <button className="boton_competidores">Competidores</button>
      <button className="boton_evento">Evento</button>
      <img src= {notificacion} alt="Notificacion svg" width="25" height="25"  /> 

      <div className="usuario_boton">
  
        <button className="boton_usuario">
        <img src= {user} alt="User svg" width="25" height="25" /> 
          Usuario
          </button>
    
      </div>

      </div> 
      
    </header>

    <div className="contenido">
        <h1>Registros</h1>
        
        <div className="buscador">
        <button className="boton-buscar">
        <img src={buscador} alt="Buscar" /> </button>
          <input
            type="text"
            placeholder="Buscar por nombre"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="botones_excel_agregar">
          <button className="boton-excel">
            <img src={excel} alt="Excel" className="icono-boton" />
            Descargar Excel
          </button>
          <button className="boton-addUser">
            <img src={addUsuario} alt="addUsuarioo" className="icono-boton2" />
            Agregar
          </button>
        </div>
        <div className="tablita">
        <TablaConPaginacion search={search} />
        </div>
        
    </div>

    </main>
    
  );
}
export default RegistrarOrganizador;