import { useEffect, useState } from "react";
import axios from "axios";
import "./ListComp.css";
import { useNavigate, useParams } from "react-router-dom";
import IconEditar from "../../../assets/editar_icono.svg";

const ListComp = () => {
  const { id } = useParams();
  const [competidores, setCompetidores] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedArea, setSelectedArea] = useState("Todas las áreas");
  const [selectedStatus, setSelectedStatus] = useState("Todos");
  const [tutorExiste, setTutorExiste] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [areasDisponibles, setAreasDisponibles] = useState(["Todas las áreas"]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompetidores = async () => {
      try {
        setCargando(true);
        const response = await axios.get("/JOSE/lista-inscritos.json");
        
        // Filtrar competidores por tutor_id
        const competidoresDelTutor = response.data.filter(comp => comp.tutor_id.toString() === id);
        
        if (competidoresDelTutor.length > 0) {
          setCompetidores(competidoresDelTutor);
          setTutorExiste(true);
          
          // Obtener áreas únicas de los competidores
          const areasUnicas = [...new Set(competidoresDelTutor.map(comp => comp.area))];
          setAreasDisponibles(["Todas las áreas", ...areasUnicas]);
        } else {
          setTutorExiste(false);
        }
      } catch (error) {
        console.error("Error al cargar competidores:", error);
        setTutorExiste(false);
      } finally {
        setCargando(false);
      }
    };

    fetchCompetidores();
  }, [id]);

  const filteredCompetidores = competidores.filter((comp) => {
    const matchesSearch = comp.nombre_completo
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesArea =
      selectedArea === "Todas las áreas" || comp.area === selectedArea;
    const matchesStatus =
      selectedStatus === "Todos" ||
      (selectedStatus === "Habilitados" && comp.estado === "Habilitado") ||
      (selectedStatus === "Deshabilitados" && comp.estado === "Deshabilitado");
    return matchesSearch && matchesArea && matchesStatus;
  });

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleAreaChange = (e) => {
    setSelectedArea(e.target.value);
  };

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
  };

  const handleEditClick = (idCompetidor) => {
    navigate(
      `/homeTutor/${id}/tutor/ListaCompetidores/editarCompetidores/${idCompetidor}`
    );
  };

  if (cargando) {
    return <div className="loading-message">Cargando...</div>;
  }

  if (!tutorExiste) {
    return (
      <div className="error-message">
        No se encontraron competidores del tutor.
      </div>
    );
  }

  return (
    <div className="list-comp-container">
      <h1>Lista de inscritos</h1>

      <div className="filters">
        <input
          type="text"
          placeholder="Buscar Competidores"
          value={searchTerm}
          onChange={handleSearchChange}
        />

        <select value={selectedArea} onChange={handleAreaChange}>
          {areasDisponibles.map((area, index) => (
            <option key={index} value={area}>
              {area}
            </option>
          ))}
        </select>
      </div>

      <div className="status-filters">
        <h3>Estado:</h3>

        <label>
          <input
            type="radio"
            value="Todos"
            checked={selectedStatus === "Todos"}
            onChange={handleStatusChange}
          />
          Todos
        </label>
        <label>
          <input
            type="radio"
            value="Habilitados"
            checked={selectedStatus === "Habilitados"}
            onChange={handleStatusChange}
          />
          Habilitados
        </label>
        <label>
          <input
            type="radio"
            value="Deshabilitados"
            checked={selectedStatus === "Deshabilitados"}
            onChange={handleStatusChange}
          />
          Deshabilitados
        </label>
      </div>

      {filteredCompetidores.length === 0 ? (
        <div className="no-results-message">
          No se encontraron competidores que coincidan con los criterios de búsqueda.
        </div>
      ) : (
        <table className="competitors-table">
          <thead>
            <tr>
              <th>Nombre Completo</th>
              <th>Área</th>
              <th>Categoría</th>
              <th>Curso</th>
              <th>Estado</th>
              <th>Detalles</th>
            </tr>
          </thead>
          <tbody>
            {filteredCompetidores.map((comp) => (
              <tr key={comp.competidor_id}>
                <td>{comp.nombre_completo}</td>
                <td>{comp.area}</td>
                <td>{comp.categoria}</td>
                <td>{comp.curso}</td>
                <td>{comp.estado}</td>
                <td className="botones-tabla">
                  <button
                    className="edit-button"
                    onClick={() => handleEditClick(comp.competidor_id)}
                  >
                    <img src={IconEditar} alt="Editar" width="26" height="26" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ListComp;