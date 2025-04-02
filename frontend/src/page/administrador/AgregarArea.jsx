import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../App.css";


const AgregarArea = () => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [costo, setCosto] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        await axios.post("http://127.0.0.1:8000/api/areas", {
        nombre,
        descripcion,
        costo: costo,
      });
      alert("Área registrada con éxito ✅");
      navigate("/admin/areas");
    } catch (error) {
      console.error("Error al registrar el área:", error);
      alert("Hubo un error al guardar el área ❌");
    }
  };

  const handleAddCategoryArea = () => {
    navigate("/admin/crearCategoria")
  }

  return (
    <div className="form-container">
      <h1>Registrar Nueva Área</h1>
      <form onSubmit={handleSubmit}>
        <label>Nombre del Área</label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />

        <label>Descripción del Área</label>
        <textarea
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          required
        />

        <label>Costo (Bs)</label>
        <input
          type="number"
          value={costo}
          onChange={(e) => setCosto(e.target.value)}
          required
        />

        <button type="button" className="btn-secondary" onClick={handleAddCategoryArea }>
          Registrar Categorías
        </button>

        <div className="button-group">
          <button
            type="button"
            onClick={() => navigate("/admin/areas")}
            className="btn-cancelarReg"
          >
            Cancelar
          </button>
          <button type="submit" className="btn-guardarReg">
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
};

export default AgregarArea;

