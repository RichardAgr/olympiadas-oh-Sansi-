import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Pencil, Trash2 } from "lucide-react"; // 👈 Importa los íconos
import "../../App.css";

const AreasList = () => {
  const [areas, setAreas] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8000/api/areas")
      .then((response) => setAreas(response.data))
      .catch((error) => console.error("Error fetching areas:", error));
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = confirm("¿Estás seguro de eliminar esta área? 🚨");
    if (!confirmDelete) return;
  
    try {
      await axios.delete(`http://localhost:8000/api/areas/${id}`);
      alert("Área eliminada correctamente ✅");
      // Recargar la lista sin volver a consultar la API (opcional)
      setAreas(areas.filter(area => area.area_id !== id));
    } catch (error) {
      console.error("Error al eliminar el área:", error);
      alert("Hubo un error al eliminar el área ❌");
    }
  };
  
  return (
    <div className="areas-list-container">
      <h1 className="areas-title">Gestión de Áreas de Competencia</h1>
      
      <div className="search-add-container">
        <input type="text" placeholder="Buscar por nombre de Área" className="search-input" />
        <Link to="/admin/areas/nueva" className="add-area-button">+ Agregar Nueva Área</Link>
      </div>

      <div className="area-cards-container">
        {areas.map((area) => (
          <div key={area.area_id} className="area-card">
            <div className="area-info">
              <h3>{area.nombre}</h3>
              <p>{area.descripcion}</p>
            </div>
            <div className="area-buttons">
              <Link to={`/admin/areas/editar/${area.area_id}`} className="edit-btn">
                <Pencil size={18} /> Editar
              </Link>
              <button className="delete-btn" onClick={() => handleDelete(area.area_id)}>🗑️ Eliminar</button>
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
    </div>
  );
};

export default AreasList;

