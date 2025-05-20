import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import axios from "axios"
import perfilDefault from "../../../assets/perfil-default.png"
import correoIcon from "../../../assets/email.png"
import telefonoIcon from "../../../assets/telefono.png"
import ciIcon from "../../../assets/ci.png"
import AceptarCambiosIcon from "../../../assets/AceptarCambios.png"
import ConfirmacionIcon from "../../../assets/Confirmacion.png"
import "./Configuracion.css"

function Configuracion() {
  const navigate = useNavigate()
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false)
  const { id } = useParams()

  const [datosTutor, setDatosTutor] = useState({
    nombres: "",
    apellidos: "",
    correo_electronico: "",
    telefono: "",
    ci: "",
  })

  // Estado para manejar errores de validación
  const [errores, setErrores] = useState({
    nombres: "",
    apellidos: "",
    correo_electronico: "",
    telefono: "",
    ci: "",
  })

  const [exito, setExito] = useState(false)

  useEffect(() => {
    const getDataTutor = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/VerMiPerfil/${id}/Tutor`)
        setDatosTutor(response.data)
      } catch (error) {
        console.error("Error cargando datos del tutor:", error)
      }
    }
    getDataTutor()
  }, [id])

  // Función para validar los campos
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

    default:
      break;
  }

  return error;
};
  const handleChange = (e) => {
    const { name, value } = e.target

    // Actualizar los datos
    setDatosTutor((prev) => ({ ...prev, [name]: value }))

    // Validar el campo y actualizar errores
    const error = validarCampo(name, value)
    setErrores((prev) => ({ ...prev, [name]: error }))
  }

  // Validar todos los campos antes de confirmar
  const validarFormulario = () => {
    const nuevosErrores = {}
    let formularioValido = true

    // Validar cada campo
    Object.entries(datosTutor).forEach(([key, value]) => {
      const error = validarCampo(key, value)
      nuevosErrores[key] = error
      if (error) {
        formularioValido = false
      }
    })

    setErrores(nuevosErrores)
    return formularioValido
  }

  const confirmarGuardado = () => {
    // Solo mostrar confirmación si todos los campos son válidos
    if (validarFormulario()) {
      setMostrarConfirmacion(true)
    }
  }

  const guardarCambios = async () => {
    try {
      await axios.put(`http://127.0.0.1:8000/api/tutor/ActualizarMiPerfil/${id}`, datosTutor)
      setMostrarConfirmacion(false)
      setExito(true)
    } catch (error) {
      console.error("Error al guardar cambios:", error)
      setMostrarConfirmacion(false)
    }
  }

  const volverHome = () => {
    navigate(`/homeTutor/${id}/tutor`)
  }

  const cancelarEdicion = () => {
    axios
      .get(`http://127.0.0.1:8000/api/VerMiPerfil/${id}/Tutor`)
      .then((response) => {
        setDatosTutor(response.data)
        // Limpiar errores al cancelar
        setErrores({
          nombres: "",
          apellidos: "",
          correo_electronico: "",
          telefono: "",
          ci: "",
        })
        volverHome()
      })
      .catch((error) => console.error("Error al cancelar:", error))
  }

  return (
    <div className="perfil-container">
      <h1 className="titulo-pagina">Editar Perfil</h1>

      {/* Card 1 - Datos básicos */}
      <div className="card-perfil">
        <img src={perfilDefault || "/placeholder.svg"} alt="Foto de perfil" className="imagen-perfil" />

        <div className="info-personal">
          <div className="campo">
            <label>Nombre:</label>
            <div className="input-con-icono">
              <input
                type="text"
                name="nombres"
                value={datosTutor.nombres || ""}
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
                value={datosTutor.apellidos || ""}
                onChange={handleChange}
                className={errores.apellidos ? "input-error" : ""}
              />
            </div>
            {errores.apellidos && <span className="mensaje-error">{errores.apellidos}</span>}
          </div>
        </div>
      </div>

      {/* Card 2 - Datos de contacto */}
      <div className="card-perfil vertical">
        <div className="campo">
          <label>Correo:</label>
          <div className="input-con-icono">
            <img src={correoIcon || "/placeholder.svg"} alt="Correo" className="icono" />
            <input
              type="email"
              name="correo_electronico"
              value={datosTutor.correo_electronico || ""}
              onChange={handleChange}
              className={errores.correo_electronico ? "input-error" : ""}
            />
          </div>
          {errores.correo_electronico && <span className="mensaje-error">{errores.correo_electronico}</span>}
        </div>

        <div className="campo">
          <label>Teléfono:</label>
          <div className="input-con-icono">
            <img src={telefonoIcon || "/placeholder.svg"} alt="Teléfono" className="icono" />
            <input
              type="tel"
              name="telefono"
              value={datosTutor.telefono || ""}
              onChange={handleChange}
              className={errores.telefono ? "input-error" : ""}
            />
          </div>
          {errores.telefono && <span className="mensaje-error">{errores.telefono}</span>}
        </div>

        <div className="campo">
          <label>Número de Carnet:</label>
          <div className="input-con-icono">
            <img src={ciIcon || "/placeholder.svg"} alt="Carnet" className="icono" />
            <input
              type="text"
              name="ci"
              value={datosTutor.ci || ""}
              onChange={handleChange}
              className={errores.ci ? "input-error" : ""}
            />
          </div>
          {errores.ci && <span className="mensaje-error">{errores.ci}</span>}
        </div>
      </div>

      {/* Botones */}
      <div className="botones-centrados">
        <button className="btn-guardar" onClick={confirmarGuardado}>
          Guardar
        </button>
        <button className="btn-cancelar" onClick={volverHome}>
          Cancelar
        </button>
      </div>

      {/* Modal de confirmación */}
      {mostrarConfirmacion && (
        <div className="modal-fondo">
          <div className="modal">
            <div className="modal-icono">
              <img src={AceptarCambiosIcon || "/placeholder.svg"} alt="Aceptar cambios" className="icono-modal" />
            </div>
            <p>¿Está seguro de guardar los cambios?</p>
            <div className="modal-botones">
              <button className="btn-guardar" onClick={guardarCambios}>
                Confirmar
              </button>
              <button className="btn-cancelar" onClick={() => setMostrarConfirmacion(false)}>
                Volver
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de éxito */}
      {exito && (
        <div className="modal-fondo">
          <div className="modal">
            <div className="modal-icono">
              <img src={ConfirmacionIcon || "/placeholder.svg"} alt="Confirmación" className="icono-modal" />
            </div>
            <p>Cambios guardados con éxito</p>
            <button className="btn-guardar" onClick={volverHome}>
              Volver al Home
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Configuracion
