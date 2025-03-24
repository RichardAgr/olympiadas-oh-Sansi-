import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "../../App.css";

const EditArea = () => {
  const { id } = useParams();
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [costo, setCosto] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:8000/api/areas/${id}`)
      .then((response) => {
        setNombre(response.data.nombre);
        setDescripcion(response.data.descripcion);
        setCosto(response.data.costo);
      })
      .catch((error) => console.error("Error al cargar el área:", error));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8000/api/areas/${id}`, {
        nombre,
        descripcion,
        costo: costo,
        estado: true,
      });
      alert("Área actualizada con éxito ✅");
      navigate("/admin/areas");
    } catch (error) {
      console.error("Error al actualizar el área:", error);
      alert("Hubo un error al actualizar el área ❌");
    }
  };

  return (
    <div className="form-container">
      <h1>Editar Área</h1>
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

        <button type="button" className="btn-secondary">
          Registrar Categorías
        </button>

        <div className="button-group">
          <button
            type="button"
            onClick={() => navigate("/admin/areas")}
            className="btn-cancelar"
          >
            Cancelar
          </button>
          <button type="submit" className="btn-guardar">
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditArea;
