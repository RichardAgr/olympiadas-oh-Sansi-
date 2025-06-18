import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import Swal from "sweetalert2"
import "./InscribirManual.css"

const SegundoPaso = ({ onNext, onBack, formData, setIsLoading }) => {
  const [areas, setAreas] = useState([])
  const [categorias, setCategorias] = useState([])
  const [grados, setGrados] = useState([])
  const [areasRegistradas, setAreasRegistradas] = useState([]) 
  const [selectedAreaId, setSelectedAreaId] = useState(null)
  const [selectedCategoria, setSelectedCategoria] = useState(null)
  const [selectedRango, setSelectedRango] = useState("")
  const { id } = useParams()
  const gradoId = Number(formData.grado_id)
  const user = JSON.parse(localStorage.getItem("user"))
  const competenciaId = user?.competencia_id
  
  useEffect(() => {
    setSelectedCategoria(null)
    setSelectedRango("")
  }, [selectedAreaId])

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setIsLoading(true)

        // Cargar datos de competencia
        const response = await axios.get("http://localhost:8000/api/tutor/competidor/datos-competencia", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        })
        setAreas(response.data.areas)
        setCategorias(response.data.categorias)
        setGrados(response.data.grados)

        // Verificar si el competidor ya está registrado y obtener sus áreas
        await verificarCompetidorExistente()
      } catch (error) {
        console.error("Error al cargar datos desde el backend", error)
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudieron cargar los datos de competencia",
        })
      } finally {
        setIsLoading(false)
      }
    }

    cargarDatos()
  }, [setIsLoading, formData.ci, competenciaId])

