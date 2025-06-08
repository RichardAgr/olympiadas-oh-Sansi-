import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import perfilDefault from "../../../assets/perfil-default.png";
import correoIcon from "../../../assets/email.png";
import telefonoIcon from "../../../assets/telefono.png";
import ciIcon from "../../../assets/ci.png";
import AceptarCambiosIcon from "../../../assets/AceptarCambios.png";
import ConfirmacionIcon from "../../../assets/Confirmacion.png";
import "./ConfiguracionRespGestion.css"; // o "./Configuracion.css" si es compartido

function ConfiguracionRespGestion() {
  const navigate = useNavigate();
  const { id_respGest  } = useParams();
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [exito, setExito] = useState(false);

  const [datosResponsable, setDatosResponsable] = useState({
    nombres: "",
    apellidos: "",
    correo_electronico: "",
    telefono: "",
    ci: "",
    contrasenaActual: "",
    nuevaContrasena: "",
    confirmarContrasena: ""
  });

  const [errores, setErrores] = useState({
    nombres: "",
    apellidos: "",
    correo_electronico: "",
    telefono: "",
    ci: "",
    contrasenaActual: "",
    nuevaContrasena: "",
    confirmarContrasena: ""
  });

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api/VerMiPerfil/${id_respGest }/Responsable`)
      .then((res) => setDatosResponsable(res.data))
      .catch((err) => console.error("Error al obtener datos:", err));
  }, [id_respGest ]);

  const validarCampo = (name, value) => {
    let error = "";
    switch (name) {
      case "nombres":
      case "apellidos":
        if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]*$/.test(value)) {
          error = "Solo debe contener letras";
        } else if (value.trim().length < 3) {
          error = "Debe tener al menos 3 letras";
        } else if (value.length > 30) {
          error = "No debe exceder 30 caracteres";
        }
        break;
      case "correo_electronico":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          error = "Correo no válido";
        }
        break;
      case "telefono":
        if (!/^\d*$/.test(value)) {
          error = "Solo números";
        } else if (value.length < 8) {
          error = "Debe tener al menos 8 dígitos";
        } else if (value.length > 10) {
          error = "No debe exceder 10 dígitos";
        }
        break;
      case "ci":
        if (!/^\d*$/.test(value)) {
          error = "Solo números";
        } else if (value.length < 7) {
          error = "Debe tener al menos 7 dígitos";
        } else if (value.length > 10) {
          error = "No debe exceder 10 dígitos";
        }
        break;
      default:
        break;
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDatosResponsable((prev) => ({ ...prev, [name]: value }));
    setErrores((prev) => ({ ...prev, [name]: validarCampo(name, value) }));
  };

  const validarFormulario = () => {
    const nuevosErrores = {};
    let valido = true;

    Object.entries(datosResponsable).forEach(([key, value]) => {
      const error = validarCampo(key, value);
      nuevosErrores[key] = error;
      if (error) valido = false;
    });

    if (
      datosResponsable.nuevaContrasena ||
      datosResponsable.confirmarContrasena ||
      datosResponsable.contrasenaActual
    ) {
      if (!datosResponsable.contrasenaActual) {
        nuevosErrores.contrasenaActual = "Debe ingresar su contraseña actual";
        valido = false;
      }
      if (!datosResponsable.nuevaContrasena || datosResponsable.nuevaContrasena.length < 6) {
        nuevosErrores.nuevaContrasena = "La nueva contraseña debe tener al menos 6 caracteres";
        valido = false;
      }
      if (datosResponsable.nuevaContrasena !== datosResponsable.confirmarContrasena) {
        nuevosErrores.confirmarContrasena = "Las contraseñas no coinciden";
        valido = false;
      }
    }

    setErrores(nuevosErrores);
    return valido;
  };

  const confirmarGuardado = () => {
    if (validarFormulario()) setMostrarConfirmacion(true);
  };

  const guardarCambios = async () => {
    try {
      const payload = { ...datosResponsable };
      if (!datosResponsable.nuevaContrasena) {
        delete payload.contrasenaActual;
        delete payload.nuevaContrasena;
        delete payload.confirmarContrasena;
      }

      await axios.put(
        `http://127.0.0.1:8000/api/responsable/ActualizarMiPerfil/${id}`,
        payload
      );

      if (datosResponsable.contrasenaActual) {
        await axios.post(
          `http://127.0.0.1:8000/api/responsable/${id}/cambiar-password`,
          {
            password_actual: datosResponsable.contrasenaActual,
            password: datosResponsable.nuevaContrasena,
            password_confirmation: datosResponsable.confirmarContrasena
          }
        );
      }

      setMostrarConfirmacion(false);
      setExito(true);
    } catch (error) {
      console.error("Error al guardar cambios:", error);
      setMostrarConfirmacion(false);
    }
  };

  const volverHome = () => {
    navigate("/respGest");
  };

  return (
    <div className="perfil-container">
      <h1 className="titulo-pagina">Editar Perfil</h1>

      <div className="card-perfil">
        <img src={perfilDefault} alt="Foto de perfil" className="imagen-perfil" />

        <div className="info-personal">
          <div className="campo">
            <label>Nombre:</label>
            <div className="input-con-icono">
              <input
                type="text"
                name="nombres"
                value={datosResponsable.nombres}
                onChange={handleChange}
                className={errores.nombres ? "input-error" : ""}
              />
            </div>
            {errores.nombres && <span className="mensaje-error">{errores.nombres}</span>}
          </div>

          <div className="campo">
            <label>Apellido:</label>
            <div className="input-con-icono">
              <input
                type="text"
                name="apellidos"
                value={datosResponsable.apellidos}
                onChange={handleChange}
                className={errores.apellidos ? "input-error" : ""}
              />
            </div>
            {errores.apellidos && <span className="mensaje-error">{errores.apellidos}</span>}
          </div>
        </div>
      </div>

      <div className="card-perfil vertical">
        <div className="campo">
          <label>Correo:</label>
          <div className="input-con-icono">
            <img src={correoIcon} alt="Correo" className="icono" />
            <input
              type="email"
              name="correo_electronico"
              value={datosResponsable.correo_electronico}
              onChange={handleChange}
              className={errores.correo_electronico ? "input-error" : ""}
            />
          </div>
          {errores.correo_electronico && <span className="mensaje-error">{errores.correo_electronico}</span>}
        </div>

        <div className="campo">
          <label>Teléfono:</label>
          <div className="input-con-icono">
            <img src={telefonoIcon} alt="Teléfono" className="icono" />
            <input
              type="tel"
              name="telefono"
              value={datosResponsable.telefono}
              onChange={handleChange}
              className={errores.telefono ? "input-error" : ""}
            />
          </div>
          {errores.telefono && <span className="mensaje-error">{errores.telefono}</span>}
        </div>

        <div className="campo">
          <label>Número de Carnet:</label>
          <div className="input-con-icono">
            <img src={ciIcon} alt="Carnet" className="icono" />
            <input
              type="text"
              name="ci"
              value={datosResponsable.ci}
              onChange={handleChange}
              className={errores.ci ? "input-error" : ""}
            />
          </div>
          {errores.ci && <span className="mensaje-error">{errores.ci}</span>}
        </div>
      </div>

      <h2 className="titulo-seccion">
        <span className="icono-candado">🔒</span> Seguridad
      </h2>

      <div className="card-perfil vertical">
        <div className="campo">
          <label>Contraseña actual:</label>
          <div className="input-con-icono">
            <input
              type="password"
              name="contrasenaActual"
              value={datosResponsable.contrasenaActual}
              onChange={handleChange}
              className={errores.contrasenaActual ? "input-error" : ""}
            />
          </div>
          {errores.contrasenaActual && (
            <span className="mensaje-error">{errores.contrasenaActual}</span>
          )}
        </div>

        <div className="campo">
          <label>Nueva contraseña:</label>
          <div className="input-con-icono">
            <input
              type="password"
              name="nuevaContrasena"
              value={datosResponsable.nuevaContrasena}
              onChange={handleChange}
              className={errores.nuevaContrasena ? "input-error" : ""}
            />
          </div>
          {errores.nuevaContrasena && (
            <span className="mensaje-error">{errores.nuevaContrasena}</span>
          )}
        </div>

        <div className="campo">
          <label>Confirmar nueva contraseña:</label>
          <div className="input-con-icono">
            <input
              type="password"
              name="confirmarContrasena"
              value={datosResponsable.confirmarContrasena}
              onChange={handleChange}
              className={errores.confirmarContrasena ? "input-error" : ""}
            />
          </div>
          {errores.confirmarContrasena && (
            <span className="mensaje-error">{errores.confirmarContrasena}</span>
          )}
        </div>
      </div>

      <div className="botones-centrados">
        <button className="btn-guardar" onClick={confirmarGuardado}>Guardar</button>
        <button className="btn-cancelar" onClick={volverHome}>Cancelar</button>
      </div>

      {mostrarConfirmacion && (
        <div className="modal-fondo">
          <div className="modal">
            <div className="modal-icono">
              <img src={AceptarCambiosIcon} alt="Aceptar cambios" className="icono-modal" />
            </div>
            <p>¿Está seguro de guardar los cambios?</p>
            <div className="modal-botones">
              <button className="btn-guardar" onClick={guardarCambios}>Confirmar</button>
              <button className="btn-cancelar" onClick={() => setMostrarConfirmacion(false)}>Volver</button>
            </div>
          </div>
        </div>
      )}

      {exito && (
        <div className="modal-fondo">
          <div className="modal">
            <div className="modal-icono">
              <img src={ConfirmacionIcon} alt="Confirmación" className="icono-modal" />
            </div>
            <p>Cambios guardados con éxito</p>
            <button className="btn-guardar" onClick={volverHome}>Volver al Home</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ConfiguracionRespGestion;



