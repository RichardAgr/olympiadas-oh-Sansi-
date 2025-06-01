import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Pencil, Trash2 } from "lucide-react";
import ModalConfirmDelete from "../../../components/ModalesAdmin/ModalConfirmDelete";
import ModalAreaInfo from "../../../components/ModalAreaInfo";
import "./hu1.css"; 

const AreasList = () => {
  const [areas, setAreas] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [areaToDelete, setAreaToDelete] = useState(null);
  const [selectedArea, setSelectedArea] = useState(null); 
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState("");
const [tipoMensaje, setTipoMensaje] = useState(""); // "exito" o "error"


  const areasPerPage = 15;

  useEffect(() => {
  const fetchAreas = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/areasRegistradas`, {
        timeout: 5000, // timeout para evitar requests colgados
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (response.status === 200) {
        setAreas(response.data);
      } else {
        throw new Error(`Unexpected status code: ${response.status}`);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error fetching areas:', {
          message: error.message,
          code: error.code,
          url: error.config?.url,
          response: error.response?.data
        });
      } else {
        console.error('Unexpected error:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  fetchAreas();
}, []);

 const onlyLettersRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/;

const filteredAreas = onlyLettersRegex.test(searchTerm)
  ? areas
      .filter((area) =>
        area.nombre.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => a.nombre.localeCompare(b.nombre))
  : []; // Si contiene caracteres no permitidos, retorna una lista vacía
  const handleKeyDown = (e) => {
    const key = e.key;
    const esLetraOespacio = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]$/;

    if (!esLetraOespacio.test(key) && key !== 'Backspace' && key !== 'Delete' && key !== 'ArrowLeft' && key !== 'ArrowRight') {
      e.preventDefault();
    }
  };

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

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
    await axios.delete(`http://127.0.0.1:8000/api/eliminarArea/${areaToDelete.area_id}`);
    setAreas(areas.filter((area) => area.area_id !== areaToDelete.area_id));
    setAreaToDelete(null);

    setMensaje("Área eliminada correctamente ✅");
    setTipoMensaje("exito");

    setTimeout(() => {
      setMensaje("");
      setTipoMensaje("");
    }, 3000);

  } catch (error) {
    console.error("Error al eliminar el área:", error);

    setMensaje("Hubo un error al eliminar el área ❌");
    setTipoMensaje("error");

    setTimeout(() => {
      setMensaje("");
      setTipoMensaje("");
    }, 3000);
  }
};


  return (
    <div className="areas-list-containerHu1">
      <h1 className="areas-titleHu1">Gestión de Áreas de Competencia</h1>
      {mensaje && (
  <div className="modal-overlay">
    <div className={`modal-mensaje ${tipoMensaje}`}>
      <button className="modal-cerrar-btn" onClick={() => {
        setMensaje("");
        setTipoMensaje("");
      }}>
        ✖
      </button>
      <h2>{mensaje}</h2>
    </div>
  </div>
)}

      <div className="search-add-containerHu1">
        <div className="search-wrapperHu1">
          <input
             
             onChange={handleChange}
            onKeyDown={handleKeyDown}
            type="text"
            placeholder="Buscar por nombre de Área"
             pattern="[A-Za-zÁÉÍÓÚáéíóúÑñ\s]*"
            className="search-inputHu1"
            value={searchTerm}
            aria-label="Buscar área por nombre"
          />
        </div>

        <Link to="/admin/areas/nueva" className="add-area-buttonHu1">
          + Agregar Nueva Área
        </Link>
      </div>

      {loading ? (
        <p className="loading">Cargando áreas... ⏳</p>
      ) : (
        <>
          <p className="areas-countHu1">
            Mostrando {currentAreas.length} de {filteredAreas.length} áreas
          </p>

          {currentAreas.length === 0 ? (
            <p className="no-resultsHu1">
              No se encontraron áreas con ese nombre
            </p>
          ) : (
            <div className="area-cards-containerHu1">
              {currentAreas.map((area) => (
                <div
                  key={area.area_id}
                  className="area-cardHu1"
                  onClick={() => setSelectedArea(area)} // 👈 click para abrir info
                  style={{ cursor: "pointer" }}
                >
                  <div >
                    <h3 className="area-info-TituloHu1">{area.nombre}</h3>
                    <p className="area-info-descripcionHu1">{area.descripcion}</p>
                  </div>
                  <div className="area-buttonsHu1">
                    <Link
                      to={`/admin/areas/editar/${area.area_id}`}
                      className="edit-btnHu1"
                      aria-label={`Editar área ${area.nombre}`}
                      onClick={(e) => e.stopPropagation()} // 👈 evita que abra modal
                    >
                      <Pencil size={18} /> Editar
                    </Link>
                    <button
                      className="delete-btnHu1"
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

          <div className="paginationHu1">
            <button
            className="pagination-buttonHu1"
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
              className="pagination-buttonHu1"
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

