import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./AgregarCategoria.css";
import SelectorGrado from "./SelectorGrado";

function EditarCategoria() {
  const { id } = useParams();
  const navigate = useNavigate();

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

  // Cargar áreas
  useEffect(() => {
    axios
      .get("http://localhost:8000/api/areas")
      .then((res) => setAreas(res.data))
      .catch((err) => console.error("Error al cargar áreas", err));
  }, []);

  // Cargar datos existentes
  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/nivel-categorias/${id}`)
      .then((res) => {
        const cat = res.data;
        setFormulario({
          nombre: cat.nombre,
          descripcion: cat.descripcion,
          area_id: cat.area_id,
          grado_id_inicial: cat.grado_id_inicial,
          grado_id_final: cat.grado_id_final,
          estado: cat.estado,
        });
      })
      .catch((err) => {
        console.error("Error al cargar categoría:", err);
        alert("No se pudo cargar la categoría.");
        navigate("/admin/registro-categorias");
      });
  }, [id]);

  const handleChange = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
    setErrores({ ...errores, [e.target.name]: "" });
  };

  const handleGradoSeleccionado = ({ grado_id_inicial, grado_id_final }) => {
    setFormulario((prev) => ({
      ...prev,
      grado_id_inicial,
      grado_id_final,
    }));
    setErrores((prev) => ({
      ...prev,
      grado_id_inicial: "",
      grado_id_final: ""
    }));
  };

  const validar = () => {
    const nuevosErrores = {};
    if (!formulario.nombre.trim()) nuevosErrores.nombre = "El nombre es obligatorio.";
    if (!formulario.area_id) nuevosErrores.area_id = "Debe seleccionar un área.";
    if (!formulario.grado_id_inicial) nuevosErrores.grado_id_inicial = "Seleccione el grado inicial.";
    if (!formulario.grado_id_final) nuevosErrores.grado_id_final = "Seleccione el grado final.";
    return nuevosErrores;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validacion = validar();
    if (Object.keys(validacion).length > 0) {
      setErrores(validacion);
      return;
    }

    axios
      .put(`http://localhost:8000/api/nivel-categorias/${id}`, formulario)
      .then(() => {
        alert("¡Categoría actualizada con éxito!");
        navigate("/admin/registro-categorias");
      })
      .catch((err) => {
        console.error("Error al actualizar categoría:", err);
        alert("Hubo un error al actualizar la categoría.");
      });
  };

  return (
    <div className="form-categoria-container">
      <h4>Editar Categoría</h4>
      <form onSubmit={handleSubmit}>
        <label>Nombre de Categoría</label>
        <input
          type="text"
          name="nombre"
          value={formulario.nombre}
          onChange={handleChange}
        />
        {errores.nombre && <small className="error">{errores.nombre}</small>}

        <label>Descripción de Categoría</label>
        <textarea
          name="descripcion"
          value={formulario.descripcion}
          onChange={handleChange}
        ></textarea>

        <label>Área*</label>
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
        {errores.area_id && <small className="error">{errores.area_id}</small>}

        <h4>Editar Grado</h4>
        <SelectorGrado
          onSeleccionarGrados={handleGradoSeleccionado}
          gradoInicial={formulario.grado_id_inicial}
          gradoFinal={formulario.grado_id_final}
        />
        {errores.grado_id_inicial && (
          <small className="error">{errores.grado_id_inicial}</small>
        )}
        {errores.grado_id_final && (
          <small className="error">{errores.grado_id_final}</small>
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

export default EditarCategoria;

