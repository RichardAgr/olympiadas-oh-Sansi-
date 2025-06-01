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
    .get("http://localhost:8000/api/areasRegistradas")
    .then((res) => {
      console.log("Datos recibidos de áreas:", res.data); 
      setAreas(res.data);
    })
    .catch((err) => {
      console.error("Error al cargar áreas:", err.response?.data || err.message);
    });
}, []);

  const handleGradoSeleccionado = ({ grado_id_inicial, grado_id_final }) => {
    setFormulario((prev) => ({
      ...prev,
      grado_id_inicial,
      grado_id_final,
    }));
  };

  const handleChange = (e) => {
  // Validación especial para el campo nombre
  if (e.target.name === 'nombre') {
    // Expresión regular que permite letras (incluyendo acentos), números y espacios
    // pero no permite caracteres especiales
    const regexValido = /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ0-9\s]*$/;
    
    // Verificar si contiene caracteres no permitidos
    if (!regexValido.test(e.target.value)) {
      setErrores(prev => ({
        ...prev,
        nombre: "No se permiten caracteres especiales (solo letras, números y espacios)."
      }));
      return; // No actualizar el estado si hay caracteres inválidos
    } else {
      // Limpiar el error si el valor es válido
      setErrores(prev => ({ ...prev, nombre: '' }));
    }
  }
  
  setFormulario({ ...formulario, [e.target.name]: e.target.value });
};

  const validarFormulario = () => {
    const nuevosErrores = {};

    // Validación para el nombre (mínimo 6 caracteres y sin números)
    if (!formulario.nombre || formulario.nombre.trim().length < 2) {
      nuevosErrores.nombre = "El nombre debe tener al menos 6 caracteres.";
    }

    // Resto de validaciones permanecen igual
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

    console.log("Datos que se enviarán en el POST:", formulario);

    axios
      .post("http://localhost:8000/api/nivel-categorias", formulario)
      .then((response) => {
        console.log("Respuesta del servidor:", response.data);
        alert("¡Categoría registrada con éxito!");
        navigate("/admin/registro-categorias");
      })
      .catch((err) => {
        console.error("Error al guardar categoría:", err);
        if (err.response) {
          console.error("Detalles del error:", err.response.data);
        }
        alert("Hubo un error al registrar la categoría.");
      });
  };

  return (
    <div className="form-categoria-container-h2">
      <h3 className="titulo-formulario-h2">Registrar Categoría</h3>
      <form onSubmit={handleSubmit} className="formulario-categoria-h2">
        <label className="etiqueta-campo-h2">Nombre de Categoría</label>
        <input
          type="text"
          name="nombre"
          value={formulario.nombre}
          onChange={handleChange}
          className="campo-entrada-h2"
        />
        {errores.nombre && <span className="error-text-h2">{errores.nombre}</span>}

        <label className="etiqueta-campo-h2">Descripción de Categoría</label>
        <textarea
          name="descripcion"
          value={formulario.descripcion}
          onChange={handleChange}
          className="campo-textarea-h2"
        ></textarea>
        {errores.descripcion && <span className="error-text-h2">{errores.descripcion}</span>}

        <label className="etiqueta-campo-h2">Área</label>
        <select
          name="area_id"
          value={formulario.area_id}
          onChange={handleChange}
          className="campo-select-h2"
        >
          <option value="">Seleccione un área</option>
          {areas.map((a) => (
            <option key={a.area_id} value={a.area_id}>
              {a.nombre}
            </option>
          ))}
        </select>
        {errores.area_id && <span className="error-text-h2">{errores.area_id}</span>}

        <h4 className="subtitulo-seccion-h2">Registrar Grado</h4>
        <SelectorGrado onSeleccionarGrados={handleGradoSeleccionado} />
        {errores.grado_id_inicial && (
          <span className="error-text-h2">{errores.grado_id_inicial}</span>
        )}
        {errores.grado_id_final && (
          <span className="error-text-h2">{errores.grado_id_final}</span>
        )}

        <div className="botones-form-h2">
          <button 
            type="button" 
            className="btn-cancelar-h2" 
            onClick={() => navigate(-1)}
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            className="btn-guardar-h2"
          >
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
}

export default AgregarCategoria;