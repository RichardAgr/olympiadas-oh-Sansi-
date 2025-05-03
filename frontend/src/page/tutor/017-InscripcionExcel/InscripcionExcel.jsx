
import { useState } from "react"
import { generateExcelTemplate } from "../../../components/plantillaExcel/excel"
import "./inscripcionExcel.css"


const InscripcionMasiva = () => {
  const [isLoading, setIsLoading] = useState(false)
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
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="7 10 12 15 17 10"></polyline>
                      <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                    Descargar plantilla
                  </>
                )}
              </button>
            </div>

            {/* <FileUploader onFileUpload={handleFileUpload} isLoading={isLoading} /> */}

            {error && <div className="errorMessage">{error}</div>}

            <div className="instructionsContainer">
              <h3>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="16" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
                Instrucciones
              </h3>
              <ol>
                <li>Descarga la plantilla Excel utilizando el botón superior.</li>
                <li>Completa los datos del tutor en la segunda hoja.</li>
                <li>Ingresa los datos de los estudiantes en la tercera hoja.</li>
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
                    <p className="numeroValue">{boletaGenerada?.numero || "B-2025-0123"}</p>
                  </div>
                </div>

                <h2 className="boletaTitle">BOLETA DE PAGO</h2>

                <div className="boletaInfoSection">
                  <div className="infoRow">
                    <div className="infoLabel">Periodo:</div>
                    <div className="infoValue">1-2025</div>
                  </div>
                  <div className="infoRow">
                    <div className="infoLabel">Nombre:</div>
                    <div className="infoValue">{boletaGenerada?.tutor || "JOFRE TICONA PLATA"}</div>
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
                      <th>Categoría</th>
                      <th>Monto</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(
                      boletaGenerada?.competidores || [
                        { nombre: "FRESIA GRETY TICONA PLATA", area: "QUÍMICA", nivel: "6S", monto: 15 },
                        { nombre: "FRESIA GRETY TICONA PLATA", area: "MATEMÁTICAS", nivel: "Sexto Nivel", monto: 15 },
                        { nombre: "JUAN CARLOS PÉREZ GÓMEZ", area: "BIOLOGÍA", nivel: "2S", monto: 15 },
                      ]
                    ).map((competidor, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{competidor.nombre || "Sin nombre"}</td>
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
              <button className="primaryButton" onClick={handleDescargarBoleta} disabled={isLoading}>
                {isLoading ? "Descargando..." : "Descargar Boleta PDF"}
              </button>
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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="64"
                  height="64"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <h3>¡Inscripción completada con éxito!</h3>
              <p>
                La inscripción masiva ha sido procesada correctamente. Se ha generado la boleta de pago para los
                competidores inscritos.
              </p>
              <p>
                <strong>Número de Boleta:</strong> {boletaGenerada?.numero || "B-2025-0123"}
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
              <button className="primaryButton" onClick={handleDescargarBoleta} disabled={isLoading}>
                {isLoading ? "Descargando..." : "Descargar Boleta PDF"}
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
      <h1>Olimpiadas Oh! SanSi</h1>
      <h2>Sistema de Inscripción Masiva</h2>

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
