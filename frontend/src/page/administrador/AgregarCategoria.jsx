import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AgregarCategoria.css";
import SelectorGrado from "./SelectorGrado";

function AgregarCategoria() {
  const [areas, setAreas] = useState([]);
  const [formulario, setFormulario] = useState({
    nombre: "",
    descripcion: "",
    area_id: "",
    grado_id_inicial: "",
    grado_id_final: "",
    estado: true,
  });

  const navigate = useNavigate();

  // Cargar áreas al iniciar
  useEffect(() => {
    axios
      .get("http://localhost:8000/api/areas")
      .then((res) => setAreas(res.data))
      .catch((err) => console.error("Error al cargar áreas", err));
  }, []);

  // Manejar cambios en los inputs
  const handleChange = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  // Recibir grados seleccionados del componente hijo
  const handleGradoSeleccionado = ({ grado_id_inicial, grado_id_final }) => {
    setFormulario((prev) => ({
      ...prev,
      grado_id_inicial,
      grado_id_final,
    }));
  };

  // Enviar datos al backend
  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post("http://localhost:8000/api/nivel-categorias", formulario)
      .then(() => {
        alert("¡Categoría registrada con éxito!");
        navigate("/admin/registro-categorias");
      })
      .catch((err) => {
        console.error("Error al guardar categoría:", err);
        alert("Hubo un error al registrar la categoría.");
      });
  };

  return (
    <div className="form-categoria-container">
      <h3>Registrar Categoría</h3>
      <form onSubmit={handleSubmit}>
        {/* Nombre */}
        <label>Nombre de Categoría</label>
        <input
          type="text"
          name="nombre"
          value={formulario.nombre}
          onChange={handleChange}
          required
        />

        {/* Descripción */}
        <label>Descripción de Categoría</label>
        <textarea
          name="descripcion"
          value={formulario.descripcion}
          onChange={handleChange}
        ></textarea>

        {/* Área */}
        <label>Área</label>
        <select
          name="area_id"
          value={formulario.area_id}
          onChange={handleChange}
          required
        >
          <option value="">Seleccione un área</option>
          {areas.map((a) => (
            <option key={a.area_id} value={a.area_id}>
              {a.nombre}
            </option>
          ))}
        </select>

        {/* Grados */}
        <h4>Registrar Grado</h4>
        <SelectorGrado onSeleccionarGrados={handleGradoSeleccionado} />

        {/* Botones */}
        <div className="botones-form">
          <button type="button" className="btn-cancelar" onClick={() => navigate(-1)}>
            Cancelar
          </button>
          <button type="submit" className="btn-guardar">
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
}

export default AgregarCategoria;

