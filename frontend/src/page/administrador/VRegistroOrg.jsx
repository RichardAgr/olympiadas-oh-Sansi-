import "./VRegistroOrg.css";
import React, { useState, useEffect } from "react";
import buscador from "../../assets/buscador.svg";
import excel from "../../assets/excel.svg";
import addUsuario from "../../assets/perfil_usuario_add.svg";
import { Edit, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";
import ModalConfirmDelete from "../../components/ModalConfirmDelete";
import axios from "axios"; 


const filasPorPagina = 6;  

function RegistrarOrganizador() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [itemSeleccionado, setItemSeleccionado] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8000/api/responsables")
      .then((res) => {
        if (!res.ok) throw new Error("Error en la API");
        return res.json();
      })
      .then((data) => {
        setData(data);
        console.log("Datos cargados:", data);
      })
      .catch((err) => {
        console.error("Error al traer responsables:", err);
      });
  }, []);

  const datosFiltrados = data.filter((dato) =>
    `${dato.nombres} ${dato.apellidos}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const totalPaginas = Math.ceil(datosFiltrados.length / filasPorPagina);
  const indiceInicio = (paginaActual - 1) * filasPorPagina;
  const datosPagina = datosFiltrados.slice(
    indiceInicio,
    indiceInicio + filasPorPagina
  );

  const exportarExcel = () => {
    const hojaDatos = datosFiltrados.map(({ responsable_id, ...rest }) => rest);
    const ws = XLSX.utils.json_to_sheet(hojaDatos);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Registros");
    XLSX.writeFile(wb, "Registros.xlsx");
  };

  const abrirModal = (responsable) => {
    setItemSeleccionado(responsable);
    setModalAbierto(true);
  };

  //  Función para eliminar responsable con confirmación
  const handleEliminarResponsable = async (responsable) => {
    if (!responsable || !responsable.responsable_id) return;

    try {
      // Eliminamos al responsable desde la API
      await axios.delete(
        `http://localhost:8000/api/responsables/${responsable.responsable_id}`
      );
      // Actualizamos el estado eliminando al responsable
      setData((prevData) =>
        prevData.filter((item) => item.responsable_id !== responsable.responsable_id)
      );
      setModalAbierto(false);
      setItemSeleccionado(null);
      alert("Responsable eliminado correctamente ✅");
    } catch (error) {
      console.error("Error al eliminar el responsable:", error);
      alert("Hubo un error al eliminar el responsable ❌");
    }
  };

  return (
    <div className="home-container">
      <h1>Registros</h1>

      {/*  Buscador */}
      <div className="buscador">
        <button className="boton-buscar">
          <img src={buscador} alt="Buscar" />
        </button>
        <input
          type="text"
          placeholder="Buscar por nombre"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/*  Botones de acción */}
      <div className="botones_excel_agregar">
        <button className="boton-excel" onClick={exportarExcel}>
          <img src={excel} alt="Excel" className="icono-boton" />
          Descargar Excel
        </button>

        <button 
          className="boton-addUser" 
            onClick={() => window.location.href = "/admin/visualizarRegistro/agregarRegistro"}
          >
          <img src={addUsuario} alt="Agregar Usuario" className="icono-boton2" />
          Agregar
        </button>

      </div>

      {/* Tabla */}
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
            {datosPagina.length === 0 ? (
              <tr>
                <td colSpan="6">No hay datos disponibles</td>
              </tr>
            ) : (
              datosPagina.map((dato) => (
                <tr key={dato.responsable_id}>
                  <td>{dato.nombres} {dato.apellidos}</td>
                  <td>{dato.ci}</td>
                  <td>{dato.correo_electronico}</td>
                  <td>{dato.telefono}</td>
                  <td className={dato.estado ? "estado-activo" : "estado-inactivo"}>
                    {dato.estado ? "Activo" : "Inactivo"}
                  </td>
                  <td className="botones-tabla">
                    <Link
                      to={`/admin/visualizarRegistro/editarRegistro/${dato.responsable_id}`}
                      className="boton-icono"
                    >
                      <Edit size={20} color="white" />
                    </Link>
                    <button
                      className="boton-icono"
                      onClick={() => abrirModal(dato)}
                    >
                      <Trash2 size={20} color="white" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Paginación */}
        <div className="pagination">
          <button onClick={() => setPaginaActual(paginaActual - 1)} disabled={paginaActual === 1}>
            {"<"}
          </button>
          {Array.from({ length: totalPaginas }, (_, i) => (
            <button
              key={i}
              onClick={() => setPaginaActual(i + 1)}
              className={paginaActual === i + 1 ? "active" : ""}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setPaginaActual(paginaActual + 1)}
            disabled={paginaActual === totalPaginas}
          >
            {">"}
          </button>
        </div>
      </div>

      {/* Modal de confirmación */}
      {modalAbierto && (
        <ModalConfirmDelete
          responsable={itemSeleccionado}
          onCancel={() => setModalAbierto(false)}
          onConfirm={handleEliminarResponsable}
        />
      )}
    </div>
  );
}

export default RegistrarOrganizador;
