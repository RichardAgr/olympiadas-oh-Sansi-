import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AceptarCambiosIcon from "../../assets/AceptarCambios.png";
import ConfirmacionIcon from "../../assets/Confirmacion.png";
import "./MiPerfilRespGestion.css";

function ConfiguracionRespGestion() {
  const navigate = useNavigate();
  const userId = JSON.parse(localStorage.getItem("user"))?.responsable_id;
  const token = localStorage.getItem("authToken");

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

  const [errores, setErrores] = useState({});
  const [success, setSuccess] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    if (!userId || !token) {
      console.warn("ID o token no encontrado en localStorage");
      return;
    }

    axios.get(`http://127.0.0.1:8000/api/VerMiPerfil/${userId}/Responsable`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => setDatosResponsable(prev => ({
      ...res.data,
      contrasenaActual: "",
      nuevaContrasena: "",
      confirmarContrasena: ""
    })))
    .catch(err => console.error("Error al obtener datos:", err));
  }, [userId, token]);

  const validarCampo = (name, value) => {
    let error = "";
    switch (name) {
      case "nombres":
        if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]*$/.test(value)) {
          error = "El nombre solo debe contener letras";
        } else if (value.trim().length < 3) {
          error = "El nombre debe tener al menos 3 letras";
        } else if (value.length > 30) {
          error = "El nombre no debe exceder 30 caracteres";
        }
        break;
      case "apellidos":
        if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]*$/.test(value)) {
          error = "El apellido solo debe contener letras";
        } else if (value.trim().length < 3) {
          error = "El apellido debe tener al menos 3 letras";
        } else if (value.length > 30) {
          error = "El apellido no debe exceder 30 caracteres";
        }
        break;
      case "correo_electronico":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          error = "Ingrese un correo electrónico válido";
        }
        break;
      case "telefono":
        if (!/^\d*$/.test(value)) {
          error = "El teléfono solo debe contener números";
        } else if (value.length < 8) {
          error = "El teléfono debe tener al menos 8 dígitos";
        } else if (value.length > 10) {
          error = "El teléfono no debe exceder 10 dígitos";
        }
        break;
      case "ci":
        if (!/^\d*$/.test(value)) {
          error = "El número de carnet solo debe contener números";
        } else if (value.length < 7) {
          error = "El número de carnet debe tener al menos 7 dígitos";
        } else if (value.length > 10) {
          error = "El número de carnet no debe exceder 10 dígitos";
        }
        break;
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDatosResponsable(prev => ({ ...prev, [name]: value }));
    setErrores(prev => ({ ...prev, [name]: validarCampo(name, value) }));
  };

  const validarFormulario = () => {
    const nuevosErrores = {};
    let esValido = true;

    Object.entries(datosResponsable).forEach(([key, value]) => {
      const error = validarCampo(key, value);
      if (error) {
        nuevosErrores[key] = error;
        esValido = false;
      }
    });

    if (datosResponsable.nuevaContrasena || datosResponsable.confirmarContrasena || datosResponsable.contrasenaActual) {
      if (!datosResponsable.contrasenaActual) {
        nuevosErrores.contrasenaActual = "Debe ingresar su contraseña actual";
        esValido = false;
      }
      if (!datosResponsable.nuevaContrasena || datosResponsable.nuevaContrasena.length < 6) {
        nuevosErrores.nuevaContrasena = "La nueva contraseña debe tener al menos 6 caracteres";
        esValido = false;
      }
      if (datosResponsable.nuevaContrasena !== datosResponsable.confirmarContrasena) {
        nuevosErrores.confirmarContrasena = "Las contraseñas no coinciden";
        esValido = false;
      }
    }

    setErrores(nuevosErrores);
    return esValido;
  };

  const guardarCambios = async () => {
    try {
      const payload = { ...datosResponsable };
      if (!datosResponsable.nuevaContrasena) {
        delete payload.contrasenaActual;
        delete payload.nuevaContrasena;
        delete payload.confirmarContrasena;
      }

      await axios.put(`http://127.0.0.1:8000/api/responsable/ActualizarMiPerfil/${userId}`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (datosResponsable.contrasenaActual) {
        await axios.post(`http://127.0.0.1:8000/api/responsable/${userId}/cambiar-password`, {
          password_actual: datosResponsable.contrasenaActual,
          password: datosResponsable.nuevaContrasena,
          password_confirmation: datosResponsable.confirmarContrasena
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      setSuccess(true);
      setShowConfirmModal(false);
    } catch (error) {
      console.error("Error al guardar cambios:", error);
      setShowConfirmModal(false);
    }
  };

  const confirmarGuardado = () => {
    if (validarFormulario()) setShowConfirmModal(true);
  };

  const cancelarEdicion = () => {
    navigate(`/respGest/MiPerfil/${userId}`);
  };

  if (!userId) {
    return <p className="mensaje-error">⚠️ No se encontró el ID del usuario.</p>;
  }

  return <div> </div>;
}

export default ConfiguracionRespGestion;
