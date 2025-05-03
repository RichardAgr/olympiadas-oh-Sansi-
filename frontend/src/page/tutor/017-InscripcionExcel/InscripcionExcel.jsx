
import { useState } from "react"
import {Download,Info} from "lucide-react"
import { generateExcelTemplate } from "../../../components/plantillaExcel/excel"
import FileUpLoader from "../../../components/FileUpLoader/FileUpLoader"
import "./inscripcionExcel.css"

//simulamos la carga del excel poner datos simulados aca


const InscripcionMasiva = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [file,setFile]=useState(null)
  const [error, setError] = useState(null)
  const [excelData, setExcelData] = useState(null)
  const [step, setStep] = useState(1)


  const handleDescargarPlantilla = async () => {
    try {
      setIsLoading(true)
      setError(null)
    //se puede poner la funcion blob() para que muestre si se puede descargar o no en el navegador
      const response = await generateExcelTemplate()

      if (!response) {
        throw new Error(`Error al descargar la plantilla: ${response.status}`)
      }

      setIsLoading(false)
    } catch (error) {
      console.error("Error al descargar la plantilla:", error)
      setError("Error al descargar la plantilla: " + error.message)
      setIsLoading(false)
    }
  }
  const handleFileUpload = async (uploadedFile) => {
    console.log(uploadedFile)
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