//si el competidor ya existe y obtener sus áreas registradas
  const verificarCompetidorExistente = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/competidor/areas-registradas/${formData.ci}/${competenciaId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        },
      )

      if (response.data.success) {
        setAreasRegistradas(response.data.areas_registradas || [])

        if (response.data.areas_registradas && response.data.areas_registradas.length > 0) {
          const areasNombres = response.data.areas_registradas.map((area) => area.nombre).join(", ")
          Swal.fire({
            icon: "info",
            title: "Competidor ya registrado",
            text: `Este competidor ya está registrado en: ${areasNombres}. Puede registrarse en otras áreas disponibles.`,
            timer: 4000,
            showConfirmButton: true,
          })
        }
      }
    } catch (error) {
      // Si el competidor no existe, no hay problema, continúa normalmente
      if (error.response?.status !== 404) {
        console.error("Error al verificar competidor existente:", error)
      }
      setAreasRegistradas([])
    }
  }

  const generarRango = (gradoInicial, gradoFinal) => {
    const inicio = grados.find((g) => g.id === gradoInicial)?.nombre
    const fin = grados.find((g) => g.id === gradoFinal)?.nombre
    return `${inicio} a ${fin}`
  }

  const handleNext = async () => {
    if (!selectedAreaId || !selectedCategoria || !selectedRango) {
      Swal.fire({
        icon: "warning",
        title: "Campos incompletos",
        text: "Por favor, selecciona área, categoría y verifica el rango.",
      })
      return
    }

    // Verificar si el área ya está registrada
    const areaYaRegistrada = areasRegistradas.some((area) => area.id === selectedAreaId)

    if (areaYaRegistrada) {
      const areaNombre = areas.find((a) => a.id === selectedAreaId)?.nombre
      Swal.fire({
        icon: "error",
        title: "Área ya registrada",
        text: `Este competidor ya está registrado en el área: ${areaNombre}. Por favor, selecciona una área diferente.`,
      })
      return
    }

    // Solo preparar los datos, NO registrar el competidor aún
    const areaNombre = areas.find((a) => a.id === selectedAreaId)?.nombre
    const gradoSeleccionado = grados.find((g) => g.id === gradoId)
    const cursoCompleto = gradoSeleccionado?.nombre || ""

    const datosCompetencia = {
      area: areaNombre,
      area_id: selectedAreaId,
      categoria: selectedCategoria.nombre,
      nivel_categoria_id: selectedCategoria.nivel_categoria_id,
      rango: selectedRango,
      curso_completo: cursoCompleto,
    }

    Swal.fire({
      icon: "success",
      title: "¡Datos de competencia guardados!",
      text: "Ahora procede a registrar los datos de los tutores",
      timer: 1500,
      showConfirmButton: false,
    })

    // Pasar los datos sin competidor_id (será null)
    onNext(datosCompetencia, null)
  }

  // Función para verificar si un área está disponible
  const isAreaDisponible = (areaId) => {
    return !areasRegistradas.some((area) => area.id === areaId)
  }

  return (
    <div className="inscribir-manual-form-InscMan">
      <h2 style={{ marginBottom: "20px", fontSize: "24px", fontWeight: "600" }}>Datos de competencia</h2>


      {areasRegistradas.length > 0 && (
        <div
          style={{
            backgroundColor: "#fff3cd",
            border: "1px solid #ffeaa7",
            borderRadius: "8px",
            padding: "15px",
            marginBottom: "20px",
            color: "#856404",
          }}
        >
          <h4 style={{ margin: "0 0 10px 0", fontSize: "16px" }}>Áreas ya registradas:</h4>
          <ul style={{ margin: "0", paddingLeft: "20px" }}>
            {areasRegistradas.map((area) => (
              <li key={area.id}>{area.nombre}</li>
            ))}
          </ul>
          <p style={{ margin: "10px 0 0 0", fontSize: "14px", fontStyle: "italic" }}>
            Selecciona una área diferente para continuar con la inscripción.
          </p>
        </div>
      )}

      <div className="form-group-InscMan">
        <label>Área:</label>
        <div className="grid-options-InscMan">
          {areas.map((area) => {
            const isDisponible = isAreaDisponible(area.id)
            return (
              <button
                key={area.id}
                className={`option-button-InscMan ${selectedAreaId === area.id ? "selected" : ""} ${!isDisponible ? "disabled" : ""}`}
                onClick={() => {
                  if (isDisponible) {
                    setSelectedAreaId(area.id)
                    setSelectedCategoria(null)
                    setSelectedRango("")
                  }
                }}
                disabled={!isDisponible}
                title={!isDisponible ? "Esta área ya está registrada para este competidor" : ""}
                type="button"
                style={{
                  opacity: !isDisponible ? 0.5 : 1,
                  cursor: !isDisponible ? "not-allowed" : "pointer",
                }}
              >
                {area.nombre}
                {!isDisponible && (
                  <span
                    style={{
                      display: "block",
                      fontSize: "12px",
                      color: "#dc3545",
                      marginTop: "5px",
                    }}
                  >
                    Ya registrada
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      <div className="form-group-InscMan">
        <label>Categoría:</label>
        <div className="grid-options-InscMan">
          {categorias
            .filter((categoria) => categoria.area_id === selectedAreaId)
            .map((categoria) => {
              const dentroDelRango = gradoId >= categoria.grado_id_inicial && gradoId <= categoria.grado_id_final
              return (
                <button
                  key={categoria.nivel_categoria_id}
                  className={`option-button-InscMan ${
                    selectedCategoria?.nivel_categoria_id === categoria.nivel_categoria_id ? "selected" : ""
                  }`}
                  onClick={() => {
                    if (dentroDelRango) {
                      setSelectedCategoria(categoria)
                      const rango = generarRango(categoria.grado_id_inicial, categoria.grado_id_final)
                      setSelectedRango(rango)
                    }
                  }}
                  disabled={!dentroDelRango}
                  title={!dentroDelRango ? "Tu grado no corresponde a esta categoría" : ""}
                  type="button"
                >
                  {categoria.nombre}
                </button>
              )
            })}
        </div>
      </div>

      <div className="form-group-InscMan">
        <label>Rango:</label>
        <div className="grid-options-InscMan">
          {categorias
            .filter((categoria) => categoria.area_id === selectedAreaId)
            .map((categoria) => {
              const esSeleccionado = selectedCategoria?.nivel_categoria_id === categoria.nivel_categoria_id
              const rangoTexto = generarRango(categoria.grado_id_inicial, categoria.grado_id_final)
            
              return (
                <button
                  key={`rango-${categoria.nivel_categoria_id}`}
                  className={`option-button-InscMan ${esSeleccionado ? 'selected' : ''}`}
                  style={{
                    backgroundColor: esSeleccionado ? '#1e40af' : '',
                    color: esSeleccionado ? 'white' : '',
                    cursor: 'default'
                  }}
                  disabled
                  type="button"
                >
                  {rangoTexto}
                </button>
              )
            })}
        </div>
      </div>

      <div className="submit-button-container-InscMan">
        <button className="submit-button-InscMan cancel" onClick={onBack} type="button">
          Volver
        </button>
        <button className="submit-button-InscMan" onClick={handleNext} type="button">
          Siguiente
        </button>
      </div>
    </div>
  )
}

export default SegundoPaso