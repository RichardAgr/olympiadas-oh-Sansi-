import React, { useState } from "react";
import * as XLSX from "xlsx";
import excelIcon from "../../assets/excel.svg";
import "./VisualListTutor.css";

function VisualListTutor() {
  const [search, setSearch] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const [itemsPorPagina] = useState(12);

  const tableData = [
    {
      nombre: "Mariana Gonzales Aguirre",
      colegio: "La Salle",
      ci: "9636557",
      curso: "Sto primaria",
      competidores: 2,
      telefono: "73566784",
    },
    {
      nombre: "Carlos Andres Cespedes Duran",
      colegio: "La Salle",
      ci: "36565459",
      curso: "Sto primaria",
      competidores: 4,
      telefono: "73566784",
    },
    {
      nombre: "Pablo Andres Orihuela Duran",
      colegio: "Santa Ana",
      ci: "89774541",
      curso: "Sto secundaria",
      competidores: 2,
      telefono: "63576953",
    },
    {
      nombre: "Emiliano Saavedra Gutierrez",
      colegio: "Santa Ana",
      ci: "63332255",
      curso: "Sto secundaria",
      competidores: 3,
      telefono: "95744788",
    },
    {
      nombre: "Valentina Caero Villarroel",
      colegio: "Don Bosco",
      ci: "99699565",
      curso: "Sto primaria",
      competidores: 4,
      telefono: "63596949",
    },
    {
      nombre: "Adriana Peredo Suarez",
      colegio: "Don Bosco",
      ci: "132214455",
      curso: "Sto primaria",
      competidores: 3,
      telefono: "63596949",
    },
    {
      nombre: "Daniela Andrea Guizada Duran",
      colegio: "Don Bosco",
      ci: "112542242",
      curso: "Sto secundaria",
      competidores: 4,
      telefono: "63596949",
    },
    {
        nombre: "Mariana Gonzales Aguirre",
        colegio: "La Salle",
        ci: "9636557",
        curso: "Sto primaria",
        competidores: 2,
        telefono: "73566784",
      },
      {
        nombre: "Carlos Andres Cespedes Duran",
        colegio: "La Salle",
        ci: "36565459",
        curso: "Sto primaria",
        competidores: 4,
        telefono: "73566784",
      },
      {
        nombre: "Pablo Andres Orihuela Duran",
        colegio: "Santa Ana",
        ci: "89774541",
        curso: "Sto secundaria",
        competidores: 2,
        telefono: "63576953",
      },
      {
        nombre: "Emiliano Saavedra Gutierrez",
        colegio: "Santa Ana",
        ci: "63332255",
        curso: "Sto secundaria",
        competidores: 3,
        telefono: "95744788",
      },
      {
        nombre: "Valentina Caero Villarroel",
        colegio: "Don Bosco",
        ci: "99699565",
        curso: "Sto primaria",
        competidores: 4,
        telefono: "63596949",
      },
      {
        nombre: "Adriana Peredo Suarez",
        colegio: "Don Bosco",
        ci: "132214455",
        curso: "Sto primaria",
        competidores: 3,
        telefono: "63596949",
      },
      {
        nombre: "Daniela Andrea Guizada Duran",
        colegio: "Don Bosco",
        ci: "112542242",
        curso: "Sto secundaria",
        competidores: 4,
        telefono: "63596949",
      },
  ];

  const filteredData = tableData.filter(
    (item) =>
      item.nombre.toLowerCase().includes(search.toLowerCase()) ||
      item.ci.includes(search)
  );

  const totalPaginas = Math.ceil(filteredData.length / itemsPorPagina);
  const indiceUltimoItem = paginaActual * itemsPorPagina;
  const indicePrimerItem = indiceUltimoItem - itemsPorPagina;
  const datosPagina = filteredData.slice(indicePrimerItem, indiceUltimoItem);

  const exportarExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
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
            onChange={(e) => {
              setSearch(e.target.value);
              setPaginaActual(1);
            }}
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
              <th>Nombre del tutor</th>
              <th>Colegio</th>
              <th>CI</th>
              <th>Curso</th>
              <th>Nro. de Competidores</th>
              <th>Telefono</th>
            </tr>
          </thead>
          <tbody>
            {datosPagina.length === 0 ? (
              <tr>
                <td colSpan="6" className="no-datos">
                  <p>No se encontraron registros</p>
                </td>
              </tr>
            ) : (
              datosPagina.map((item, index) => (
                <tr key={index}>
                  <td>{item.nombre}</td>
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
