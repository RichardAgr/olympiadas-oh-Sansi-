import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Pencil, Trash2 } from "lucide-react";
import ModalConfirmDelete from "../../components/ModalConfirmDelete"; // Importa el modal
import "../../App.css";

const AreasList = () => {
  const [areas, setAreas] = useState([]);
  const [areaToDelete, setAreaToDelete] = useState(null); // Estado para el área a eliminar

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/areas")
      .then((response) => setAreas(response.data))
      .catch((error) => console.error("Error fetching areas:", error));
  }, []);

  const handleConfirmDelete = async () => {
    if (!areaToDelete) return; 
  
    try {
      await axios.delete(`http://localhost:8000/api/areas/${areaToDelete.area_id}`);
      setAreas(areas.filter((area) => area.area_id !== areaToDelete.area_id));
      setAreaToDelete(null);
      alert("Área eliminada correctamente ✅");
    } catch (error) {
      const msg = error.response?.data?.message || "Error al eliminar el área ❌";
      alert(msg);
    }
  };
  

  return (
    <div className="areas-list-container">
      <h1 className="areas-title">Gestión de Áreas de Competencia</h1>

      <div className="search-add-container">
        <input
          type="text"
          placeholder="Buscar por nombre de Área"
          className="search-input"
        />
        <Link to="/admin/areas/nueva" className="add-area-button">
          + Agregar Nueva Área
        </Link>
      </div>

      <div className="area-cards-container">
        {areas.map((area) => (
          <div key={area.area_id} className="area-card">
            <div className="area-info">
              <h3>{area.nombre}</h3>
              <p>{area.descripcion}</p>
            </div>
            <div className="area-buttons">
              <Link
                to={`/admin/areas/editar/${area.area_id}`}
                className="edit-btn"
              >
                <Pencil size={18} /> Editar
              </Link>
              <button
                className="delete-btn"
                onClick={() => setAreaToDelete(area)}
              >
                <Trash2 size={18} /> Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="pagination">
        <button>{"<"}</button>
        <button className="active">1</button>
        <button>2</button>
        <button>3</button>
        <button>{">"}</button>
      </div>

      {areaToDelete && (
        <ModalConfirmDelete
          areaName={areaToDelete.nombre}
          onConfirm={handleConfirmDelete}
          onCancel={() => setAreaToDelete(null)}
        />
      )}
    </div>
  );
};

export default AreasList;
