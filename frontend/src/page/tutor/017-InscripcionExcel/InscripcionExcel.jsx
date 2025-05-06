import saveAs from "file-saver"
import { useState } from "react"
import {Download,Info} from "lucide-react"
import { generateExcelTemplate,procesarArchivoExcel } from "../../../components/plantillaExcel/Excel"
import { validarDatosExcel } from "../../../components/plantillaExcel/ValidadorExcel"
import ExcelPreview from "../../../components/excelPreview/ExcelPreview"
import FileUpLoader from "../../../components/FileUpLoader/FileUpLoader"
import "./inscripcionExcel.css"

//simulamos la carga del excel poner datos simulados aca


const InscripcionMasiva = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [file,setFile]=useState(null)
  const [error, setError] = useState(null)
  const [excelData, setExcelData] = useState(null)
  const [step, setStep] = useState(1)
  const [validationResults,setValidationResults] = useState(null)


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
                /* onClick={handleGenerarBoleta} */
                disabled={isLoading || (validationResults && !validationResults.esValido)}
              >
                {isLoading ? "Generando..." : "Generar Boleta de Pago"}
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
{/*       {showBoletaViewer && boletaGenerada && (
        <BoletaViewer
          boleta={{
            numero: boletaGenerada.numero || "B-2025-0123",
            tutor: boletaGenerada.tutor || "JOFRE TICONA PLATA",
            fecha_emision: boletaGenerada.fechaEmision || new Date().toLocaleDateString(),
            monto_total: boletaGenerada.montoTotal || 0,
            estado: "Pendiente",
            competidores: Array.isArray(boletaGenerada.competidores)
              ? boletaGenerada.competidores.map((comp) => ({
                  nombre: comp.nombre || "Sin nombre",
                  nivel: comp.nivel || "Sin categoría",
                  monto: comp.monto || 0,
                }))
              : [],
          }}
          onClose={handleCloseBoletaViewer}
          onDescargar={handleDescargarBoleta}
        />
      )} */}
    </div>
  )
}

export default InscripcionMasiva
