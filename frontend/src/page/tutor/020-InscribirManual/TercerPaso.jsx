import { useState, useEffect } from "react"
import PropTypes from "prop-types"
import { CheckCircle, Loader } from "lucide-react"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import "./TercerPaso.css"
import { useParams } from "react-router-dom"
import axios from "axios"

// Función para subir a Cloudinary
const uploadToCloudinary = async (file, onProgress = () => {}) => {
  try {
    const uploadPreset = "veltrixImg" 
    const cloudName = "dq5zw44wg" 
    const axiosSinAuth = axios.create();

    const formData = new FormData()
    formData.append("file", file)
    formData.append("upload_preset", uploadPreset)
    formData.append("resource_type", "auto") // Importante: esto permite a Cloudinary detectar automáticamente el tipo de archivo

    // Usar axios para la subida
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

function TercerPaso({ competidorId,competidorCI, onBack, onSubmit, onReset }) {
  // Ahora puedes usar el competidorId aquí
  /* console.log("ID del competidor en el tercer paso:", competidorId); */
  const [datosCargados, setDatosCargados] = useState(false)
  const [cantidadTutores, setCantidadTutores] = useState(1)
  const user = JSON.parse(localStorage.getItem('user'));
  const competenciaId = user?.competencia_id;
  const [tutores, setTutores] = useState([
    { nombres: "",competencia_id:competenciaId, apellidos: "", correo_electronico: "", telefono: "", ci: "", relacion: "" },
    { nombres: "",competencia_id:competenciaId, apellidos: "", correo_electronico: "", telefono: "", ci: "", relacion: "" }
  ])
  const { id } = useParams()
 useEffect(() => {
  let isMounted = true;

  const fetchTutorData = async () => {
    try {
      if (datosCargados) return; // evita recarga innecesaria

      const response = await axios.get(`http://localhost:8000/api/datosTutor/${id}`);
/*       console.log("Respuesta Axios tutor:", response.data); */

      const tutorData = response.data.data; // ✅ CORREGIDO AQUÍ

      if (isMounted) {
        setTutores((prev) => {
          const updated = [...prev];
          updated[0] = {
            ...updated[0],
            nombres: tutorData.nombres || "",
            apellidos: tutorData.apellidos || "",
            correo_electronico: tutorData.correo_electronico || "",
            telefono: tutorData.telefono || "",
            ci: tutorData.ci || "",
            relacion: "", 
          };
          return updated;
        });
        setDatosCargados(true); // ✅ marca como cargado
      }
    } catch (error) {
      console.error("Error al cargar datos del tutor:", error);
    }
  };

  fetchTutorData();

  return () => {
    isMounted = false;
  };
}, [id, datosCargados]);


  const tutoresFinal = tutores.slice(0, cantidadTutores).map((t, i) => ({
    ...t,
    nivel_responsabilidad: i === 0 ? "principal" : "secundario",
  }))
  const [errors, setErrors] = useState([{}, {}])
  const [exito, setExito] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [pdfUploaded, setPdfUploaded] = useState(false)
  const [cloudinaryUrl, setCloudinaryUrl] = useState("")
  const [boletaData, setBoletaData] = useState(null)

  // Función para obtener los datos de la boleta
  const obtenerDatosBoleta = async () => {
    try {
      const response = await axios.post(`http://localhost:8000/api/boleta/generar/${competidorId}`)
      const data = response.data.boleta

      setBoletaData(data)
      return data
    } catch (error) {
      console.error("Error al obtener datos de la recibo:", error)
      throw error
    }
  }

  const handleTutorChange = (index, e) => {
    const { name, value } = e.target
/*       console.log(`Cambio tutor[${index}] campo '${name}':`, value); */
    const nuevosTutores = [...tutores]
    nuevosTutores[index][name] = value
    setTutores(nuevosTutores)
  }

  const validateTutor = (tutor) => {
    const err = {};
    const soloLetrasRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
    const soloNumerosRegex = /^[0-9]+$/;
  
    // Validación: nombres
    if (!tutor.nombres.trim()) {
      err.nombres = "El nombre es obligatorio.";
    } else if (tutor.nombres.trim().length < 3) {
      err.nombres = "El nombre debe tener al menos 3 caracteres.";
    } else if (!soloLetrasRegex.test(tutor.nombres)) {
      err.nombres = "El nombre solo debe contener letras.";
    }
  
    // Validación: apellidos
    if (!tutor.apellidos.trim()) {
      err.apellidos = "El apellido es obligatorio.";
    } else if (tutor.apellidos.trim().length < 6) {
      err.apellidos = "El apellido debe tener al menos 6 caracteres.";
    } else if (!soloLetrasRegex.test(tutor.apellidos)) {
      err.apellidos = "El apellido solo debe contener letras.";
    }
  
    // Validación: correo electrónico
    if (!tutor.correo_electronico.trim()) {
      err.correo = "El correo electrónico es obligatorio.";
    } else if (!/\S+@\S+\.\S+/.test(tutor.correo_electronico)) {
      err.correo = "Ingrese un correo electrónico válido.";
    }
  
    // Validación: teléfono
    if (!tutor.telefono.trim()) {
      err.telefono = "El teléfono es obligatorio.";
    } else if (!soloNumerosRegex.test(tutor.telefono)) {
      err.telefono = "El teléfono solo debe contener números.";
    } else if (tutor.telefono.trim().length < 7) {
      err.telefono = "El teléfono debe tener al menos 7 dígitos.";
    }
  
    // Validación: carnet de identidad
    if (!tutor.ci.trim()) {
      err.ci = "El CI es obligatorio.";
    } else if (!soloNumerosRegex.test(tutor.ci)) {
      err.ci = "El CI solo debe contener números.";
    } else if (tutor.ci.trim().length < 7) {
      err.ci = "El CI debe tener al menos 7 dígitos.";
    }
  
    // Validación: relación
    if (!tutor.relacion) {
      err.relacion = "Debe seleccionar una relación con el estudiante.";
    }
  
    return err;
  };

  const handleSubmit = async () => {
    const errores = tutores.slice(0, cantidadTutores).map(validateTutor)
    setErrors(errores)

    console.log("Datos a enviar:", tutoresFinal);
    console.log("Errores de validación:", errores);

    const tieneErrores = errores.some((err) => Object.keys(err).length > 0)
    if (!tieneErrores) {
      try {
        const response = await axios.post(
          `http://localhost:8000/api/tutor/${id}/registrar-tutores`,
          { tutores: tutoresFinal, competidor_id: competidorId },
        )
        setExito(true)

        await obtenerDatosBoleta()
      } catch (error) {
        console.error("Error al registrar tutores:", error.response?.data || error.message)
        console.log("Detalles de error:", error/* .response?.data?.errors */)
      }
    }
  }

  const generarPDFBlob = async (data) => {
    const boletaInfo = data || (boletaData ? { ...boletaData } : await obtenerDatosBoleta())

    // Asegurarse de que boletaData tiene los datos necesarios
    if (!boletaInfo || !boletaInfo.numero_boleta || !boletaInfo.nombre_pagador || !boletaInfo.monto_total) {
      console.error("Datos incompletos para generar la recibo:", boletaInfo)
      throw new Error("Datos incompletos para generar la recibo")
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
    doc.text(boletaInfo.nombre_pagador || "No especificado", 45, 59) // Nombre del tutor

    doc.text("Monto Total (Bs) :", 14, 66)
    doc.text(boletaInfo.monto_total.toString() || "0", 60, 66)

    // Preparar los datos de los competidores para la tabla
    const bodyData = boletaInfo.competidores.map((c, i) => [
      `${i + 1}.`,
      c.nombre, // Nombre del competidor
      c.categoria || "No especificada", // Si la categoría es nula o vacía, mostrar un valor por defecto
      c.monto.toFixed(2), // Monto con 2 decimales
    ])

    autoTable(doc, {
      startY: 75,
      head: [["Nro", "Nombre Competidor", "Categoría", "Monto"]],
      body: bodyData,
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [255, 255, 255], textColor: 0 },
    })

    // Devolver el PDF como blob
    return doc.output("blob")
  }

  const generarBoletaPDF = async () => {
    try {
      setIsUploading(true)
      setUploadProgress(0)

      // Generar el PDF como blob
      const pdfBlob = await generarPDFBlob()

      // Crear un archivo a partir del blob
      const file = new File([pdfBlob], `recibo_${boletaData.numero_boleta}.pdf`, { type: "application/pdf" })

      // Subir a Cloudinary
      const uploadResult = await uploadToCloudinary(file, (progress) => {
        setUploadProgress(progress)
      })

      // Guardar la URL de Cloudinary
      setCloudinaryUrl(uploadResult.secure_url)
      setPdfUploaded(true)

      // Guardar la URL en la base de datos y enviar datos a la API
      await guardarURLEnBaseDeDatos(uploadResult.secure_url)

      // Descargar el PDF para el usuario
      const url = window.URL.createObjectURL(pdfBlob)
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", `recibo_${boletaData.numero_boleta}.pdf`)
      document.body.appendChild(link)
      link.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(link)
    } catch (error) {
      console.error("Error al generar y subir la recibo:", error)

      // Incluso si hay un error, intentar enviar los datos a la API con una URL predeterminada
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

  // Función para guardar la URL en la base de datos
  const guardarURLEnBaseDeDatos = async (url) => {
  try {
    // Verifica que todos los datos requeridos existen
    if (!boletaData || !boletaData.numero_boleta || !boletaData.monto_total) {
      throw new Error("Datos de la boleta incompletos");
    }

    const data = {
      tutor_id: id, 
      ci: competidorCI,
      numero_recibo: boletaData.numero_boleta,
      monto_total: boletaData.monto_total,
      fecha_emision: new Date().toISOString().split("T")[0], 
      ruta_pdf: url,
      estado: "Pendiente",
    };


    const response = await axios.post(
      "http://localhost:8000/api/guardarDatos/recibosInscripcionManual",
      data,
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );

    return response.data;

  } catch (error) {
    console.error("Error al guardar datos:", error);
    if (error.response) {
      console.error("Detalles del error:", error.response.data);
    }
    throw error;
  }
  };

  const handleNuevaInscripcion = async () => {
    // Si el PDF no se ha subido aún, subirlo automáticamente
    if (!pdfUploaded && boletaData) {
      try {
        setIsUploading(true)
        setUploadProgress(0)


        const pdfBlob = await generarPDFBlob(boletaData) 

        // Crear un archivo a partir del blob
        const file = new File([pdfBlob], `recibo_${boletaData.numero_boleta}.pdf`, { type: "application/pdf" })

        // Subir a Cloudinary
        const uploadResult = await uploadToCloudinary(file, (progress) => {
          setUploadProgress(progress)
        })

        // Guardar la URL de Cloudinary
        setCloudinaryUrl(uploadResult.secure_url)
        setPdfUploaded(true)

        // Guardar la URL en la base de datos y enviar datos a la API
        await guardarURLEnBaseDeDatos(uploadResult.secure_url)
      } catch (error) {
        console.error("Error al subir automáticamente la recibo:", error)

        // Incluso si hay un error, intentar enviar los datos a la API con una URL predeterminada
        if (boletaData) {
          try {
            await guardarURLEnBaseDeDatos("https://res.cloudinary.com/dq5zw44wg/raw/upload/error_pdf.pdf")
          } catch (apiError) {
            console.error("Error al enviar datos a la API:", apiError)
          }
        }
      } finally {
        setIsUploading(false)
        // Continuar con la nueva inscripción
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
/*     console.log(`Renderizando tutor[${index}]:`, tutor); */
    const err = errors[index] || {}

    return (
      <div className="tutor-card" key={index}>
        <div className="form-group">
          <label>Nombres:</label>
          <div className="form-control-wrapper">
            <input
              type="text"
              name="nombres"
              value={tutor.nombres}
              onChange={(e) => handleTutorChange(index, e)}
              className={err.nombres ? "input-error" : ""}
              disabled={index === 0}
            />
            {err.nombres && <div className="errorpaso3">{err.nombres}</div>}
          </div>
        </div>

        <div className="form-group">
          <label>Apellidos:</label>
          <div className="form-control-wrapper">
            <input
              type="text"
              name="apellidos"
              value={tutor.apellidos}
              onChange={(e) => handleTutorChange(index, e)}
              className={err.apellidos ? "input-error" : ""}
              disabled={index === 0}
            />
            {err.apellidos && <div className="errorpaso3">{err.apellidos}</div>}
          </div>
        </div>

        <div className="form-group">
          <label>Correo Electrónico:</label>
          <div className="form-control-wrapper">
            <input
              type="email"
              name="correo_electronico"
              value={tutor.correo_electronico}
              onChange={(e) => handleTutorChange(index, e)}
              className={err.correo ? "input-error" : ""}
              disabled={index === 0}
            />
            {err.correo_electronico && <div className="errorpaso3">{err.correo_electronico}</div>}
          </div>
        </div>

        <div className="form-group">
          <label>Teléfono:</label>
          <div className="form-control-wrapper">
            <input
              type="text"
              name="telefono"
              value={tutor.telefono}
              onChange={(e) => handleTutorChange(index, e)}
              className={err.telefono ? "input-error" : ""}
              disabled={index === 0}
            />
            {err.telefono && <div className="errorpaso3">{err.telefono}</div>}
          </div>
        </div>

        <div className="form-group">
          <label>CI:</label>
          <div className="form-control-wrapper">
            <input
              type="text"
              name="ci"
              value={tutor.ci}
              onChange={(e) => handleTutorChange(index, e)}
              className={err.ci ? "input-error" : ""}
              disabled={index === 0}
            />
            {err.ci && <div className="errorpaso3">{err.ci}</div>}
          </div>
        </div>

        <div className="form-group">
          <label>Relación con el competidor:</label>
          <div className="form-control-wrapper">
            <div className="radio-group">
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
            {err.relacion && <div className="errorpaso3">{err.relacion}</div>}
          </div>
        </div>
      </div>
    )
  }

  const renderExito = () => (
    <div className="exito-container">
      <CheckCircle size={80} color="#3b82f6" strokeWidth={2} />
      <h2>¡Competidor inscrito con éxito!</h2>

      {isUploading ? (
        <div className="upload-progress">
          <Loader className="animate-spin" size={24} />
          <p>Subiendo PDF a Cloudinary: {uploadProgress}%</p>
        </div>
      ) : (
        <>
          <button className="descargar-button" onClick={generarBoletaPDF} disabled={isUploading}>
            {pdfUploaded ? "Descargar Recibo" : "Generar y Descargar Recibo"}
          </button>
          <button className="descargar-button" onClick={handleNuevaInscripcion} disabled={isUploading}>
            Nueva inscripción
          </button>
        </>
      )}

      {pdfUploaded && (
        <div className="pdf-uploaded-info">
          <p>PDF subido correctamente a Cloudinary</p>
        </div>
      )}
    </div>
  )

  return (
    <div className="tercer-paso-container">
      {exito ? (
        renderExito()
      ) : (
        <>
          <h2>Datos de Tutor (es)</h2>
          <div className="form-group">
            <label>Cantidad de tutores:</label>
            <select
              className="short-select"
              value={cantidadTutores}
              onChange={(e) => setCantidadTutores(Number(e.target.value))}
            >
              <option value={1}>1</option>
              <option value={2}>2</option>
            </select>
          </div>

          {renderTutorCard(0)}
          {cantidadTutores === 2 && renderTutorCard(1)}

          <div className="submit-button-container">
            <button className="submit-button cancel" onClick={onBack}>
              Volver
            </button>
            <button className="submit-button" onClick={handleSubmit}>
              Guardar
            </button>
          </div>
        </>
      )}
    </div>
  )
}

TercerPaso.propTypes = {
  competidorId: PropTypes.number.isRequired,
  onBack: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
}

export default TercerPaso