import "./VRegistroOrg.css";
import { useState, useEffect } from "react";
import buscador from "../../../assets/buscador.svg";
import excel from "../../../assets/excel.svg";
import addUsuario from "../../../assets/perfil_usuario_add.svg";
import { Link, useParams } from "react-router-dom";
import { Edit, Trash2, Mail } from "lucide-react";
import * as XLSX from "xlsx";
import ModalConfirmDelete from "../../../components/ModalesAdmin/ModalConfirmDelete";
import ModalConfirmEstado from "../../../components/ModalesAdmin/ModalConfirmEstado";
import api from '../../../components/Tokens/api';

const filasPorPagina = 15;

function RegistrarOrganizador() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todos"); 
  const [paginaActual, setPaginaActual] = useState(1);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modalEstadoAbierto, setModalEstadoAbierto] = useState(false);
  const [itemSeleccionado, setItemSeleccionado] = useState(null);
    const { id_competencia } = useParams();
  const routeTo=(subruta)=>`/admin/HomeAdmin/${id_competencia}/${subruta}`;

  useEffect(() => {
    api.get("http://localhost:8000/api/datosResponsableGestion")
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error al traer responsables:", error);
      });
  }, []);

  const datosFiltrados = data.filter((dato) => {
    const nombreCompleto = `${dato.nombres} ${dato.apellidos}`.toLowerCase();
    const coincideNombre = nombreCompleto.includes(search.toLowerCase());
    const coincideEstado =
      filtroEstado === "todos" ||
      (filtroEstado === "activos" && dato.estado === 1) ||
      (filtroEstado === "inactivos" && dato.estado === 0);
    return coincideNombre && coincideEstado;
  });

  const totalPaginas = Math.ceil(datosFiltrados.length / filasPorPagina);
  const indiceInicio = (paginaActual - 1) * filasPorPagina;
  const datosPagina = datosFiltrados.slice(indiceInicio, indiceInicio + filasPorPagina);

  const exportarExcel = () => {
    if (datosFiltrados.length === 0) {
      alert("No hay datos para exportar.");
      return;
    }

    const hojaDatos = datosFiltrados.map((dato) => ({
      "ID": dato.responsable_id,
      "Nombre Completo": `${dato.nombres} ${dato.apellidos}`,
      "CI": dato.ci,
      "Correo Electrónico": dato.correo_electronico,
      "Teléfono": dato.telefono,
      "Estado": dato.estado === 1 ? "Activo" : "Inactivo",
      "Fecha de Registro": dato.created_at ? new Date(dato.created_at).toLocaleDateString() : '',
    }));

    const ws = XLSX.utils.json_to_sheet(hojaDatos);

    const rango = XLSX.utils.decode_range(ws['!ref']);
    for (let R = rango.s.r; R <= rango.e.r; ++R) {
      for (let C = rango.s.c; C <= rango.e.c; ++C) {
        const celda = ws[XLSX.utils.encode_cell({ r: R, c: C })];
        if (!celda) continue;
        if (!celda.s) celda.s = {};
        celda.s.border = {
          top: { style: "thin", color: { auto: 1 } },
          right: { style: "thin", color: { auto: 1 } },
          bottom: { style: "thin", color: { auto: 1 } },
          left: { style: "thin", color: { auto: 1 } },
        };
      }
    }

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Responsables de Gestión");
    XLSX.writeFile(wb, "Registros.xlsx");
  };

  const abrirModal = (responsable) => {
    setItemSeleccionado(responsable);
    setModalAbierto(true);
  };

  const abrirModalEstado = (responsable) => {
    setItemSeleccionado(responsable);
    setModalEstadoAbierto(true);
  };

  const handleEliminarResponsable = async (responsable) => {
    if (!responsable?.responsable_id) return;
    try {
      await api.delete(`http://localhost:8000/api/eliminarResponsableGestion/${responsable.responsable_id}`);
      setData((prev) => prev.filter((item) => item.responsable_id !== responsable.responsable_id));
      setModalAbierto(false);
      setItemSeleccionado(null);
    } catch (error) {
      console.error("Error al eliminar el responsable:", error);
    }
  };

  const toggleEstado = async () => {
  if (!itemSeleccionado?.responsable_id) return;

  try {
    await api.post(`http://localhost:8000/api/responsables/${itemSeleccionado.responsable_id}/cambiar-estado`);
    setData((prev) =>
      prev.map((item) =>
        item.responsable_id === itemSeleccionado.responsable_id
          ? { ...item, estado: item.estado ? 0 : 1 }
          : item
      )
    );
    setModalEstadoAbierto(false);
    setItemSeleccionado(null);
  } catch (error) {
    console.error("Error al cambiar estado:", error);
  }
};


  const enviarCredenciales = async (responsable) => {
    if (!responsable?.responsable_id) return;
    try {
      await api.post(`http://localhost:8000/api/enviarCredencialesResponsable/${responsable.responsable_id}`);
      alert(`Credenciales enviadas a ${responsable.correo_electronico}`);
    } catch (error) {
      console.error("Error al enviar credenciales:", error);
      alert("Error al enviar credenciales. Revisa consola.");
    }
  };

  return (
    <div className="home-container3Hu43">
      <h1>Registros de Responsables de Gestión</h1>
      <div className="buscadorHu43">
        <input type="text" placeholder="Buscar por nombre" value={search} onChange={(e) => setSearch(e.target.value)} className="input-busquedaHu43 search-inputHu43" />
        <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)} className="filtro-selectHu43">
          <option value="todos">Todos</option>
          <option value="activos">Activos</option>
          <option value="inactivos">Inactivos</option>
        </select>
      </div>

      <div className="botones_excel_agregarHu43">
        <button className="boton-excelHu43" onClick={exportarExcel}>
          <img src={excel} alt="Excel" className="icono-botonHu43" /> Descargar Excel
        </button>
        <button
          className="boton-addUserHu43"
          onClick={() =>
            (window.location.href = routeTo("visualizarRegistro/agregarRegistro"))
          }
        >
          <img src={addUsuario} alt="Agregar Usuario" className="icono-boton2Hu43" />
          Agregar
        </button>
      </div>

      <div className="contenedor-tablaHu43">
        <table className="tablaHu43">
          <thead>
            <tr>
              <th>Nombre Responsable</th>
              <th>CI</th>
              <th>Correo Electrónico</th>
              <th>Teléfono</th>
              <th>Estado</th>
              <th>Seleccionar</th>
              <th>Enviar Credenciales</th>
              <th>Reenviar Credenciales</th> 
            </tr>
          </thead>
          <tbody>
            {datosPagina.length === 0 ? (
              <tr>
                <td colSpan="8" className="no-datos">
                  <p>No se encontraron registros</p>
                </td>
              </tr>
            ) : (
              datosPagina.map((dato) => (
                <tr key={dato.responsable_id}>
                  <td>{dato.nombres} {dato.apellidos}</td>
                  <td>{dato.ci}</td>
                  <td>{dato.correo_electronico}</td>
                  <td>{dato.telefono}</td>
                  <td>
                    <span
                      className={dato.estado ? "estado-activoHu43" : "estado-inactivoHu43"}
                      style={{ cursor: "pointer", textDecoration: "underline" }}
                      onClick={() => abrirModalEstado(dato)}
                    >
                      {dato.estado ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="botones-tablaHu43">
                    <Link
                      to={routeTo(`visualizarRegistro/editarRegistro/${dato.responsable_id}`)}
                      className="boton-iconoHu43"
                      title="Editar"
                    >
                      <Edit size={20} color="white" />
                    </Link>
                    <button className="boton-iconoHu43" onClick={() => abrirModal(dato)} title="Eliminar">
                      <Trash2 size={20} color="white" />
                    </button>
                  </td>
                  <td>
                    <div className="botones2-tablaHu43">
                      {dato.ya_enviado ? (
                        <span style={{ color: "gray", fontWeight: "bold" }}>Enviado</span>
                      ) : (
                        <button className="boton-iconoHu43 enviar" onClick={() => enviarCredenciales(dato)} title="Enviar credenciales">
                          <Mail size={20} color="white" />
                        </button>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="botones2-tablaHu43">
                      <button className="boton-iconoHu43 reenviar" onClick={() => enviarCredenciales(dato)} title="Reenviar credenciales">
                        <Mail size={20} color="white" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="paginationHu43">
          <button onClick={() => setPaginaActual(paginaActual - 1)} disabled={paginaActual === 1}>{"<"}</button>
          {Array.from({ length: totalPaginas }, (_, i) => (
            <button key={i} onClick={() => setPaginaActual(i + 1)} className={paginaActual === i + 1 ? "active" : ""}>{i + 1}</button>
          ))}
          <button onClick={() => setPaginaActual(paginaActual + 1)} disabled={paginaActual === totalPaginas}>{">"}</button>
        </div>
      </div>

      {modalAbierto && (
        <ModalConfirmDelete responsable={itemSeleccionado} onCancel={() => setModalAbierto(false)} onConfirm={handleEliminarResponsable} />
      )}

      {modalEstadoAbierto && (
        <ModalConfirmEstado responsable={itemSeleccionado} onCancel={() => setModalEstadoAbierto(false)} onConfirm={toggleEstado} />
      )}
    </div>
  );
}

export default RegistrarOrganizador;



