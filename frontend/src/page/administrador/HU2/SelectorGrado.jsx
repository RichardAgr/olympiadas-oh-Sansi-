import { useEffect, useState } from "react"
import axios from "axios"
import "./SelectorGrado.css"
import api from '../../../components/Tokens/api';

function SelectorGrado({
  onSeleccionarGrados,
  gradoInicial: gradoInicialProp,
  gradoFinal: gradoFinalProp,
  gradoInicialCompleto,
  gradoFinalCompleto,
}) {
  const [grados, setGrados] = useState([])
  const [gradoInicial, setGradoInicial] = useState("")
  const [gradoFinal, setGradoFinal] = useState("")

  // Cargar grados desde la API
  useEffect(() => {
    api
      .get("http://localhost:8000/api/grados")
      .then((res) => {
/*         console.log("Datos de grados recibidos:", res.data) */
        setGrados(res.data)
      })
      .catch((err) => {
        console.error("Error en GET /grados:", err.response?.data || err.message)
      })
  }, [])

  // Inicializar valores cuando se reciben props (modo edición)
  useEffect(() => {
    if (gradoInicialProp) {
      setGradoInicial(gradoInicialProp.toString())
/*       console.log("Grado inicial establecido desde props:", gradoInicialProp) */
    }
    if (gradoFinalProp) {
      setGradoFinal(gradoFinalProp.toString())
/*       console.log("Grado final establecido desde props:", gradoFinalProp) */
    }
  }, [gradoInicialProp, gradoFinalProp])

  // Función para encontrar el objeto completo de un grado por su ID
  const encontrarGradoPorId = (gradoId) => {
    return grados.find((g) => g.grado_id === Number.parseInt(gradoId))
  }

  // Enviar datos al padre cuando cambien los grados seleccionados
  useEffect(() => {
    if (gradoInicial && gradoFinal && grados.length > 0) {
      const gradoInicialObj = encontrarGradoPorId(gradoInicial)
      const gradoFinalObj = encontrarGradoPorId(gradoFinal)

/*       console.log("Enviando grados seleccionados:", {
        grado_id_inicial: Number.parseInt(gradoInicial),
        grado_id_final: Number.parseInt(gradoFinal),
        grado_inicial_obj: gradoInicialObj,
        grado_final_obj: gradoFinalObj,
      }) */

      onSeleccionarGrados({
        grado_id_inicial: Number.parseInt(gradoInicial),
        grado_id_final: Number.parseInt(gradoFinal),
        grado_inicial_obj: gradoInicialObj,
        grado_final_obj: gradoFinalObj,
      })
    }
  }, [gradoInicial, gradoFinal, grados])

  const handleGradoInicialChange = (e) => {
    const nuevoGradoInicial = e.target.value
    setGradoInicial(nuevoGradoInicial)

    // Si el grado final es menor que el inicial, resetear el grado final
    if (gradoFinal && nuevoGradoInicial && Number.parseInt(gradoFinal) < Number.parseInt(nuevoGradoInicial)) {
      setGradoFinal("")
    }
  }

  const handleGradoFinalChange = (e) => {
    const nuevoGradoFinal = e.target.value

    // Validar que el grado final no sea menor que el inicial
    if (gradoInicial && nuevoGradoFinal && Number.parseInt(nuevoGradoFinal) < Number.parseInt(gradoInicial)) {
      alert("El grado final no puede ser menor que el grado inicial")
      return
    }

    setGradoFinal(nuevoGradoFinal)
  }

  // Filtrar grados para el selector final (solo mostrar grados >= al inicial)
  const gradosParaFinal = gradoInicial ? grados.filter((g) => g.grado_id >= Number.parseInt(gradoInicial)) : grados

  return (
    <div className="selector-grado">
      <div className="campo-grado">
        <label>Grado Inicial</label>
        <select value={gradoInicial} onChange={handleGradoInicialChange} required className="select-grado">
          <option value="">Seleccionar grado inicial</option>
          {grados.map((g) => (
            <option key={g.grado_id} value={g.grado_id}>
              {g.nombre}
            </option>
          ))}
        </select>
        
      </div>

      <div className="campo-grado">
        <label>Grado Final</label>
        <select
          value={gradoFinal}
          onChange={handleGradoFinalChange}
          required
          className="select-grado"
          disabled={!gradoInicial}
        >
          <option value="">Seleccionar grado final</option>
          {gradosParaFinal.map((g) => (
            <option key={g.grado_id} value={g.grado_id}>
              {g.nombre}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

export default SelectorGrado
