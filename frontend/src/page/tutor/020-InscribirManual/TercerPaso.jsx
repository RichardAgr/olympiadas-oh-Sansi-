import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import Swal from "sweetalert2"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import "./InscribirManual.css"

// Función para subir a Cloudinary
const uploadToCloudinary = async (file, onProgress = () => {}) => {
  try {
    const uploadPreset = "veltrixImg"
    const cloudName = "dq5zw44wg"
    const axiosSinAuth = axios.create()

    const formData = new FormData()
    formData.append("file", file)
    formData.append("upload_preset", uploadPreset)
    formData.append("resource_type", "auto")

    const response = await axiosSinAuth.post(`https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`, formData, {
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100)
          onProgress(progress)
        }
      },
    })

    return response.data
  } catch (error) {
    console.error("Error al subir a Cloudinary:", error)
    throw error
  }
}

function TercerPaso({ formData, competidorCI, onBack, onReset, setIsLoading }) {
  const [datosCargados, setDatosCargados] = useState(false)
  const [cantidadTutores, setCantidadTutores] = useState(1)
  const [competidorId, setCompetidorId] = useState(null) // Nuevo estado para el ID del competidor
  const user = JSON.parse(localStorage.getItem("user"))
  const competenciaId = user?.competencia_id

  const [tutores, setTutores] = useState([
    {
      nombres: "",
      competencia_id: competenciaId,
      apellidos: "",
      correo_electronico: "",
      telefono: "",
      ci: "",
      relacion: "",
    },
    {
      nombres: "",
      competencia_id: competenciaId,
      apellidos: "",
      correo_electronico: "",
      telefono: "",
      ci: "",
      relacion: "",
    },
  ])

  const { id } = useParams()
  const [errors, setErrors] = useState([{}, {}])
  const [exito, setExito] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [pdfUploaded, setPdfUploaded] = useState(false)
  const [cloudinaryUrl, setCloudinaryUrl] = useState("")
  const [boletaData, setBoletaData] = useState(null)
  const [esNuevaInscripcion, setEsNuevaInscripcion] = useState(true) // Nuevo estado

  useEffect(() => {
    let isMounted = true

    const fetchTutorData = async () => {
      try {
        if (datosCargados) return

        setIsLoading(true)
        const response = await axios.get(`http://localhost:8000/api/datosTutor/${id}`)
        const tutorData = response.data.data

        if (isMounted) {
          setTutores((prev) => {
            const updated = [...prev]
            updated[0] = {
              ...updated[0],
              nombres: tutorData.nombres || "",
              apellidos: tutorData.apellidos || "",
              correo_electronico: tutorData.correo_electronico || "",
              telefono: tutorData.telefono || "",
              ci: tutorData.ci || "",
              relacion: "",
            }
            return updated
          })
          setDatosCargados(true)
        }
      } catch (error) {
        console.error("Error al cargar datos del tutor:", error)
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudieron cargar los datos del tutor",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchTutorData()

    return () => {
      isMounted = false
    }
  }, [id, datosCargados, setIsLoading])

  const tutoresFinal = tutores.slice(0, cantidadTutores).map((t, i) => ({
    ...t,
    nivel_responsabilidad: i === 0 ? "principal" : "secundario",
  }))

  const obtenerDatosBoleta = async (competidorIdParam) => {
    try {
      const response = await axios.post(`http://localhost:8000/api/boleta/generar/${competidorIdParam}`)
      const data = response.data.boleta
      setBoletaData(data)
      return data
    } catch (error) {
      console.error("Error al obtener datos de la boleta:", error)
      throw error
    }
  }

  const handleTutorChange = (index, e) => {
    const { name, value } = e.target
    const nuevosTutores = [...tutores]
    nuevosTutores[index][name] = value
    setTutores(nuevosTutores)

    // Limpiar errores cuando el usuario empiece a escribir
    if (errors[index][name]) {
      const nuevosErrores = [...errors]
      nuevosErrores[index] = { ...nuevosErrores[index], [name]: "" }
      setErrors(nuevosErrores)
    }
  }

  const validateTutor = (tutor) => {
    const err = {}
    const soloLetrasRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/
    const soloNumerosRegex = /^[0-9]+$/

    if (!tutor.nombres.trim()) {
      err.nombres = "El nombre es obligatorio."
    } else if (tutor.nombres.trim().length < 3) {
      err.nombres = "El nombre debe tener al menos 3 caracteres."
    } else if (!soloLetrasRegex.test(tutor.nombres)) {
      err.nombres = "El nombre solo debe contener letras."
    }

    if (!tutor.apellidos.trim()) {
      err.apellidos = "El apellido es obligatorio."
    } else if (tutor.apellidos.trim().length < 6) {
      err.apellidos = "El apellido debe tener al menos 6 caracteres."
    } else if (!soloLetrasRegex.test(tutor.apellidos)) {
      err.apellidos = "El apellido solo debe contener letras."
    }

    if (!tutor.correo_electronico.trim()) {
      err.correo_electronico = "El correo electrónico es obligatorio."
    } else if (!/\S+@\S+\.\S+/.test(tutor.correo_electronico)) {
      err.correo_electronico = "Ingrese un correo electrónico válido."
    }

    if (!tutor.telefono.trim()) {
      err.telefono = "El teléfono es obligatorio."
    } else if (!soloNumerosRegex.test(tutor.telefono)) {
      err.telefono = "El teléfono solo debe contener números."
    } else if (tutor.telefono.trim().length < 7) {
      err.telefono = "El teléfono debe tener al menos 7 dígitos."
    }

    if (!tutor.ci.trim()) {
      err.ci = "El CI es obligatorio."
    } else if (!soloNumerosRegex.test(tutor.ci)) {
      err.ci = "El CI solo debe contener números."
    } else if (tutor.ci.trim().length < 7) {
      err.ci = "El CI debe tener al menos 7 dígitos."
    }

    if (!tutor.relacion) {
      err.relacion = "Debe seleccionar una relación con el estudiante."
    }

    return err
  }

  // Función para registrar el competidor
  const registrarCompetidor = async () => {
    try {
      const datosCompetidor = {
        competidor: {
          nombres: formData.nombres,
          apellidos: formData.apellidos,
          ci: formData.ci,
          fecha_nacimiento: formData.fecha_nacimiento,
          colegio: formData.colegio,
          curso: formData.curso_completo,
          area: formData.area,
          categoria: formData.categoria,
          departamento: formData.departamento,
          provincia: formData.provincia,
          competencia_id: competenciaId,
          rango: formData.rango,
        },
      }

      const response = await axios.post(`http://localhost:8000/api/tutor/${id}/inscribir-competidor`, datosCompetidor, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      })

      // Verificar si es una nueva inscripción o competidor existente
      setEsNuevaInscripcion(response.data.es_nueva_inscripcion || false)

      return response.data.competidor_id
    } catch (error) {
      console.error("Error al registrar competidor:", error)

      // Manejar errores específicos
      if (error.response?.status === 422) {
        const errorMessage = error.response.data.message || "Error de validación"
        throw new Error(errorMessage)
      }

      throw error
    }
  }

  const handleSubmit = async () => {
    const errores = tutores.slice(0, cantidadTutores).map(validateTutor)
    setErrors(errores)

    const tieneErrores = errores.some((err) => Object.keys(err).length > 0)

    if (tieneErrores) {
      Swal.fire({
        icon: "error",
        title: "Errores en el formulario",
        text: "Por favor, corrige los errores antes de continuar",
      })
      return
    }

    try {
      setIsLoading(true)

      // PASO 1: Registrar/Inscribir el competidor
      const nuevoCompetidorId = await registrarCompetidor()
      setCompetidorId(nuevoCompetidorId)

      // PASO 2: Registrar tutores (solo si es un competidor completamente nuevo)
      if (esNuevaInscripcion) {
        await axios.post(`http://localhost:8000/api/tutor/${id}/registrar-tutores`, {
          tutores: tutoresFinal,
          competidor_id: nuevoCompetidorId,
        })
      }

      // PASO 3: Obtener datos de la boleta
      await obtenerDatosBoleta(nuevoCompetidorId)

      setExito(true)

      Swal.fire({
        icon: "success",
        title: "¡Inscripción completada!",
        text: esNuevaInscripcion
          ? "El competidor ha sido registrado exitosamente"
          : "El competidor ha sido inscrito en una nueva área",
        timer: 2000,
        showConfirmButton: false,
      })
    } catch (error) {
      console.error("Error en el proceso de inscripción:", error)

      let errorMessage = "Error en el proceso de inscripción."
      if (error.message) {
        errorMessage = error.message
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      }

      Swal.fire({
        icon: "error",
        title: "Error en el registro",
        text: errorMessage,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const generarPDFBlob = async (data) => {
    const boletaInfo = data || boletaData

    if (!boletaInfo || !boletaInfo.numero_boleta || !boletaInfo.nombre_pagador || !boletaInfo.monto_total) {
      throw new Error("Datos incompletos para generar la boleta")
    }

    const doc = new jsPDF()

    doc.setFontSize(10)
    doc.text("UNIVERSIDAD MAYOR DE SAN SIMON", 14, 10)
    doc.text("DIRECCION ADMINISTRATIVA Y FINANCIERA", 14, 15)

    doc.setFontSize(12)
    doc.setTextColor(255, 0, 0)
    doc.text(`Nro. ${boletaInfo.numero_boleta}`, 160, 15)

    doc.setFontSize(16)
    doc.setTextColor(0, 0, 0)
    doc.text("RECIBO DE PAGO", 105, 30, { align: "center" })

    doc.text("Área :", 14, 52)
    doc.text(boletaInfo.area || "No especificado", 45, 52)

    doc.text("Nombre :", 14, 59)
    doc.text(boletaInfo.nombre_pagador || "No especificado", 45, 59)

    doc.text("Monto Total (Bs) :", 14, 66)
    doc.text(boletaInfo.monto_total.toString() || "0", 60, 66)

    const bodyData = boletaInfo.competidores.map((c, i) => [
      `${i + 1}.`,
      c.nombre,
      c.categoria || "No especificada",
      c.monto.toFixed(2),
    ])

    autoTable(doc, {
      startY: 75,
      head: [["Nro", "Nombre Competidor", "Categoría", "Monto"]],
      body: bodyData,
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [255, 255, 255], textColor: 0 },
    })

    return doc.output("blob")
  }

  const generarBoletaPDF = async () => {
    try {
      setIsUploading(true)
      setUploadProgress(0)

      const pdfBlob = await generarPDFBlob()
      const file = new File([pdfBlob], `recibo_${boletaData.numero_boleta}.pdf`, { type: "application/pdf" })

      const uploadResult = await uploadToCloudinary(file, (progress) => {
        setUploadProgress(progress)
      })

      setCloudinaryUrl(uploadResult.secure_url)
      setPdfUploaded(true)

      await guardarURLEnBaseDeDatos(uploadResult.secure_url)

      // Descargar el PDF
      const url = window.URL.createObjectURL(pdfBlob)
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", `recibo_${boletaData.numero_boleta}.pdf`)
      document.body.appendChild(link)
      link.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(link)

      Swal.fire({
        icon: "success",
        title: "¡Boleta generada!",
        text: "La boleta se ha descargado y guardado correctamente",
        timer: 2000,
        showConfirmButton: false,
      })
    } catch (error) {
      console.error("Error al generar y subir la boleta:", error)

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo generar la boleta",
      })

      if (boletaData) {
        try {
          await guardarURLEnBaseDeDatos("https://res.cloudinary.com/dq5zw44wg/raw/upload/error_pdf.pdf")
        } catch (apiError) {
          console.error("Error al enviar datos a la API:", apiError)
        }
      }
    } finally {
      setIsUploading(false)
    }
  }

  const guardarURLEnBaseDeDatos = async (url) => {
    try {
      if (!boletaData || !boletaData.numero_boleta || !boletaData.monto_total) {
        throw new Error("Datos de la boleta incompletos")
      }

      const data = {
        tutor_id: id,
        ci: competidorCI,
        numero_recibo: boletaData.numero_boleta,
        monto_total: boletaData.monto_total,
        fecha_emision: new Date().toISOString().split("T")[0],
        ruta_pdf: url,
        estado: "Pendiente",
      }

      const response = await axios.post("http://localhost:8000/api/guardarDatos/recibosInscripcionManual", data, {
        headers: {
          "Content-Type": "application/json",
        },
      })

      return response.data
    } catch (error) {
      console.error("Error al guardar datos:", error)
      throw error
    }
  }

  const handleNuevaInscripcion = async () => {
    if (!pdfUploaded && boletaData) {
      try {
        setIsUploading(true)
        setUploadProgress(0)

        const pdfBlob = await generarPDFBlob(boletaData)
        const file = new File([pdfBlob], `recibo_${boletaData.numero_boleta}.pdf`, { type: "application/pdf" })

        const uploadResult = await uploadToCloudinary(file, (progress) => {
          setUploadProgress(progress)
        })

        setCloudinaryUrl(uploadResult.secure_url)
        setPdfUploaded(true)

        await guardarURLEnBaseDeDatos(uploadResult.secure_url)
      } catch (error) {
        console.error("Error al subir automáticamente la boleta:", error)

        if (boletaData) {
          try {
            await guardarURLEnBaseDeDatos("https://res.cloudinary.com/dq5zw44wg/raw/upload/error_pdf.pdf")
          } catch (apiError) {
            console.error("Error al enviar datos a la API:", apiError)
          }
        }
      } finally {
        setIsUploading(false)
        onReset()
      }
    } else if (pdfUploaded && cloudinaryUrl) {
      try {
        await guardarURLEnBaseDeDatos(cloudinaryUrl)
      } catch (error) {
        console.error("Error al enviar datos a la API:", error)
      } finally {
        onReset()
      }
    } else {
      onReset()
    }
  }

  const renderTutorCard = (index) => {
    const tutor = tutores[index]
    const err = errors[index] || {}

    return (
      <div className="tutor-card-InscMan" key={index}>
        <h3 style={{ marginBottom: "15px", color: "#333" }}>{index === 0 ? "Tutor Principal" : "Tutor Secundario"}</h3>

        <div className="form-group-InscMan">
          <label>Nombres:</label>
          <div className="form-control-wrapper-InscMan">
            <input
              type="text"
              name="nombres"
              value={tutor.nombres}
              onChange={(e) => handleTutorChange(index, e)}
              className={err.nombres ? "input-error-InscMan" : ""}
              disabled={index === 0}
            />
            {err.nombres && <div className="error-message-InscMan">{err.nombres}</div>}
          </div>
        </div>

        <div className="form-group-InscMan">
          <label>Apellidos:</label>
          <div className="form-control-wrapper-InscMan">
            <input
              type="text"
              name="apellidos"
              value={tutor.apellidos}
              onChange={(e) => handleTutorChange(index, e)}
              className={err.apellidos ? "input-error-InscMan" : ""}
              disabled={index === 0}
            />
            {err.apellidos && <div className="error-message-InscMan">{err.apellidos}</div>}
          </div>
        </div>

        <div className="form-group-InscMan">
          <label>Correo Electrónico:</label>
          <div className="form-control-wrapper-InscMan">
            <input
              type="email"
              name="correo_electronico"
              value={tutor.correo_electronico}
              onChange={(e) => handleTutorChange(index, e)}
              className={err.correo_electronico ? "input-error-InscMan" : ""}
              disabled={index === 0}
            />
            {err.correo_electronico && <div className="error-message-InscMan">{err.correo_electronico}</div>}
          </div>
        </div>

        <div className="form-group-InscMan">
          <label>Teléfono:</label>
          <div className="form-control-wrapper-InscMan">
            <input
              type="text"
              name="telefono"
              value={tutor.telefono}
              onChange={(e) => handleTutorChange(index, e)}
              className={err.telefono ? "input-error-InscMan" : ""}
              disabled={index === 0}
            />
            {err.telefono && <div className="error-message-InscMan">{err.telefono}</div>}
          </div>
        </div>

        <div className="form-group-InscMan">
          <label>CI:</label>
          <div className="form-control-wrapper-InscMan">
            <input
              type="text"
              name="ci"
              value={tutor.ci}
              onChange={(e) => handleTutorChange(index, e)}
              className={err.ci ? "input-error-InscMan" : ""}
              disabled={index === 0}
            />
            {err.ci && <div className="error-message-InscMan">{err.ci}</div>}
          </div>
        </div>

        <div className="form-group-InscMan">
          <label>Relación con el competidor:</label>
          <div className="form-control-wrapper-InscMan">
            <div className="radio-group-InscMan">
              {["Padre", "Madre", "Profesor"].map((rel) => (
                <label key={rel}>
                  <input
                    type="radio"
                    name={`relacion-${index}`}
                    value={rel}
                    checked={tutor.relacion === rel}
                    onChange={(e) =>
                      handleTutorChange(index, {
                        target: { name: "relacion", value: e.target.value },
                      })
                    }
                  />
                  {rel}
                </label>
              ))}
            </div>
            {err.relacion && <div className="error-message-InscMan">{err.relacion}</div>}
          </div>
        </div>
      </div>
    )
  }

  const renderExito = () => (
    <div className="exito-container-InscMan">
      <div
        style={{
          width: "80px",
          height: "80px",
          borderRadius: "50%",
          backgroundColor: "#3b82f6",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          margin: "0 auto 20px",
        }}
      >
        <div
          style={{
            width: "30px",
            height: "50px",
            borderRight: "5px solid white",
            borderBottom: "5px solid white",
            transform: "rotate(45deg)",
            marginTop: "-10px",
          }}
        ></div>
      </div>

      <h2>{esNuevaInscripcion ? "¡Competidor registrado con éxito!" : "¡Competidor inscrito en nueva área!"}</h2>

      {isUploading ? (
        <div className="upload-progress-InscMan">
          <div className="spinner-InscMan"></div>
          <p>Subiendo PDF a Cloudinary: {uploadProgress}%</p>
        </div>
      ) : (
        <>
          <button className="descargar-button-InscMan" onClick={generarBoletaPDF} disabled={isUploading}>
            {pdfUploaded ? "Descargar Recibo" : "Generar y Descargar Recibo"}
          </button>
          <button
            className="descargar-button-InscMan"
            onClick={handleNuevaInscripcion}
            disabled={isUploading}
            style={{ marginLeft: "10px" }}
          >
            Nueva inscripción
          </button>
        </>
      )}

      {pdfUploaded && (
        <div className="pdf-uploaded-info-InscMan">
          <p>PDF subido correctamente a Cloudinary</p>
        </div>
      )}
    </div>
  )

  return (
    <div className="inscribir-manual-form-InscMan">
      {exito ? (
        renderExito()
      ) : (
        <>
          <h2 style={{ marginBottom: "20px", fontSize: "24px", fontWeight: "600" }}>Datos de Tutor(es)</h2>

          <div className="form-group-InscMan">
            <label>Cantidad de tutores:</label>
            <select
              className="short-select-InscMan"
              value={cantidadTutores}
              onChange={(e) => setCantidadTutores(Number(e.target.value))}
            >
              <option value={1}>1</option>
              <option value={2}>2</option>
            </select>
          </div>

          {renderTutorCard(0)}
          {cantidadTutores === 2 && renderTutorCard(1)}

          <div className="submit-button-container-InscMan">
            <button className="submit-button-InscMan cancel" onClick={onBack} type="button">
              Volver
            </button>
            <button className="submit-button-InscMan" onClick={handleSubmit} type="button">
              Finalizar Inscripción
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default TercerPaso
