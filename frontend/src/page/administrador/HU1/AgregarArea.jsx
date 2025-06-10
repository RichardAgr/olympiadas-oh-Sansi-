import  { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "../../../App.css";
import "./hu1.css"; // Asegúrate de que este archivo CSS exista y tenga los estilos necesarios

const AgregarArea = () => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [costo, setCosto] = useState("");
  const [errores, setErrores] = useState({});
  const navigate = useNavigate();
  const [nombreError, setNombreError] = useState("");
  const [descripcionError, setDescripcionError] = useState("");
  const [costoError, setCostoError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState(""); // 'exito' o 'error'
  const { id_competencia } = useParams();
  const routeTo=(subruta)=>`/admin/HomeAdmin/${id_competencia}/${subruta}`;


  const handleNombreChange = (e) => {
    const valor = e.target.value;
    //Expresion regular para validar que solo permite letras y espacios
    const regex = /^[a-zA-Z\s]*$/;
    if (regex.test(valor) || valor === "") {
      setNombre(valor);
      setNombreError("");
    } else {
      setNombreError("El nombre solo puede contener letras y espacios.");
    }
  }


  const validarFormulario = () => {
  const nuevosErrores = {};

  if (!nombre.trim()) {
    nuevosErrores.nombre = "El nombre es obligatorio.";
  } else if (nombre.length < 5) {
    nuevosErrores.nombre = "Debe tener al menos 5 caracteres.";
  } else if (/\d/.test(nombre)) {
    nuevosErrores.nombre = "El nombre no puede contener números.";
  }

  if (!descripcion.trim()) {
    nuevosErrores.descripcion = "La descripción es obligatoria.";
  } else if (descripcion.length < 5) {
    nuevosErrores.descripcion = "Debe tener al menos 5 caracteres.";
  }

  if (!costo.trim()) {
    nuevosErrores.costo = "El costo es obligatorio.";
  } else if (isNaN(costo) || parseFloat(costo) < 9) {
    nuevosErrores.costo = "El costo debe ser mayor o igual a 9.";
  }

  setErrores(nuevosErrores);
  return Object.keys(nuevosErrores).length === 0;
};


const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validarFormulario()) return;
  const data ={
      id_competencia,
      nombre,
      descripcion,
      costo,
  }

  try {
    const authToken = localStorage.getItem("authToken");
await axios.post("http://localhost:8000/api/registrarArea", data, {
  headers: {
    Authorization: `Bearer ${authToken}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

    setMensaje("Área registrada con éxito ✅");
    setTipoMensaje("exito");

    setTimeout(() => {
      setMensaje("");
      setTipoMensaje("");
      navigate(routeTo("areas"));
    }, 2500); // Opcional: espera 2.5s antes de redirigir
  } catch (error) {
  console.error("Error al registrar el área:", error);
  
  // Mostrar mensaje inmediatamente
  setMensaje("Hubo un error al guardar el área");
  setTipoMensaje("error");

  // Ocultar el mensaje después de 2.5 segundos
  setTimeout(() => {
    setMensaje("");
    setTipoMensaje("");
  }, 2500);
}
};


  return (
    <div className="form-area-container-area">
      <h1 className="titulo-editar-area">Registrar Nueva Área</h1>
      {mensaje && (
  <div className="modal-overlay">
    <div className={`modal-mensaje ${tipoMensaje}`}>
      <h2>{mensaje}</h2>
    </div>
  </div>
)}

      <form onSubmit={handleSubmit}>
        <label className="etiqueta-campo-area">Nombre del Área</label>
        <input
         className="campo-entrada-area"
          type="text"
          value={nombre}
          onChange={handleNombreChange}
        />
        {errores.nombre && <small className="error-text-area">{errores.nombre}</small>}

        <label className="etiqueta-campo-area">Descripción del Área</label>
        <textarea
        className="campo-textarea-area"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        ></textarea>
        {errores.descripcion && <small className="error-text-area">{errores.descripcion}</small>}

        <label className="etiqueta-campo-area">Costo (Bs)</label>
        <input
        className="campo-entrada-area"
          type="number"
          value={costo}
          onChange={(e) => setCosto(e.target.value)}
        />
        {errores.costo && <small className="error-text-area">{errores.costo}</small>}

        <div className="botones-form-area">
          <button
            type="button"
            onClick={() => navigate(routeTo("areas"))}
            className="btn-cancelar-area"
          >
            Cancelar
          </button>
          <button type="submit"  className="btn-guardar-area">
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
};

export default AgregarArea;
