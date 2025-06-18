import saveAs from "file-saver"
import { useState } from "react"
import { Download, Info, UploadCloud, Loader2 } from "lucide-react"
import { generateExcelTemplate, procesarArchivoExcel } from "../../../components/plantillaExcel/Excel"
import { validarDatosExcel } from "../../../components/plantillaExcel/ValidadorExcel"
import { generarBoleta } from "../../../components/generarBoleta/GenerarBoleta"
import { generarBoletaPDF } from "../../../components/generarBoleta/GenerarBoletaPDF"
import ExcelPreview from "../../../components/excelPreview/ExcelPreview"
import FileUpLoader from "../../../components/FileUpLoader/FileUpLoader"
import BoletaView from "../../../components/BoletaView/BoletaView"
import { useParams } from "react-router-dom"
import Swal from "sweetalert2"
import "./inscripcionExcel.css"
import axios from "axios"


//simulamos la carga del excel poner datos simulados aca

const uploadToCloudinary = async (file, onProgress = () => {}) => {
    const axiosSinAuth = axios.create();
  try {
    const uploadPreset = "veltrixImg" // Tu upload preset
    const cloudName = "dq5zw44wg" // Tu cloud name

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

const InscripcionMasiva = () => {
  const { id } = useParams()
  const [isLoading, setIsLoading] = useState(false)
  const [file, setFile] = useState(null)
  const [error, setError] = useState(null)
  const [excelData, setExcelData] = useState(null)
  const [step, setStep] = useState(1)
  const [validationResults, setValidationResults] = useState(null)
  const [boletaGenerada, setBoletaGenerada] = useState(null)
  const [showBoletaViewer, setShowBoletaViewer] = useState(false)
/*   const [pdfUploaded, setPdfUploaded] = useState(false)
const [isUploading, setIsUploading] = useState(false) */
  const [uploadProgress, setUploadProgress] = useState(0)
  const [boletaUploaded, setBoletaUploaded] = useState(false)
  const [boletaUrl, setBoletaUrl] = useState(null)
  const user = JSON.parse(localStorage.getItem('user'));
  const competenciaId = user?.competencia_id;
  const idTutor = user?.tutor_id;



  const handleDescargarPlantilla = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const blob = await generateExcelTemplate()

      saveAs(blob, "Plantilla_Inscripcion_Excel.xlsx")
    } catch (error) {
      console.error("Error al descargar la plantilla:", error)
      setError("Error al descargar la plantilla: " + error.message)
    } finally {
      setIsLoading(false)
    }
  }
  const guardarRecibo = async (reciboData) => {
    try {
      const response = await axios.post("http://localhost:8000/api/guardarDatos/recibos", reciboData)
      /*  console.log('Recibo guardado en API:', response.data); */
      return response.data
    } catch (error) {
      console.error("Error al guardar el recibo en la API:", error)
      throw error
    }
  }

  const handleFileUpload = async (uploadedFile) => {
    setFile(uploadedFile)
    setError(null)
    setIsLoading(true)

    try {
      //procesar excel
      const data = await procesarArchivoExcel(uploadedFile)

      /*       console.log("Datos procesados:", {
        competidores: data.competidores?.length || 0,
        tutores: data.tutores?.length || 0,
        relaciones: data.relaciones?.length || 0,
      }) */

      if (!data.competidores || !data.tutores || !data.relaciones) {
        throw new Error("Los datos procesados no tienen la estructura esperada")
      }
      setExcelData(data)

      //validar los datos del excel
      const resultados = await validarDatosExcel(data)
      // Ensure resultados has the expected structure
      if (!resultados || typeof resultados !== "object") {
        throw new Error("Error en la validación: formato de resultados incorrecto")
      }
      if (!Array.isArray(resultados.errores)) {
        resultados.errores = resultados.errores ? [resultados.errores] : []
      }
      setValidationResults(resultados)
      setStep(2)
    } catch (error) {
      console.log("Error en el handleFileUpload: ", error)
      setError("Error al procesar el archivo Excel: " + (error.message || "Asegúrate de que el formato sea correcto."))
    } finally {
      setIsLoading(false)
    }
  }

  const handleGenerarBoleta = () => {
    setIsLoading(true)
    setError(null)

    try {
      if (!excelData || !excelData.competidores || !excelData.tutores || !excelData.relaciones) {
        throw new Error(
          "Datos incompletos. Asegúrate de que el archivo Excel tenga todas las hojas necesarias con datos.",
        )
      }

      // Verificar que haya al menos un competidor, un tutor y un relacion tutor-competidor
      if (excelData.competidores.length === 0) {
        throw new Error("No hay competidores en los datos cargados.")
      }

      if (excelData.tutores.length === 0) {
        throw new Error("No hay tutores en los datos cargados.")
      }

      if (excelData.relaciones.length === 0) {
        throw new Error("No hay relaciones entre competidores y tutores en los datos cargados.")
      }

      // Verificar que al menos una relación tenga responsable de Pago ( = "Sí")
      const tieneResponsablePago = excelData.relaciones.some((r) => r["Responsable de Pago"] === "Sí")
      if (!tieneResponsablePago) {
        throw new Error(
          "No se encontró ningún tutor marcado como responsable de pago. Asegúrate de marcar al menos un tutor como 'Responsable de Pago' con el valor 'Sí'.",
        )
      }

      // Usar los datos del Excel
      const boleta = generarBoleta(excelData)
      setBoletaGenerada(boleta)
      setStep(3)
    } catch (err) {
      console.error("Error al generar el recibo:", err)
      setError("Error al generar el recibo de pago: " + (err.message || "Error desconocido"))
    } finally {
      setIsLoading(false)
    }
  }

  // Modificar el handleDescargarBoleta para subir a Cloudinary cuando se descarga
  const handleDescargarBoleta = async () => {
    try {
      setIsLoading(true)
      setError(null)

      if (!boletaGenerada) {
        throw new Error("No hay recibo generado para descargar")
      }

      // Asegurarse de que todos los campos necesarios existan
      const boletaData = {
        numero: boletaGenerada.numero || "7000569",
        tutor: boletaGenerada.tutor || "TUTOR NO ESPECIFICADO",
        fechaEmision: boletaGenerada.fechaEmision || new Date().toLocaleDateString(),
        montoTotal: typeof boletaGenerada.montoTotal !== "Sin costo" ? boletaGenerada.montoTotal : 0,
        competidores: Array.isArray(boletaGenerada.competidores)
          ? boletaGenerada.competidores.map((comp) => ({
              nombre: comp.nombre || "Sin nombre",
              area: comp.area || "Sin área",
              nivel: comp.nivel || "Sin categoría",
              monto: comp.monto || 0,
            }))
          : [],
      }

      const blob = await generarBoletaPDF(boletaData)

      // Solo descargar el PDF
      saveAs(blob, `Recibo_${boletaData.numero}.pdf`)
    } catch (error) {
      console.error("Error al descargar el recibo:", error)
      setError("Error al descargar el recibo: " + error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerBoleta = () => {
    setShowBoletaViewer(true)
  }

  const handleCloseBoletaViewer = () => {
    setShowBoletaViewer(false)
  }


const subirBoletaPDF = async () => {
  try {
    if (!boletaGenerada) {
      throw new Error("No hay boleta generada para subir")
    }

    const boletaData = {
      numero: boletaGenerada.numero || "7000569",
      tutor: boletaGenerada.tutor || "TUTOR NO ESPECIFICADO",
      fechaEmision: boletaGenerada.fechaEmision || new Date().toLocaleDateString(),
      montoTotal: typeof boletaGenerada.montoTotal !== "Sin costo" ? boletaGenerada.montoTotal : 0,
      competidores: Array.isArray(boletaGenerada.competidores)
        ? boletaGenerada.competidores.map((comp) => ({
            nombre: comp.nombre || "Sin nombre",
            area: comp.area || "Sin área",
            nivel: comp.nivel || "Sin categoría",
            monto: comp.monto || 0,
          }))
        : [],
    }

    // 1. Generar y subir el PDF a Cloudinary
    const blob = await generarBoletaPDF(boletaData)
    const file = new File([blob], `Recibo_${boletaData.numero}.pdf`, { type: "application/pdf" })

    const uploadResult = await uploadToCloudinary(file, (progress) => {
      setUploadProgress(progress)
    })

    // 2. Guardar el recibo en la base de datos con la URL del PDF
    const completeUploadData = {
      tutor_id: id, // Asegúrate de que esta variable esté disponible
      numero_recibo: boletaData.numero,
      monto_total: boletaData.montoTotal,
      fecha_emision: boletaData.fechaEmision,
      ruta_pdf: uploadResult.secure_url,
      estado: "Pendiente",
    }
    
    const respuestaAPI = await guardarRecibo(completeUploadData)

    setBoletaUrl(uploadResult.secure_url)
    setBoletaUploaded(true)
    
    return uploadResult.secure_url // Retorna la URL del PDF subido
  } catch (error) {
    console.error("Error al subir la boleta y guardar el recibo:", error)
    throw error
  }
}

const handleNuevaInscripcion = async () => {
  try {
    setIsLoading(true)
    setError(null)

    if (!file) {
      throw new Error("No hay archivo Excel para enviar")
    }

    if (!boletaGenerada?.numero) {
      throw new Error("No se ha generado número de recibo")
    }

    // 1. PRIMERO: Validar el Excel completamente
    const formDataValidacion = new FormData()
    formDataValidacion.append("numero_recibo", boletaGenerada.numero)
    formDataValidacion.append("archivo_excel", file)
    formDataValidacion.append("competencia_id", competenciaId)
    formDataValidacion.append("tutor_id", idTutor)

    const validationResponse = await axios.post("http://localhost:8000/api/validarExcelPrevio", formDataValidacion, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })

    if (!validationResponse.data.esValido) {
      throw new Error("El archivo Excel tiene errores: " + validationResponse.data.errores.join(", "))
    }

    // 2. SEGUNDO: Subir la boleta PDF y guardar el recibo (solo si el Excel es válido)
    if (!boletaUploaded && boletaGenerada) {
      await subirBoletaPDF()
    }

    // 3. TERCERO: Procesar el Excel definitivamente
    const formDataFinal = new FormData()
    formDataFinal.append("numero_recibo", boletaGenerada.numero)
    formDataFinal.append("archivo_excel", file)
    formDataFinal.append("competencia_id", competenciaId)
    formDataFinal.append("tutor_id", idTutor)

    const response = await axios.post("http://localhost:8000/api/guardarDatos/excel", formDataFinal, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })

    Swal.fire({
      icon: 'success',
      title: `Excel y boleta subidos con éxito`,
      showConfirmButton: false,
      timer: 2000
    });

  } catch (error) {
    console.log(error)
    setError("Error al enviar los datos: " + (error.response?.data?.errores?.join(", ") || 
                        error.response?.data?.message || 
                        error.message ||
                        "Error desconocido al procesar el archivo"))
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Error al validar o subir el excel'
    });
  } finally {
    setIsLoading(false)
    setStep(1)
    setFile(null)
    setExcelData(null)
    setValidationResults(null)
    setBoletaGenerada(null)
    setBoletaUploaded(false)
    setBoletaUrl(null)
  }
}

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="stepContent">
            <div className="stepHeader">
              <h2>Carga de archivo Excel</h2>
              <button className="downloadButton" onClick={handleDescargarPlantilla} disabled={isLoading}>
                {isLoading ? (
                  "Descargando..."
                ) : (
                  <>
                    <Download />
                    Descargar plantilla
                  </>
                )}
              </button>
            </div>

            <FileUpLoader onFileUpload={handleFileUpload} isLoading={isLoading} />

            {error && <div className="errorMessage">{error}</div>}

            <div className="instructionsContainer">
              <h3>
                <Info />
                Instrucciones
              </h3>
              <ol>
                <li>Descarga la plantilla Excel utilizando el botón "Descargar plantilla".</li>
                <li>Completa los datos del tutor en la segunda hoja.</li>
                <li>Ingresa los datos de los estudiantes en la tercera hoja.</li>
                <li>Ingresa los datos de relacion entre el tutor-estudiantes en la cuarta hoja.</li>
                <li>Guarda el archivo y súbelo en esta página.</li>
                <li>Verifica que no haya errores antes de continuar.</li>
              </ol>
            </div>
          </div>
        )
      case 2:
        return (
          <div className="stepContent">
            <h2>Revisión de Datos</h2>

            {validationResults && !validationResults.esValido && (
              <div className="errorContainer">
                <h3>Se encontraron errores en los datos:</h3>
                <ul>
                  {validationResults.errores?.map((error, index) => <li key={index}>{error}</li>) || (
                    <li>Error desconocido</li>
                  )}
                </ul>
              </div>
            )}

            {validationResults && validationResults.esValido && (
              <div className="successContainer">
                <h3>Datos validados correctamente</h3>
                <p>Los datos cumplen con todos los requisitos para la inscripción.</p>
              </div>
            )}

            <ExcelPreview data={excelData} />

            <div className="buttonsContainer">
              <button className="secondaryButton" onClick={() => setStep(1)}>
                Volver
              </button>
              <button
                className="primaryButton"
                onClick={handleGenerarBoleta}
                disabled={isLoading || (validationResults && !validationResults.esValido)}
              >
                {isLoading ? "Generando..." : "Generar Recibo de Pago"}
              </button>
            </div>
          </div>
        )
      case 3:
        return (
          <div className="stepContent">
            <h2>Comprobante de Pago</h2>

            {error && <div className="errorMessage">{error}</div>}

            <div className="successContainer">
              <h3>¡Recibo generada exitosamente!</h3>
              <p>Se ha generado el recibo de pago para los competidores inscritos.</p>
            </div>

            <div className="boletaPreviewContainer">
              <h3>Vista previa de la recibo</h3>
              <div className="boletaDocumentPreview">
                <div className="boletaHeaderSection">
                  <div className="universidadInfo">
                    <p className="universidadNombre">UNIVERSIDAD MAYOR DE SAN SIMÓN</p>
                    <p>DIRECCIÓN ADMINISTRATIVA Y FINANCIERA</p>
                  </div>
                  <div className="boletaNumero">
                    <p>Nro.</p>
                    <p className="numeroValue">{boletaGenerada?.numero || "7000569"}</p>
                  </div>
                </div>

                <h2 className="boletaTitle">RECIBO DE PAGO</h2>

                <div className="boletaInfoSection">
                  <div className="infoRow">
                    <div className="infoLabel">Nombre:</div>
                    <div className="infoValue">{boletaGenerada?.tutor || "Sin tutor"}</div>
                  </div>
                  <div className="infoRow">
                    <div className="infoLabel">Monto Total (Bs):</div>
                    <div className="infoValue">{boletaGenerada?.montoTotal || 0}</div>
                  </div>
                </div>

                <table className="boletaTable">
                  <thead>
                    <tr>
                      <th>Nro</th>
                      <th>Nombre Competidor</th>
                      <th>Area</th>
                      <th>Categoría</th>
                      <th>Monto</th>
                    </tr>
                  </thead>
                  <tbody>
                    {boletaGenerada?.competidores?.map((competidor, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{competidor.nombre || "Sin nombre"}</td>
                        <td>{competidor.area || "Sin área"}</td>
                        <td>{competidor.nivel || "Sin categoría"}</td>
                        <td>{competidor.monto || 0}</td>
                      </tr>
                    )) || (
                      <tr>
                        <td colSpan="5">No hay competidores para mostrar</td>
                      </tr>
                    )}
                  </tbody>
                </table>

                <div className="boletaFooterSection">
                  <p>Fecha de emisión: {boletaGenerada?.fechaEmision || new Date().toLocaleDateString()}</p>
                  <p>Estado: Pendiente</p>
                </div>
              </div>
            </div>

            <div className="buttonsContainer">
              <button className="secondaryButton" onClick={() => setStep(2)}>
                Volver
              </button>
              <button className="secondaryButton" onClick={handleVerBoleta}>
                Ver Recibo Completo
              </button>
              {/* <button className="primaryButton"  onClick={handleDescargarBoleta} disabled={isLoading}>
                {isLoading ? "Descargando..." : "Descargar Boleta PDF"}
              </button> */}
              <button className="successButton" onClick={() => setStep(4)}>
                    Continuar
              </button>
            </div>
          </div>
        )
      case 4:
        return (
          <div className="stepContent">
            <h2>Confirmación</h2>

            {error && <div className="errorMessage">{error}</div>}

            <div className="confirmationContainer">
              <div className="confirmationIcon">{/* poner icono */}</div>
              <h3>¡Inscripción completada con éxito!</h3>
              <p>
                La inscripción masiva ha sido procesada correctamente. Se ha generado la Recibo de pago para los
                competidores inscritos.
              </p>
              <p>
                <strong>Número de Recibo:</strong> {boletaGenerada?.numero}
              </p>
              <p>
                <strong>Total Competidores:</strong>{" "}
                {boletaGenerada?.totalCompetidores || excelData?.competidores.length || 0}
              </p>
              <p>
                <strong>Monto Total:</strong> Bs. {boletaGenerada?.montoTotal || 0}
              </p>
            </div>

            <div className="buttonsContainer">
              {/* <button className="secondaryButton" onClick={() => setStep(3)}>
                Volver
              </button> */}
              <button className="successButton" onClick={handleNuevaInscripcion} disabled={isLoading}>
                   {isLoading ? (
                      <>
                        <Loader2 className="animate-spinX" style={{ marginRight: "8px" }} />
                        Subiendo Excel y Boleta...
                      </>
                    ) : (
                      "Subir Excel y Boleta"
                    )}
                </button>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="inscripcionMasiva">
      <h1>Inscripción Mediante Excel</h1>

      <div className="stepsContainer">
        <div className={`step ${step >= 1 ? "active" : ""} ${step > 1 ? "completed" : ""}`}>
          <div className="stepNumber">1</div>
          <div className="stepLabel">Carga de Excel</div>
        </div>
        <div className="stepConnector"></div>
        <div className={`step ${step >= 2 ? "active" : ""} ${step > 2 ? "completed" : ""}`}>
          <div className="stepNumber">2</div>
          <div className="stepLabel">Revisión de Datos</div>
        </div>
        <div className="stepConnector"></div>
        <div className={`step ${step >= 3 ? "active" : ""} ${step > 3 ? "completed" : ""}`}>
          <div className="stepNumber">3</div>
          <div className="stepLabel">Comprobante de Pago</div>
        </div>
        <div className="stepConnector"></div>
        <div className={`step ${step >= 4 ? "active" : ""}`}>
          <div className="stepNumber">4</div>
          <div className="stepLabel">Confirmación</div>
        </div>
      </div>

      <div className="contentContainer">{renderStepContent()}</div>
      {showBoletaViewer && boletaGenerada && (
        <BoletaView
          boleta={{
            numero: boletaGenerada.numero || "7000569",
            tutor: boletaGenerada.tutor || "Sin nombre",
            fecha_emision: boletaGenerada.fechaEmision || new Date().toLocaleDateString(),
            monto_total: boletaGenerada.montoTotal || 0,
            estado: "Pendiente",
            competidores: Array.isArray(boletaGenerada.competidores)
              ? boletaGenerada.competidores.map((comp) => ({
                  nombre: comp.nombre || "Sin nombre",
                  area: comp.area || "Sin área",
                  nivel: comp.nivel || "Sin categoría",
                  monto: comp.monto || 0,
                }))
              : [],
          }}
          onClose={handleCloseBoletaViewer}
          onDescargar={handleDescargarBoleta}
        />
      )}
    </div>
  )
}

export default InscripcionMasiva
