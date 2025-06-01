import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./EditarRespon.css";

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
    console.log(`Cargando datos del responsable con ID: ${id}`);
    axios
      .get(`http://127.0.0.1:8000/api/responsables/${id}`)
      .then((res) => {
        const data = res.data;
        console.log("Datos del responsable obtenidos:", data);
        setNombres(data.nombres);
        setApellidos(data.apellidos);
        setCi(data.ci);
        setCorreo(data.correo_electronico);
        setTelefono(data.telefono);
      })
      .catch((err) => {
        console.error("Error al obtener datos del responsable:", err);
      });
  }, [id]);

  const validar = () => {
    const erroresNuevos = {};
  
    if (!nombres.trim()) {
      erroresNuevos.nombres = "El nombre es obligatorio.";
    } else if (nombres.trim().length < 3) {
      erroresNuevos.nombres = "El nombre debe tener al menos 3 caracteres.";
    } else if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(nombres)) {
      erroresNuevos.nombres = "El nombre no puede contener números ni caracteres especiales.";
    }
  
    if (!apellidos.trim()) {
      erroresNuevos.apellidos = "Los apellidos son obligatorios.";
    } else if (apellidos.trim().length < 5) {
      erroresNuevos.apellidos = "Los apellidos deben tener al menos 5 caracteres.";
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
    } else if (!/^[0-9]+$/.test(telefono)) {
      erroresNuevos.telefono = "El teléfono solo debe contener números.";
    } else if (!/^[674]\d{6,7}$/.test(telefono)) {
      erroresNuevos.telefono = "Debe comenzar con 6, 7 o 4 y tener 7 u 8 dígitos.";
    }
  
    setErrores(erroresNuevos);
    return Object.keys(erroresNuevos).length === 0;
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Inicio del proceso de actualización del responsable.");

    if (!validar()) {
      console.warn("Validación fallida. No se procederá con la actualización.");
      return;
    }
    console.log("Validación exitosa. Enviando datos actualizados...");

    try {
      await axios.put(`http://127.0.0.1:8000/api/responsables/${id}`, {
        nombres,
        apellidos,
        ci,
        correo_electronico: correo,
        telefono,
      });

      console.log("Responsable actualizado correctamente.");
      alert("Responsable actualizado con éxito.");
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
    <div className="form-container2Hu42">
      <h2>Editar Responsable de Gestión</h2>

      <form onSubmit={handleSubmit}>
        <div className="section-titleHu42">Datos del Responsable</div>

        <div className="form-row2Hu42">
          <div className="form-group2Hu42">
            <label>Nombre</label>
            <input
              type="text"
              value={nombres}
              onChange={(e) => setNombres(e.target.value)}
            />
            {errores.nombres && <small className="errorHu42">{errores.nombres}</small>}
          </div>

          <div className="form-group2Hu42">
            <label>Apellidos</label>
            <input
              type="text"
              value={apellidos}
              onChange={(e) => setApellidos(e.target.value)}
            />
            {errores.apellidos && <small className="errorHu42">{errores.apellidos}</small>}
          </div>
        </div>

        <div className="form-row2Hu42">
          <div className="form-group2Hu42">
            <label>Carnet de Identidad</label>
            <input
              type="text"
              value={ci}
              onChange={(e) => setCi(e.target.value)}
            />
            {errores.ci && <small className="errorHu42">{errores.ci}</small>}
          </div>
        </div>

        <div className="section-titleHu42">Información de Contacto</div>

        <div className="form-row2Hu42">
          <div className="form-group2Hu42">
            <label>Correo electrónico</label>
            <input
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
            />
            {errores.correo && <small className="errorHu42">{errores.correo}</small>}
          </div>

          <div className="form-group2Hu42">
            <label>Teléfono</label>
            <input
              type="tel"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
            />
            {errores.telefono && <small className="errorHu42">{errores.telefono}</small>}
          </div>
        </div>

        <div className="button-groupRespHu42">
          <button type="button" className="btn-cancelarRespHu42" onClick={handleCancel}>
            Cancelar
          </button>
          <button type="submit" className="btn-guardarRespHu42">
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditarRespon;