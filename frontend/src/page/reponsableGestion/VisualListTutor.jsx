import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import axios from "axios";
import excelIcon from "../../assets/excel.svg";
import "./VisualListTutor.css";

function VisualListTutor() {
  const [search, setSearch] = useState("");
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    const fetchTutores = async () => {
      try {
        const response = await axios.get("/tutores.json"); // Carga desde public/
        setTableData(response.data);
      } catch (error) {
        console.error("Error al cargar tutores:", error);
      }
    };

    fetchTutores();
  }, []);

  const filteredData = tableData.filter(
    (item) =>
      `${item.nombres} ${item.apellidos}`.toLowerCase().includes(search.toLowerCase()) ||
      item.ci.includes(search)
  );

  const exportarExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredData.map((item) => ({
        ID: item.tutor_id,
        "Nombre Completo": `${item.nombres} ${item.apellidos}`,
        Colegio: item.colegio,
        CI: item.ci,
        Curso: item.curso,
        Competidores: item.competidores,
        Teléfono: item.telefono,
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "ListaTutores");
    XLSX.writeFile(workbook, "ListaTutores.xlsx");
  };

  return (
    <div className="prueba-container">
      <div className="header-actions">
        <div className="buscador2">
          <input
            className="input-buscador2"
            type="text"
            placeholder="Buscar por nombre o CI"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <button className="boton-excel" onClick={exportarExcel}>
          <img src={excelIcon} alt="Excel" className="icono-boton" />
          Exportar Lista
        </button>
      </div>

      <div className="contenedor-tabla2">
        <table className="tabla2">
          <thead>
            <tr>
              <th>Nombre Completo</th>
              <th>Colegio</th>
              <th>CI</th>
              <th>Curso</th>
              <th>Nro. Competidores</th>
              <th>Teléfono</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan="6" className="no-datos">
                  <p>No se encontraron registros</p>
                </td>
              </tr>
            ) : (
              filteredData.map((item) => (
                <tr key={item.tutor_id}>
                  <td>{`${item.nombres} ${item.apellidos}`}</td>
                  <td>{item.colegio}</td>
                  <td>{item.ci}</td>
                  <td>{item.curso}</td>
                  <td>{item.competidores}</td>
                  <td>{item.telefono}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default VisualListTutor;
