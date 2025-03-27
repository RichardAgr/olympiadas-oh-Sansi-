import { useState, useEffect } from "react"
import {
  Typography,
  Paper,
  FormControl,
  Select,
  MenuItem,
  Grid,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material"
import { useNavigate, useParams } from "react-router-dom"
import axiosInstance from "../../../../../../interception/interception"
import { ENDPOINTS } from "../../../../../../api/constans/endpoints"
import "../crearGrado/crearGrado.css"

const EditarGrado = () => {
  const [gradoData, setGradoData] = useState(null)
  const [nivelInicial, setNivelInicial] = useState("")
  const [nivelFinal, setNivelFinal] = useState("")
  const [gradoInicial, setGradoInicial] = useState("")
  const [gradoFinal, setGradoFinal] = useState("")

  const navigate = useNavigate()
  const { id } = useParams()

  // Notificaciones
  const [loading, setLoading] = useState(false)
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  })

  const nivelesEducativos = [
    { id: 1, nombre: "Primaria" },
    { id: 2, nombre: "Secundaria" },
  ]

  const grados = [
    { id: 1, nombre: "1ro" },
    { id: 2, nombre: "2do" },
    { id: 3, nombre: "3ro" },
    { id: 4, nombre: "4to" },
    { id: 5, nombre: "5to" },
    { id: 6, nombre: "6to" },
  ]

  useEffect(() => {
    if (id) {
      fetchGradoData(id)
    }
  }, [id])

  const fetchGradoData = async (id) => {
    try {
      setLoading(true)
      const response = await axiosInstance.get(ENDPOINTS.categoriaDatos(id))
      setGradoData(response.data)
      console.log("Datos recibidos:", response.data)

      if (response.data) {
        if (response.data.rango_grados === "-------") {
          setNivelInicial("")
          setNivelFinal("")
          setGradoInicial("")
          setGradoFinal("")
        } else {
          if (response.data.grado_inicial_nombre) {
            const nivelInicialValue = obtenerNivel(response.data.grado_inicial_nombre)
            const gradoInicialValue = obtenerNumeroGrado(response.data.grado_inicial_nombre)

            setNivelInicial(nivelInicialValue)
            setGradoInicial(gradoInicialValue)
          }

          if (response.data.grado_final_nombre) {
            const nivelFinalValue = obtenerNivel(response.data.grado_final_nombre)
            const gradoFinalValue = obtenerNumeroGrado(response.data.grado_final_nombre)

            setNivelFinal(nivelFinalValue)
            setGradoFinal(gradoFinalValue)
          }
        }
      }
    } catch (error) {
      console.error("Error al cargar datos del grado:", error)
      setNotification({
        open: true,
        message: "Error al cargar los datos del grado",
        severity: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  const obtenerNivel = (texto) => {
    if (!texto) return ""

    if (texto.includes("Secundaria")) {
      return "Secundaria"
    } else {
      return "Primaria"
    }
  }

  const obtenerNumeroGrado = (texto) => {
    if (!texto) return ""

    // Extraer el número de grado (1ro, 2do, etc.)
    const match = texto.match(/(\d+ro|\d+do|\d+to)/)
    if (match && match[1]) {
      // Buscar el ID correspondiente al grado
      const gradoEncontrado = grados.find((g) => g.nombre === match[1])
      return gradoEncontrado ? gradoEncontrado.id : ""
    }

    return ""
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)
      let rangoGrados = ""

      // Si ambos niveles y grados están seleccionados
      if (nivelInicial && gradoInicial && nivelFinal && gradoFinal) {
        const gradoInicialNombre = grados.find((g) => g.id === gradoInicial)?.nombre || ""
        const gradoFinalNombre = grados.find((g) => g.id === gradoFinal)?.nombre || ""

        // Si son del mismo nivel
        if (nivelInicial === nivelFinal) {
          if (nivelInicial === "Secundaria") {
            rangoGrados = `${gradoInicialNombre} ${nivelInicial}`
            if (gradoInicial !== gradoFinal) {
              rangoGrados = `${gradoInicialNombre} a ${gradoFinalNombre} ${nivelInicial}`
            }
          } else {
            rangoGrados = `${gradoInicialNombre}`
            if (gradoInicial !== gradoFinal) {
              rangoGrados = `${gradoInicialNombre} a ${gradoFinalNombre}`
            }
          }
        } else {
          // Si son de diferentes niveles
          rangoGrados = `${gradoInicialNombre} ${nivelInicial} a ${gradoFinalNombre} ${nivelFinal}`
        }
      } else {

        rangoGrados = "-------"
      }

      // Preparar datos para enviar
      const datosActualizados = {
        grado_inicial_id: gradoInicial || null,
        grado_final_id: gradoFinal || null,
        rango_grados: rangoGrados,
        grado_inicial_nombre: gradoInicial
          ? `${grados.find((g) => g.id === gradoInicial)?.nombre} ${nivelInicial}`
          : null,
        grado_final_nombre: gradoFinal ? `${grados.find((g) => g.id === gradoFinal)?.nombre} ${nivelFinal}` : null,
      }

      console.log("Datos a enviar:", datosActualizados)

      await axiosInstance.put(ENDPOINTS.editarGrado(id), datosActualizados);

      setNotification({
        open: true,
        message: "Grado actualizado correctamente",
        severity: "success",
      })

      setTimeout(() => navigate(-1), 1500)
    } catch (error) {
      console.error("Error al actualizar grado:", error)
      setNotification({
        open: true,
        message: error.response?.data?.message || "Error al actualizar grado",
        severity: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCloseNotification = () => {
    setNotification((prev) => ({ ...prev, open: false }))
  }

  const handleCancel = () => {
    navigate(-1)
  }

  return (
    <div className="page-container">
      <Paper className="editor-grado-container">
        <form onSubmit={handleSubmit}>
          <Typography className="page-title">Editor Grado</Typography>

          {gradoData && (
            <Typography variant="subtitle1" className="nivel-info">
              Nivel: {gradoData.nombre || "No especificado"}
            </Typography>
          )}

          <Grid container spacing={4}>
            {/* Columna izquierda - Grado Inicial */}
            <Grid item xs={12} md={6}>
              <div className="nivel-section">
                <Typography className="section-label">Nivel</Typography>

                <FormControl fullWidth className="select-field">
                  <Select
                    value={nivelInicial || ""}
                    onChange={(e) => setNivelInicial(e.target.value)}
                    displayEmpty
                    className="select-input"
                  >
                    <MenuItem value="">Seleccione nivel</MenuItem>
                    {nivelesEducativos.map((nivel) => (
                      <MenuItem key={`nivel-inicial-${nivel.id}`} value={nivel.nombre}>
                        {nivel.nombre}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>

              <div className="grado-section">
                <Typography className="section-label">Grado Inicial</Typography>

                <FormControl fullWidth className="select-field">
                  <Select
                    value={gradoInicial}
                    onChange={(e) => setGradoInicial(e.target.value)}
                    displayEmpty
                    className="select-input"
                    disabled={!nivelInicial}
                  >
                    <MenuItem value="">Seleccione grado</MenuItem>
                    {grados.map((grado) => (
                      <MenuItem key={`grado-inicial-${grado.id}`} value={grado.id}>
                        {grado.nombre}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            </Grid>

            {/* Columna derecha - Grado Final */}
            <Grid item xs={12} md={6}>
              <div className="nivel-section">
                <Typography className="section-label">Nivel</Typography>

                <FormControl fullWidth className="select-field">
                  <Select
                    value={nivelFinal}
                    onChange={(e) => setNivelFinal(e.target.value)}
                    displayEmpty
                    className="select-input"
                  >
                    <MenuItem value="">Seleccione nivel</MenuItem>
                    {nivelesEducativos.map((nivel) => (
                      <MenuItem key={`nivel-final-${nivel.id}`} value={nivel.nombre}>
                        {nivel.nombre}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>

              <div className="grado-section">
                <Typography className="section-label">Grado Final</Typography>

                <FormControl fullWidth className="select-field">
                  <Select
                    value={gradoFinal}
                    onChange={(e) => setGradoFinal(e.target.value)}
                    displayEmpty
                    className="select-input"
                    disabled={!nivelFinal}
                  >
                    <MenuItem value="">Seleccione grado</MenuItem>
                    {grados.map((grado) => (
                      <MenuItem key={`grado-final-${grado.id}`} value={grado.id}>
                        {grado.nombre}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            </Grid>
          </Grid>

          {/* Botones de acción */}
          <div className="action-buttons">
            <Button className="cancel-btn" variant="outlined" color="inherit" onClick={handleCancel} disabled={loading}>
              Cancelar
            </Button>

            <Button className="save-btn" type="submit" variant="contained" color="primary" disabled={loading}>
              {loading ? <CircularProgress size={24} className="loading-indicator" /> : "Guardar"}
            </Button>
          </div>
        </form>

        {/* Notificaciones */}
        <Snackbar
          open={notification.open}
          autoHideDuration={6000}
          onClose={handleCloseNotification}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={handleCloseNotification}
            severity={notification.severity}
            className={`notification ${notification.severity}-notification`}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      </Paper>
    </div>
  )
}

export default EditarGrado

