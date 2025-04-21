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
  const [errores, setErrores] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/areas")
      .then((res) => setAreas(res.data))
      .catch((err) => console.error("Error al cargar áreas", err));
  }, []);

  const handleChange = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  const handleGradoSeleccionado = ({ grado_id_inicial, grado_id_final }) => {
    setFormulario((prev) => ({
      ...prev,
      grado_id_inicial,
      grado_id_final,
    }));
  };

  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!formulario.nombre || formulario.nombre.trim().length < 2) {
      nuevosErrores.nombre = "El nombre debe tener al menos 2 caracteres.";
    }

    if (formulario.descripcion.length > 255) {
      nuevosErrores.descripcion = "La descripción no puede exceder los 255 caracteres.";
    }

    if (!formulario.area_id) {
      nuevosErrores.area_id = "Debe seleccionar un área.";
    }

    if (!formulario.grado_id_inicial) {
      nuevosErrores.grado_id_inicial = "Debe seleccionar un grado inicial.";
    }

    if (!formulario.grado_id_final) {
      nuevosErrores.grado_id_final = "Debe seleccionar un grado final.";
    } else if (parseInt(formulario.grado_id_final) < parseInt(formulario.grado_id_inicial)) {
      nuevosErrores.grado_id_final = "El grado final debe ser mayor o igual al inicial.";
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validarFormulario()) {
      return;
    }

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
        <label>Nombre de Categoría</label>
        <input
          type="text"
          name="nombre"
          value={formulario.nombre}
          onChange={handleChange}
        />
        {errores.nombre && <span className="error-text">{errores.nombre}</span>}

        <label>Descripción de Categoría</label>
        <textarea
          name="descripcion"
          value={formulario.descripcion}
          onChange={handleChange}
        ></textarea>
        {errores.descripcion && <span className="error-text">{errores.descripcion}</span>}

        <label>Área</label>
        <select
          name="area_id"
          value={formulario.area_id}
          onChange={handleChange}
        >
          <option value="">Seleccione un área</option>
          {areas.map((a) => (
            <option key={a.area_id} value={a.area_id}>
              {a.nombre}
            </option>
          ))}
        </select>
        {errores.area_id && <span className="error-text">{errores.area_id}</span>}

        <h4>Registrar Grado</h4>
        <SelectorGrado onSeleccionarGrados={handleGradoSeleccionado} />
        {errores.grado_id_inicial && (
          <span className="error-text">{errores.grado_id_inicial}</span>
        )}
        {errores.grado_id_final && (
          <span className="error-text">{errores.grado_id_final}</span>
        )}

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


