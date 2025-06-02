import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AgregarRespon.css";

function AgregarRespon() {
  const [nombres, setNombres] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [ci, setCi] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [errores, setErrores] = useState({});

  const navigate = useNavigate();

  const validarFormulario = () => {
    const nuevosErrores = {};
  
    if (!nombres.trim()) {
      nuevosErrores.nombres = "El nombre es obligatorio.";
    } else if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(nombres)) {
      nuevosErrores.nombres = "El nombre no puede contener números ni caracteres especiales.";
    } else if (nombres.trim().length < 3) {
      nuevosErrores.nombres = "El nombre debe tener al menos 3 letras.";
    }
  
    if (!apellidos.trim()) {
      nuevosErrores.apellidos = "Los apellidos son obligatorios.";
    } else if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(apellidos)) {
      nuevosErrores.apellidos = "Los apellidos no pueden contener números ni caracteres especiales.";
    } else if (apellidos.trim().length < 4) {
      nuevosErrores.apellidos = "Los apellidos deben tener al menos 4 letras.";
    }
  
    if (!ci.trim()) {
      nuevosErrores.ci = "El carnet de identidad es obligatorio.";
    } else if (ci.length < 7) {
      nuevosErrores.ci = "El CI debe tener al menos 7 caracteres.";
    } else if (!/^[A-Za-z0-9-]+$/.test(ci)) {
      nuevosErrores.ci = "El CI solo puede contener letras, números y el carácter '-'";
    }
  
    if (!correo.trim()) {
      nuevosErrores.correo = "El correo es obligatorio.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
      nuevosErrores.correo = "El correo no es válido.";
    }
  
    if (!telefono.trim()) {
      nuevosErrores.telefono = "El teléfono es obligatorio.";
    } else if (!/^[0-9]+$/.test(telefono)) {
      nuevosErrores.telefono = "El teléfono solo debe contener números.";
    }else if (!/^[674]\d{6,7}$/.test(telefono)) {
      nuevosErrores.telefono = "Debe comenzar con 6, 7 o 4 y tener 7 u 8 dígitos.";
    }
  
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };
  
  const handleSubmit = async (e) => {
  e.preventDefault();
  console.log("Envío de formulario iniciado.");

  if (!validarFormulario()) {
    console.warn("Validación fallida. Formulario no enviado.");
    return;
  }

  console.log("Validación exitosa. Enviando datos...");

  try {
    const data = {
      nombres,
      apellidos,
      ci,
      correo_electronico: correo,
      telefono,
    };

    const authToken = localStorage.getItem("authToken"); // Asegúrate de que esto esté guardado al hacer login

    const config = {
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
    };

    console.log("Data a enviar:", data);
    console.log("Token:", authToken);

    const response = await axios.post("http://localhost:8000/api/registrarResponGestion", data, config);
    console.log("Datos enviados con éxito.");
    navigate("/admin/visualizarRegistro");

  } catch (error) {
    console.error("Error al registrar al responsable:", error.response || error.message);
  }
};


  const handleCancel = () => {
    navigate("/admin/visualizarRegistro");
  };

  return (
    <div className="form-container2Hu41">
      <h2>Registrar Nuevo Responsable de Gestión</h2>
      <form onSubmit={handleSubmit}>
        <div className="section-titleHu41">Datos del Responsable</div>

        <div className="form-row2Hu41">
          <div className="form-group2Hu41">
            <label>Nombre</label>
            <input
              type="text"
              value={nombres}
              onChange={(e) => setNombres(e.target.value)}
            />
            {errores.nombres && <small className="errorHu41">{errores.nombres}</small>}
          </div>

          <div className="form-group2Hu41">
            <label>Apellidos</label>
            <input
              type="text"
              value={apellidos}
              onChange={(e) => setApellidos(e.target.value)}
            />
            {errores.apellidos && <small className="errorHu41">{errores.apellidos}</small>}
          </div>
        </div>

        <div className="form-row2Hu41">
          <div className="form-group2Hu41">
            <label>Carnet de Identidad</label>
            <input
              type="text"
              value={ci}
              onChange={(e) => setCi(e.target.value)}
            />
            {errores.ci && <small className="errorHu41">{errores.ci}</small>}
          </div>
        </div>

        <div className="section-titleHu41">Información de Contacto</div>

        <div className="form-row2Hu41">
          <div className="form-group2Hu41">
            <label>Correo electrónico</label>
            <input
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
            />
            {errores.correo && <small className="errorHu41">{errores.correo}</small>}
          </div>

          <div className="form-group2Hu41">
            <label>Teléfono</label>
            <input
              type="tel"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
            />
            {errores.telefono && <small className="errorHu41">{errores.telefono}</small>}
          </div>
        </div>

        <div className="button-groupRespHu41">
          <button type="button" className="btn-cancelarRespHu41" onClick={handleCancel}>
            Cancelar
          </button>
          <button type="submit" className="btn-guardarRespHu41">
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
}

export default AgregarRespon;