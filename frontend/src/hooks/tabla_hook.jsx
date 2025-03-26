
import React, { useState } from "react";
import "./tabla_hook.css"; // Archivo CSS
import editarIcon from "../assets/editar_icono.svg";
import eliminarIcon from "../assets/eliminar_icono.svg";




// Datos de ejemplo
const datosEjemplo = [
  { id: 1, nombre: "Juan Pérez", ci: "12345678", correo: "juan@example.com", telefono: "76543210", estado: "Activo" },
  { id: 2, nombre: "Ana López", ci: "87654321", correo: "ana@example.com", telefono: "71234567", estado: "Inactivo" },
  { id: 3, nombre: "Luis Gómez", ci: "56781234", correo: "luis@example.com", telefono: "72345678", estado: "Activo" },
  { id: 4, nombre: "Carlos Díaz", ci: "23456789", correo: "carlos@example.com", telefono: "73456789", estado: "Activo" },
  { id: 5, nombre: "Elena Rojas", ci: "34567890", correo: "elena@example.com", telefono: "74567890", estado: "Inactivo" },
  { id: 6, nombre: "Pedro Torres", ci: "45678901", correo: "pedro@example.com", telefono: "75678901", estado: "Activo" },
  { id: 7, nombre: "Marta Sánchez", ci: "56789012", correo: "marta@example.com", telefono: "76789012", estado: "Activo" },
  { id: 8, nombre: "Sofía Ramírez", ci: "67890123", correo: "sofia@example.com", telefono: "77890123", estado: "Inactivo" },
  { id: 9, nombre: "Tomás Ortega", ci: "78901234", correo: "tomas@example.com", telefono: "78901234", estado: "Activo" },
  { id: 10, nombre: "Lucía Fernández", ci: "89012345", correo: "lucia@example.com", telefono: "79012345", estado: "Activo" },
];

const filasPorPagina = 5;

function TablaConPaginacion({ search }) {
  /*ventana emergente de configrmacion para eliminar*/
  const [modalAbierto, setModalAbierto] = useState(1);
  /**/
  const datosFiltrados = datosEjemplo.filter((dato) =>
    dato.nombre.toLowerCase().includes(search.toLowerCase())
  );
  const [paginaActual, setPaginaActual] = useState(1);
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
  React.useEffect(() => {
    setPaginaActual(1);
  }, [search]);

  return (
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
          {datosPagina.map((dato) => (
            <tr key={dato.id}>
              <td className="columna-responsable">{dato.nombre}
              </td>
              <td>{dato.ci}</td>
              <td>{dato.correo}</td>
              <td>{dato.telefono}</td>
              <td>{dato.estado}</td>
              <td className="botones-tabla">
                <button className="boton-editar"><img src={editarIcon} alt="Editar" className="icono_editar" /></button>
                <button className="boton-eliminar"
                  onClick={()=> setModalAbierto(true)}
                ><img src={eliminarIcon} alt="Eliminar" className="icono_eliminar" />
                </button>
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
  );
}

export default TablaConPaginacion;
