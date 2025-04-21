import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "../../App.css";

const EditArea = () => {
  const { id } = useParams();
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [costo, setCosto] = useState("");
  const [errores, setErrores] = useState({});
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

  const validarFormulario = () => {
    const nuevosErrores = {};
  
    if (!nombre.trim()) {
      nuevosErrores.nombre = "El nombre es obligatorio.";
    } else if (nombre.length < 3) {
      nuevosErrores.nombre = "Debe tener al menos 3 caracteres.";
    } else if (/\d/.test(nombre)) {
      nuevosErrores.nombre = "El nombre no puede contener números.";
    }
  
    if (!descripcion.trim()) {
      nuevosErrores.descripcion = "La descripción es obligatoria.";
    } else if (descripcion.length < 5) {
      nuevosErrores.descripcion = "Debe tener al menos 5 caracteres.";
    }
  
    if (!costo) {
      nuevosErrores.costo = "El costo es obligatorio.";
    } else if (isNaN(costo) || parseFloat(costo) <= 0) {
      nuevosErrores.costo = "Debe ser un número mayor a 0.";
    }
  
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };  

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validarFormulario()) return;

    try {
      await axios.put(`http://localhost:8000/api/areas/${id}`, {
        nombre,
        descripcion,
        costo,
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
        />
        {errores.nombre && <small className="error">{errores.nombre}</small>}

        <label>Descripción del Área</label>
        <textarea
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />
        {errores.descripcion && <small className="error">{errores.descripcion}</small>}

        <label>Costo (Bs)</label>
        <input
          type="number"
          value={costo}
          onChange={(e) => setCosto(e.target.value)}
        />
        {errores.costo && <small className="error">{errores.costo}</small>}

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

export default EditArea;

