import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import axios from "axios"
import "./EditarCategoria.css"
import SelectorGrado from "./SelectorGrado"

function EditarCategoria() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [areas, setAreas] = useState([])
  const [formulario, setFormulario] = useState({
    nombre: "",
    descripcion: "",
    area_id: "",
    grado_id_inicial: "",
    grado_id_final: "",
    estado: true,
  })

  const [gradosCompletos, setGradosCompletos] = useState({
    grado_inicial: null,
    grado_final: null,
  })

  const [errores, setErrores] = useState({})
  const [mostrarModalCat, setMostrarModalCat] = useState(false)
  const [modalDataCat, setModalDataCat] = useState({
    titulo: "",
    mensaje: "",
    esExito: false,
  })

  // Cargar áreas
  useEffect(() => {
    axios
      .get("http://localhost:8000/api/areasRegistradas")
      .then((res) => {
        setAreas(res.data)
      })
      .catch((err) => console.error("Error al cargar áreas", err))
  }, [])

  // Cargar datos existentes
  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/nivel-categorias/${id}`)
      .then((res) => {
        const cat = res.data
        setFormulario({
          nombre: cat.nombre,
          descripcion: cat.descripcion,
          area_id: cat.area_id,
          grado_id_inicial: cat.grado_id_inicial,
          grado_id_final: cat.grado_id_final,
          estado: cat.estado,
        })
        setGradosCompletos({
          grado_inicial: cat.grado_inicial,
          grado_final: cat.grado_final,
        })
      })
      .catch((err) => {
        console.error("Error al cargar categoría:", err)
        setModalDataCat({
          titulo: "Error",
          mensaje: "No se pudo cargar la categoría.",
          esExito: false
        })
        setMostrarModalCat(true)
      })
  }, [id])

  const handleChange = (e) => {
    if (e.target.name === "nombre") {
      const regex = /^[a-zA-Z0-9\sáéíóúÁÉÍÓÚñÑ]*$/
      if (regex.test(e.target.value) || e.target.value === "") {
        setFormulario({ ...formulario, [e.target.name]: e.target.value })
        setErrores({ ...errores, [e.target.name]: "" })
      }
    } else {
      setFormulario({ ...formulario, [e.target.name]: e.target.value })
      setErrores({ ...errores, [e.target.name]: "" })
    }
  }

  const handleGradoSeleccionado = ({ grado_id_inicial, grado_id_final, grado_inicial_obj, grado_final_obj }) => {
    setFormulario((prev) => ({
      ...prev,
      grado_id_inicial,
      grado_id_final,
    }))

    if (grado_inicial_obj || grado_final_obj) {
      setGradosCompletos((prev) => ({
        ...prev,
        ...(grado_inicial_obj && { grado_inicial: grado_inicial_obj }),
        ...(grado_final_obj && { grado_final: grado_final_obj }),
      }))
    }

    setErrores((prev) => ({
      ...prev,
      grado_id_inicial: "",
      grado_id_final: "",
    }))
  }

  const validar = () => {
    const nuevosErrores = {}

    if (!formulario.nombre.trim()) {
      nuevosErrores.nombre = "El nombre es obligatorio."
    } else {
      const regex = /^[a-zA-Z0-9\sáéíóúÁÉÍÓÚñÑ]+$/
      if (!regex.test(formulario.nombre)) {
        nuevosErrores.nombre = "No se permiten caracteres especiales en el nombre."
      }
    }

    if (!formulario.area_id) nuevosErrores.area_id = "Debe seleccionar un área."
    if (!formulario.grado_id_inicial) nuevosErrores.grado_id_inicial = "Seleccione el grado inicial."
    if (!formulario.grado_id_final) nuevosErrores.grado_id_final = "Seleccione el grado final."

    return nuevosErrores
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const validacion = validar()
    if (Object.keys(validacion).length > 0) {
      setErrores(validacion)
      return
    }

    const datosParaEnvio = {
      nombre: formulario.nombre,
      descripcion: formulario.descripcion,
      area_id: formulario.area_id,
      grado_id_inicial: formulario.grado_id_inicial,
      grado_id_final: formulario.grado_id_final,
      estado: formulario.estado,
    }

    axios
      .put(`http://localhost:8000/api/nivel-categorias/${id}`, datosParaEnvio)
      .then((response) => {
        setModalDataCat({
          titulo: "Éxito",
          mensaje: "¡Categoría actualizada con éxito!",
          esExito: true
        })
        setMostrarModalCat(true)
      })
      .catch((err) => {
        console.error("Detalles del error al actualizar:", {
          mensaje: err.message,
          datosError: err.response?.data,
          status: err.response?.status,
        })
        setModalDataCat({
          titulo: "Error",
          mensaje: err.response?.data?.message || "Hubo un error al actualizar la categoría.",
          esExito: false
        })
        setMostrarModalCat(true)
      })
  }

  const cerrarModalCat = () => {
    setMostrarModalCat(false)
    if (modalDataCat.esExito) {
      navigate("/admin/registro-categorias")
    }
  }

  return (
    <div className="form-categoria-container-Cat">
      <h4 className="titulo-editar-Cat">Editar Categoría</h4>
      <form onSubmit={handleSubmit} className="formulario-editar-Cat">
        <label className="etiqueta-campo-Cat">Nombre de Categoría</label>
        <input
          type="text"
          name="nombre"
          value={formulario.nombre}
          onChange={handleChange}
          className="campo-entrada-Cat"
        />
        {errores.nombre && <small className="error-text-Cat">{errores.nombre}</small>}

        <label className="etiqueta-campo-Cat">Descripción de Categoría</label>
        <textarea
          name="descripcion"
          value={formulario.descripcion}
          onChange={handleChange}
          className="campo-textarea-Cat"
        ></textarea>

        <label className="etiqueta-campo-Cat">Área*</label>
        <select name="area_id" value={formulario.area_id} onChange={handleChange} className="campo-select-Cat">
          <option value="">Seleccione un área</option>
          {areas.map((a) => (
            <option key={a.area_id} value={a.area_id}>
              {a.nombre}
            </option>
          ))}
        </select>
        {errores.area_id && <small className="error-text-Cat">{errores.area_id}</small>}

        <h4 className="subtitulo-grado-Cat">Editar Grado</h4>
        <SelectorGrado
          onSeleccionarGrados={handleGradoSeleccionado}
          gradoInicial={formulario.grado_id_inicial}
          gradoFinal={formulario.grado_id_final}
          gradoInicialCompleto={gradosCompletos.grado_inicial}
          gradoFinalCompleto={gradosCompletos.grado_final}
        />
        {errores.grado_id_inicial && <small className="error-text-Cat">{errores.grado_id_inicial}</small>}
        {errores.grado_id_final && <small className="error-text-Cat">{errores.grado_id_final}</small>}

        <div className="botones-form-Cat">
          <button type="button" className="btn-cancelar-Cat" onClick={() => navigate(-1)}>
            Cancelar
          </button>
          <button type="submit" className="btn-guardar-Cat">
            Guardar
          </button>
        </div>
      </form>

      {/* Modal de confirmación con sufijo Cat */}
      {mostrarModalCat && (
        <div className="modal-overlay-Cat">
          <div className={`modal-container-Cat ${modalDataCat.esExito ? 'modal-success-Cat' : 'modal-error-Cat'}`}>
            <h3>{modalDataCat.titulo}</h3>
            <p>{modalDataCat.mensaje}</p>
            <button 
              onClick={cerrarModalCat}
              className={`modal-btn-Cat ${modalDataCat.esExito ? 'modal-btn-success-Cat' : 'modal-btn-error-Cat'}`}
            >
              Aceptar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default EditarCategoria