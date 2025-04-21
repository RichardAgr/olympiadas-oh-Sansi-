import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Pencil, Trash2 } from "lucide-react";
import ModalConfirmDelete from "../../components/ModalConfirmDelete";
import ModalAreaInfo from "../../components/ModalAreaInfo";
import "../../App.css";

const AreasList = () => {
  const [areas, setAreas] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [areaToDelete, setAreaToDelete] = useState(null);
  const [selectedArea, setSelectedArea] = useState(null); 
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const areasPerPage = 3;

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/areas")
      .then((response) => setAreas(response.data))
      .catch((error) => console.error("Error fetching areas:", error))
      .finally(() => setLoading(false));
  }, []);

  const filteredAreas = areas
    .filter((area) =>
      area.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => a.nombre.localeCompare(b.nombre));

  const indexOfLastArea = currentPage * areasPerPage;
  const indexOfFirstArea = indexOfLastArea - areasPerPage;
  const currentAreas = filteredAreas.slice(indexOfFirstArea, indexOfLastArea);
  const totalPages = Math.ceil(filteredAreas.length / areasPerPage);

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleConfirmDelete = async () => {
    if (!areaToDelete) return;

    try {
      await axios.delete(
        `http://localhost:8000/api/areas/${areaToDelete.area_id}`
      );
      setAreas(areas.filter((area) => area.area_id !== areaToDelete.area_id));
      setAreaToDelete(null);
      alert("Área eliminada correctamente ✅");
    } catch (error) {
      console.error("Error al eliminar el área:", error);
      alert("Hubo un error al eliminar el área ❌");
    }
  };

  return (
    <div className="areas-list-container">
      <h1 className="areas-title">Gestión de Áreas de Competencia</h1>

      <div className="search-add-container">
        <div className="search-wrapper">
          <i className="fa fa-search search-icon" aria-hidden="true"></i>
          <input
            type="text"
            placeholder="Buscar por nombre de Área"
            className="search-input"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            aria-label="Buscar área por nombre"
          />
        </div>

        <Link to="/admin/areas/nueva" className="add-area-button">
          + Agregar Nueva Área
        </Link>
      </div>

      {loading ? (
        <p className="loading">Cargando áreas... ⏳</p>
      ) : (
        <>
          <p className="areas-count">
            Mostrando {currentAreas.length} de {filteredAreas.length} áreas
          </p>

          {currentAreas.length === 0 ? (
            <p className="no-results">
              No se encontraron áreas con ese nombre
            </p>
          ) : (
            <div className="area-cards-container">
              {currentAreas.map((area) => (
                <div
                  key={area.area_id}
                  className="area-card"
                  onClick={() => setSelectedArea(area)} // 👈 click para abrir info
                  style={{ cursor: "pointer" }}
                >
                  <div className="area-info">
                    <h3>{area.nombre}</h3>
                    <p>{area.descripcion}</p>
                  </div>
                  <div className="area-buttons">
                    <Link
                      to={`/admin/areas/editar/${area.area_id}`}
                      className="edit-btn"
                      aria-label={`Editar área ${area.nombre}`}
                      onClick={(e) => e.stopPropagation()} // 👈 evita que abra modal
                    >
                      <Pencil size={18} /> Editar
                    </Link>
                    <button
                      className="delete-btn"
                      onClick={(e) => {
                        e.stopPropagation(); // 👈 evita que abra modal
                        setAreaToDelete(area);
                      }}
                      aria-label={`Eliminar área ${area.nombre}`}
                    >
                      <Trash2 size={18} /> Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="pagination">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              aria-label="Página anterior"
            >
              {"<"}
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => goToPage(i + 1)}
                className={currentPage === i + 1 ? "active" : ""}
                aria-label={`Página ${i + 1}`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              aria-label="Página siguiente"
            >
              {">"}
            </button>
          </div>
        </>
      )}

      {areaToDelete && (
        <ModalConfirmDelete
          areaName={areaToDelete.nombre}
          onConfirm={handleConfirmDelete}
          onCancel={() => setAreaToDelete(null)}
        />
      )}

      {selectedArea && (
        <ModalAreaInfo
          area={selectedArea}
          onClose={() => setSelectedArea(null)}
        />
      )}
    </div>
  );
};

export default AreasList;

