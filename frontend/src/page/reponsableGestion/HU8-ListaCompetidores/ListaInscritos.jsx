import { useEffect, useState } from "react";
import axios from "axios";
import "./ListaInscritos.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function ListaInscritos() {
  const user = JSON.parse(localStorage.getItem('user'));
  const competenciaId = user?.competencia_id;
  const [inscritos, setInscritos] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("Todos los cursos");
  
  useEffect(() => {
    axios.get(`http://localhost:8000/api/detallesCompetidor/${competenciaId}`)
      .then(response => {
        setInscritos(response.data);
      })
      .catch(error => {
        console.error("Error al cargar los inscritos:", error);
      });
  }, []);

  const inscritosFiltrados = inscritos.filter((inscrito) => {
    const search = searchQuery.toLowerCase();
    const coincideBusqueda =
      inscrito.nombre.toLowerCase().includes(search) ||
      inscrito.apellido.toLowerCase().includes(search) ||
      inscrito.colegio.toLowerCase().includes(search) ||
      inscrito.departamento.toLowerCase().includes(search);

    const coincideCurso =
      selectedCourse === "Todos los cursos" ||
      inscrito.curso === selectedCourse;

    // Filtra solo los inscritos habilitados
    const estaHabilitado = inscrito.estado === "Habilitado";

    return coincideBusqueda && coincideCurso && estaHabilitado;
  });

const exportToPDF = () => {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  doc.setFontSize(16);
  const pageWidth = doc.internal.pageSize.getWidth();
  const textWidth = doc.getStringUnitWidth("Lista de Inscritos Habilitados") * doc.internal.getFontSize() / doc.internal.scaleFactor;
  const textX = (pageWidth - textWidth) / 2;
  
  doc.text("Lista de Inscritos Habilitados", textX, 20);

  autoTable(doc, {
    startY: 30,
    head: [["Apellidos", "Nombres", "Colegio", "Departamento", "Provincia", "Tutor"]],
    body: inscritosFiltrados.map((inscrito) => [
      inscrito.apellido,
      inscrito.nombre,
      inscrito.colegio,
      inscrito.departamento,
      inscrito.provincia,
      inscrito.tutor_principal || 'N/A'
    ]),
    styles: { 
      fontSize: 10, 
      cellPadding: 3,
      overflow: 'linebreak'
    },
    headStyles: { 
      fillColor: [255, 255, 255], 
      textColor: 0,
      fontStyle: 'bold'
    },
    margin: { top: 20 },
    tableWidth: 'auto'
  });

  doc.save("lista_inscritos_habilitados.pdf");
};

  return (
    <div className="lista-container">
      <h1 className="liesta-Incritos-tituloX">Lista de inscritos habilitados</h1>

      <div className="search-bar">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar por nombre o apellido"
        />
      </div>

      <div className="filters">
        <select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          className="course-dropdown"
        >
          <option value="Todos los cursos">Todos los cursos</option>
          <option value="1ro Primaria">1ro Primaria</option>
          <option value="2do Primaria">2do Primaria</option>
          <option value="3ro Primaria">3ro Primaria</option>
          <option value="4to Primaria">4to Primaria</option>
          <option value="5to Primaria">5to Primaria</option>
          <option value="6to Primaria">6to Primaria</option>
          <option value="1ro Secundaria">1ro Secundaria</option>
          <option value="2do Secundaria">2do Secundaria</option>
          <option value="3ro Secundaria">3ro Secundaria</option>
          <option value="4to Secundaria">4to Secundaria</option>
          <option value="5to Secundaria">5to Secundaria</option>
          <option value="6to Secundaria">6to Secundaria</option>
        </select>

        <button className="export-button" onClick={exportToPDF}>
          Exportar Lista
        </button>
      </div>

      <table className="inscritos-table">
        <thead>
          <tr>
            <th>Apellidos</th>
            <th>Nombres</th>
            <th>Colegio</th>
            <th>Curso</th>
            <th>Departamento</th>
            <th>Provincia</th>
            <th>Competencia</th>
            <th>Tutor Principal</th>
          </tr>
        </thead>
        <tbody>
          {inscritosFiltrados.length > 0 ? (
            inscritosFiltrados.map((inscrito, index) => (
              <tr key={index}>
                <td>{inscrito.apellido}</td>
                <td>{inscrito.nombre}</td>
                <td>{inscrito.colegio}</td>
                <td>{inscrito.curso}</td>
                <td>{inscrito.departamento}</td>
                <td>{inscrito.provincia}</td>
                <td>{inscrito.area}</td>
                <td>{inscrito.tutor_principal}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: "center" }}>
                No se encontraron inscritos habilitados.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ListaInscritos;