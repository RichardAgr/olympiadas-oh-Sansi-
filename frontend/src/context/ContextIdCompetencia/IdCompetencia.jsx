import { createContext, useContext, useState, useEffect } from "react"
import axios from "axios"

// Crear el contexto
const CompetenciaContext = createContext()

export const useCompetencia = () => {
  const context = useContext(CompetenciaContext)
  if (!context) {
    throw new Error("useCompetencia debe ser usado dentro de CompetenciaProvider")
  }
  return context
}

export const CompetenciaProvider = ({ children, id_respGest }) => {
  const [competenciaId, setCompetenciaId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [responsableData, setResponsableData] = useState(null)

  const fetchCompetenciaId = async () => {
    if (!id_respGest) {
      setError("ID del responsable no proporcionado")
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const response = await axios.get(`http://localhost:8000/api/datosResponsableId/${id_respGest}`)

      if (response.data && response.data.data) {
        setCompetenciaId(response.data.data.competencia_id)
        setResponsableData(response.data.data)
        setError(null)
      } else {
        setError("No se pudo obtener la información del responsable")
      }
    } catch (error) {
      console.error("Error al obtener competencia_id:", error)
      setError("Error al cargar la información del responsable")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCompetenciaId()
  }, [id_respGest])

  const value = {
    competenciaId,
    loading,
    error,
    responsableData,
    refetch: () => {
      if (id_respGest) {
        fetchCompetenciaId()
      }
    },
  }

  return <CompetenciaContext.Provider value={value}>{children}</CompetenciaContext.Provider>
}
