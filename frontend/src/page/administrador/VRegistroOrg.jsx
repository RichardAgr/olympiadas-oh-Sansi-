import "./VRegistroOrg.css";
import React, { useState } from "react";
import buscador from "../../assets/buscador.svg";
import excel from "../../assets/excel.svg";
import addUsuario from "../../assets/perfil_usuario_add.svg";
import { useLocation, useNavigate, Link } from "react-router-dom";
import editarIcon from "../../assets/editar_icono.svg";
import eliminarIcon from "../../assets/eliminar_icono.svg";
import "../../App.css";

const datosEjemplo = [
  { id: 1, nombre: "Juan Pérez", ci: "12345678", correo: "juan@example.com", telefono: "76543210", estado: "Activo" },
  { id: 2, nombre: "Ana López", ci: "87654321", correo: "ana@example.com", telefono: "71234567", estado: "Inactivo" }
];

const filasPorPagina = 4;

function RegistrarOrganizador() {
  const navigate = useNavigate(); 
  /*ventana emergente de configrmacion para eliminar*/
    const [modalAbierto, setModalAbierto] = useState(false);
    /**/
  const [search, setSearch] = useState(""); // Estado del buscador
  const location = useLocation();
  /*Para la tabla */
  const [paginaActual, setPaginaActual] = React.useState(1);
    const totalPaginas = Math.ceil(datosEjemplo.length / filasPorPagina);
  
    const indiceInicio = (paginaActual - 1) * filasPorPagina;
    const indiceFin = indiceInicio + filasPorPagina;
    const datosPagina = datosEjemplo.slice(indiceInicio, indiceFin);
  
    const paginaAnterior = () => {
      if (paginaActual > 1) setPaginaActual(paginaActual - 1);
    };
  
    const paginaSiguiente = () => {
      if (paginaActual < totalPaginas) setPaginaActual(paginaActual + 1);
    };
  return (
    
    <div className="home-container">
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
          <Link to="/admin/visualizarRegistro/agregarRegistro">
          <button className="boton-addUser">
          
            <img src={addUsuario} alt="addUsuarioo" className="icono-boton2" />
            Agregar
          </button></Link>
        </div>
        <div className="contenedor-tabla">
      <table className="tabla">
        <thead>
          <tr>
            <th>Nombre Responsable</th>
            <th>CI</th>
            <th>Correo Electrónico</th>
            <th>Teléfono</th>
            <th>Estado</th>
            <th>Seleccionar</th>
          </tr>
        </thead>
        <tbody>
          {[...datosPagina, ...Array(Math.max(0, filasPorPagina - datosPagina.length)).fill({})].map((dato, index) => (
            <tr key={index}>
              <td>{dato.nombre || ""}</td>
              <td>{dato.ci || ""}</td>
              <td>{dato.correo || ""}</td>
              <td>{dato.telefono || ""}</td>
              <td>{dato.estado || ""}</td>
              <td className="botones-tabla">
                {dato.nombre && (
                  <>
                    <button className="boton-editar">
                      <Link to="/admin/visualizarRegistro/editarRegistro">
                       <img src={editarIcon} alt="Editar" className="icono_editar" />
                        </Link>
                        </button>
                    <button className="boton-eliminar"
                                      onClick={()=> setModalAbierto(true)}
                                    ><img src={eliminarIcon} alt="Eliminar" className="icono_eliminar" />
                                    </button>
                  </>
                  
                )}
                {modalAbierto && (
                    <div className="modal-overlay">
                       <div className="modal">
                      <p>¿Estas seguro de eliminar a este usuario?</p>
                      <div className="contenedor_confirmacion">
                        <button className="boton-cerrar" onClick={() => setModalAbierto(false)}>
                          No
                        </button>
                        <button className="boton-si" onClick={() => setModalAbierto(false)}>
                          Si
                        </button>
                      </div>
                  
                    </div>
                    </div>
                   )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="paginacion">
        <button onClick={paginaAnterior} disabled={paginaActual === 1}>
          ←
        </button>
        <span>Página {paginaActual} de {totalPaginas}</span>
        <button onClick={paginaSiguiente} disabled={paginaActual === totalPaginas}>
          →
        </button>
      </div>
    </div>
        
    </div>
  );
}
export default RegistrarOrganizador;