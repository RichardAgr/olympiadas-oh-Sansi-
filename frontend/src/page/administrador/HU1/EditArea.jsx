import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import "./hu1.css";

const EditArea = () => {
  const { id, id_competencia } = useParams();
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [costo, setCosto] = useState("");
  const [errores, setErrores] = useState({});
  const navigate = useNavigate();
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState(""); // 'exito' o 'error'
  const routeTo=(subruta)=>`/admin/HomeAdmin/${id_competencia}/${subruta}`;



  const handleNombreChange = (e) => {
  const valor = e.target.value;
  const regex = /^[a-zA-Z\s]*$/;
  if (regex.test(valor) || valor === "") {
    setNombre(valor);
    // setNombreError(""); ← elimina esta línea si no usas nombreError
  } else {
    // Puedes mostrar error usando `setErrores` si lo deseas:
    setErrores(prev => ({ ...prev, nombre: "El nombre solo puede contener letras y espacios." }));
  }
};


useEffect(() => {
  const authToken = localStorage.getItem("authToken");

  axios.get(`http://localhost:8000/api/obtenerDatosArea/${id}`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
      'Accept': 'application/json',
    },
  })
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
  } else if (parseFloat(costo) < 10) {     // <-- Esta validación nueva
    nuevosErrores.costo = "El costo debe ser al menos 10.";
  }

  setErrores(nuevosErrores);
  return Object.keys(nuevosErrores).length === 0;
};


const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validarFormulario()) return;
  const data ={
      nombre,
      descripcion,
      costo,
      estado: true,
  }


  try {
    const authToken = localStorage.getItem("authToken");

await axios.put(`http://127.0.0.1:8000/api/actualizarArea/${id}`, data, {
  headers: {
    Authorization: `Bearer ${authToken}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});


    setMensaje("Área actualizada con éxito ✅");
    setTipoMensaje("exito");

    setTimeout(() => {
      setMensaje("");
      setTipoMensaje("");
      navigate(routeTo("admin/areas"));
    }, 3000);
  } catch (error) {
    setMensaje("Hubo un error al actualizar el área ❌");
    setTipoMensaje("error");

    setTimeout(() => {
      setMensaje("");
      setTipoMensaje("");
    }, 3000);
  }
};



  return (
    <div className="form-area-container-area">
      <h1 className="titulo-editar-area">Editar Área</h1>
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
        />
        {errores.descripcion && <small className="error-text-area">{errores.descripcion}</small>}


        <label className="etiqueta-campo-area">Costo (Bs)</label>
        <input
          type="number"
          value={costo}
          onChange={(e) => setCosto(e.target.value)}
          className="campo-entrada-area"
        />
        {errores.costo && <small className="error-text-area">{errores.costo}</small>}

        <div className="botones-form-area">
          <button
            type="button"
            onClick={() => navigate(routeTo("admin/areas"))}
            className="btn-cancelar-area"
          >
            Cancelar
          </button>
          <button type="submit" className="btn-guardar-area">
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditArea;

