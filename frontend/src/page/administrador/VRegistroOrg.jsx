import "./VRegistroOrg.css";
import React, { useState } from "react";
import buscador from "../../assets/buscador.svg";
import excel from "../../assets/excel.svg";
import addUsuario from "../../assets/perfil_usuario_add.svg";
import { useLocation, useNavigate, Link } from "react-router-dom";
import editarIcon from "../../assets/editar_icono.svg";
import eliminarIcon from "../../assets/eliminar_icono.svg";
import "../../App.css";
import * as XLSX from "xlsx";

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

// Filtrar datos según la búsqueda
const datosFiltrados = datosEjemplo.filter((dato) =>
  dato.nombre.toLowerCase().includes(search.toLowerCase())
);

// Aplicar paginación sobre los datos filtrados
const totalPaginas = Math.ceil(datosFiltrados.length / filasPorPagina);
const indiceInicio = (paginaActual - 1) * filasPorPagina;
const indiceFin = indiceInicio + filasPorPagina;
const datosPagina = datosFiltrados.slice(indiceInicio, indiceFin);

const paginaAnterior = () => {
  if (paginaActual > 1) setPaginaActual(paginaActual - 1);
};

const paginaSiguiente = () => {
  if (paginaActual < totalPaginas) setPaginaActual(paginaActual + 1);
};
const exportarExcel = () => {
  const hojaDatos = datosFiltrados.map(({ id, ...resto }) => resto); // Eliminar ID si no lo quieres en el Excel

  const ws = XLSX.utils.json_to_sheet(hojaDatos);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Registros");

  XLSX.writeFile(wb, "Registros.xlsx");
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
        <button className="boton-excel" onClick={exportarExcel}>
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

      <div className="pagination">
        <button onClick={() => setPaginaActual(paginaActual - 1)} disabled={paginaActual === 1}>{"<"}</button>
         {Array.from({ length: totalPaginas }, (_, i) => (
        <button
             key={i}
             onClick={() => setPaginaActual(i + 1)}
            className={paginaActual === i + 1 ? "active" : ""}
            >
            {i + 1}
        </button>
        ))}
        <button onClick={() => setPaginaActual(paginaActual + 1)} disabled={paginaActual === totalPaginas}>{">"}</button>
    </div>
    </div>
        
    </div>
  );
}
export default RegistrarOrganizador;