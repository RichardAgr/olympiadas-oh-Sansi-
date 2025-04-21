import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./AgregarRespon.css";

function EditarRespon() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [nombres, setNombres] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [ci, setCi] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [errores, setErrores] = useState({});

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api/responsables/${id}`)
      .then((res) => {
        const data = res.data;
        setNombres(data.nombres);
        setApellidos(data.apellidos);
        setCi(data.ci);
        setCorreo(data.correo_electronico);
        setTelefono(data.telefono);
      })
      .catch((err) => {
        console.error("Error fetching responsable:", err);
      });
  }, [id]);

  const validar = () => {
    const erroresNuevos = {};

    if (!nombres.trim()) {
      erroresNuevos.nombres = "El nombre es obligatorio.";
    } else if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(nombres)) {
      erroresNuevos.nombres = "El nombre no puede contener números ni caracteres especiales.";
    }

    if (!apellidos.trim()) {
      erroresNuevos.apellidos = "Los apellidos son obligatorios.";
    } else if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(apellidos)) {
      erroresNuevos.apellidos = "Los apellidos no pueden contener números ni caracteres especiales.";
    }

    if (!ci.trim()) {
      erroresNuevos.ci = "El CI es obligatorio.";
    } else if (ci.length < 7) {
      erroresNuevos.ci = "El CI debe tener al menos 7 caracteres.";
    } else if (!/^[A-Za-z0-9-]+$/.test(ci)) {
      erroresNuevos.ci = "El CI solo puede contener letras, números y el carácter '-'";
    }

    if (!correo.trim()) {
      erroresNuevos.correo = "El correo es obligatorio.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
      erroresNuevos.correo = "Correo inválido.";
    }

    if (!telefono.trim()) {
      erroresNuevos.telefono = "El teléfono es obligatorio.";
    } else if (!/^[674]\d{6,7}$/.test(telefono)) {
      erroresNuevos.telefono = "Debe comenzar con 6, 7 o 4 y tener 7 u 8 dígitos.";
    }

    setErrores(erroresNuevos);
    return Object.keys(erroresNuevos).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validar()) return;

    try {
      await axios.put(`http://127.0.0.1:8000/api/responsables/${id}`, {
        nombres,
        apellidos,
        ci,
        correo_electronico: correo,
        telefono,
      });

      alert("✅ Responsable actualizado con éxito");
      navigate("/admin/visualizarRegistro");
    } catch (error) {
      console.error("❌ Error al actualizar:", error);
      alert("Hubo un error al actualizar al responsable");
    }
  };

  const handleCancel = () => {
    navigate("/admin/visualizarRegistro");
  };

  return (
    <div className="form-container2">
      <h2>Editar Responsable de Gestión</h2>

      <form onSubmit={handleSubmit}>
        <div className="section-title">Datos del Responsable</div>

        <div className="form-row2">
          <div className="form-group2">
            <label>Nombre</label>
            <input
              type="text"
              value={nombres}
              onChange={(e) => setNombres(e.target.value)}
            />
            {errores.nombres && <small className="error">{errores.nombres}</small>}
          </div>

          <div className="form-group2">
            <label>Apellidos</label>
            <input
              type="text"
              value={apellidos}
              onChange={(e) => setApellidos(e.target.value)}
            />
            {errores.apellidos && <small className="error">{errores.apellidos}</small>}
          </div>
        </div>

        <div className="form-row2">
          <div className="form-group2">
            <label>Carnet de Identidad</label>
            <input
              type="text"
              value={ci}
              onChange={(e) => setCi(e.target.value)}
            />
            {errores.ci && <small className="error">{errores.ci}</small>}
          </div>
        </div>

        <div className="section-title">Información de Contacto</div>

        <div className="form-row2">
          <div className="form-group2">
            <label>Correo electrónico</label>
            <input
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
            />
            {errores.correo && <small className="error">{errores.correo}</small>}
          </div>

          <div className="form-group2">
            <label>Teléfono</label>
            <input
              type="tel"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
            />
            {errores.telefono && <small className="error">{errores.telefono}</small>}
          </div>
        </div>

        <div className="button-groupResp">
          <button type="button" className="btn-cancelarResp" onClick={handleCancel}>
            Cancelar
          </button>
          <button type="submit" className="btn-guardarResp">
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditarRespon;