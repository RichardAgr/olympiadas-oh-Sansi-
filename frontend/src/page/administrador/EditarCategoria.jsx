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

  // Cargar áreas
  useEffect(() => {
    axios
      .get("http://localhost:8000/api/areas")
      .then((res) => setAreas(res.data))
      .catch((err) => console.error("Error al cargar áreas", err));
  }, []);

  // Cargar categoría a editar
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

  // Manejar cambios en campos
  const handleChange = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  // Actualizar grados seleccionados
  const handleGradoSeleccionado = ({ grado_id_inicial, grado_id_final }) => {
    setFormulario((prev) => ({
      ...prev,
      grado_id_inicial,
      grado_id_final,
    }));
  };

  // Enviar cambios
  const handleSubmit = (e) => {
    e.preventDefault();

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
      <h2>Editar Categoría</h2>
      <form onSubmit={handleSubmit}>
        <label>Nombre de Categoría</label>
        <input
          type="text"
          name="nombre"
          value={formulario.nombre}
          onChange={handleChange}
          required
        />

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
          required
        >
          <option value="">Seleccione un área</option>
          {areas.map((a) => (
            <option key={a.area_id} value={a.area_id}>
              {a.nombre}
            </option>
          ))}
        </select>

        <h4>Editar Grado</h4>
        <SelectorGrado
          onSeleccionarGrados={handleGradoSeleccionado}
          gradoInicial={formulario.grado_id_inicial}
          gradoFinal={formulario.grado_id_final}
        />

        <div className="botones-form">
          <button type="button" className="btn-cancelar" onClick={() => navigate(-1)}>
            Cancelar
          </button>
          <button type="submit" className="btn-guardar">
            Guardar Cambios
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditarCategoria;
