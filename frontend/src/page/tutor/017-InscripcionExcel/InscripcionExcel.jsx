import saveAs from "file-saver"
import { useState } from "react"
import {Download,Info,} from "lucide-react"
import { generateExcelTemplate,procesarArchivoExcel } from "../../../components/plantillaExcel/Excel"
import { validarDatosExcel } from "../../../components/plantillaExcel/ValidadorExcel"
import { generarBoleta } from "../../../components/generarBoleta/GenerarBoleta"
import { generarBoletaPDF } from "../../../components/generarBoleta/GenerarBoletaPDF"
import ExcelPreview from "../../../components/excelPreview/ExcelPreview"
import FileUpLoader from "../../../components/FileUpLoader/FileUpLoader"
import BoletaView from "../../../components/BoletaView/BoletaView"
import "./inscripcionExcel.css"

//simulamos la carga del excel poner datos simulados aca


const InscripcionMasiva = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [file,setFile]=useState(null)
  const [error, setError] = useState(null)
  const [excelData, setExcelData] = useState(null)
  const [step, setStep] = useState(1)
  const [validationResults,setValidationResults] = useState(null)
  const [boletaGenerada, setBoletaGenerada] = useState(null)
  const [showBoletaViewer, setShowBoletaViewer] = useState(false)


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


  const handleFileUpload = async (uploadedFile) => {
    setFile(uploadedFile)
    setError(null)
    setIsLoading(true)

    try {
      console.log("Iniciando carga de archivo:",uploadedFile.name)
      //procesar excel
      const data = await procesarArchivoExcel(uploadedFile)

      console.log("Datos procesados:", {
        competidores: data.competidores?.length || 0,
        tutores: data.tutores?.length || 0,
        relaciones: data.relaciones?.length || 0,
      })

      if (!data.competidores || !data.tutores || !data.relaciones) {
        throw new Error("Los datos procesados no tienen la estructura esperada")
      }
      setExcelData(data)

      //validar los datos del excel
      const resultados = validarDatosExcel(data)
      console.log("Resultados de validación:", resultados)
      setValidationResults(resultados)
      setStep(2)
    } catch (error) {
      console.log("Error en el handleFileUpload: ",error)
      setError("Error al procesar el archivo Excel: " + (err.message || "Asegúrate de que el formato sea correcto."))
    }finally{
      setIsLoading(false)
    }
  }

  const handleGenerarBoleta=()=>{
    setIsLoading(true)
    setError(null)

    try {
      console.log("Datos para generar boleta:", excelData)

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
      console.log("Esta es la boleta",boleta)
      setBoletaGenerada(boleta)
      setStep(3)
    } catch (err) {
      console.error("Error al generar boleta:", err)
      setError("Error al generar la boleta de pago: " + (err.message || "Error desconocido"))
    } finally {
      setIsLoading(false)
    }
  }

  const handleDescargarBoleta = async () => {
    try {
      setIsLoading(true)
      setError(null)

      if (!boletaGenerada) {
        throw new Error("No hay boleta generada para descargar")
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
              area:comp.area || "Sin área",
              nivel: comp.nivel || "Sin categoría",
              monto: comp.monto || 0,
            }))
          : [],
      }
      const blob = await generarBoletaPDF(boletaData)

      // Descargar usando file-saver
      saveAs(blob, `Boleta_${boletaData.numero}.pdf`)
    } catch (error) {
      console.error("Error al descargar la boleta:", error)
      setError("Error al descargar la boleta: " + error.message)
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

  const handleContinuar = () => {
    setStep(4)
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
                    <Download/>
                    Descargar plantilla
                  </>
                )}
              </button>
            </div>

            <FileUpLoader onFileUpload={handleFileUpload} isLoading={isLoading} />

            {error && <div className="errorMessage">{error}</div>}

            <div className="instructionsContainer">
              <h3>
                <Info/>
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
                  {validationResults.errores.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
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
                {isLoading ? "Generando..." : "Generar Boleta de Pago"}
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
              <h3>¡Boleta generada exitosamente!</h3>
              <p>Se ha generado la boleta de pago para los competidores inscritos.</p>
            </div>

            <div className="boletaPreviewContainer">
              <h3>Vista previa de la boleta</h3>
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

                <h2 className="boletaTitle">BOLETA DE PAGO</h2>

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
                    {(boletaGenerada?.competidores).map((competidor, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{competidor.nombre || "Sin nombre"}</td>
                        <td>{competidor.area || "Sin área"}</td>
                        <td>{competidor.nivel || "Sin categoría"}</td>
                        <td>{competidor.monto || 0}</td>
                      </tr>
                    ))}
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
                Ver Boleta Completa
              </button>
              {/* <button className="primaryButton"  onClick={handleDescargarBoleta} disabled={isLoading}>
                {isLoading ? "Descargando..." : "Descargar Boleta PDF"}
              </button> */}
              <button className="successButton" onClick={handleContinuar}>
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
              <div className="confirmationIcon">
              {/* poner icono */}
              </div>
              <h3>¡Inscripción completada con éxito!</h3>
              <p>
                La inscripción masiva ha sido procesada correctamente. Se ha generado la boleta de pago para los
                competidores inscritos.
              </p>
              <p>
                <strong>Número de Boleta:</strong> {boletaGenerada?.numero}
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
              <button className="secondaryButton" onClick={() => setStep(3)}>
                Volver
              </button>
              <button className="successButton" onClick={() => setStep(1)}>
                Nueva Inscripción
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
            tutor: boletaGenerada.tutor || "JOFRE TICONA PLATA",
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
