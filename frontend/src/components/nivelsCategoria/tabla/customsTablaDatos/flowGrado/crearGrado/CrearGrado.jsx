import { useState, useEffect } from 'react';
import {
  Typography,
  Paper,
  FormControl,
  Select,
  MenuItem,
  Box,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import axiosInstance from '../../../../../../interception/interception';
import { ENDPOINTS } from '../../../../../../api/constans/endpoints';
import "./crearGrado.css"

const CrearGrado = () => {
  // Estados para el formulario
  const [nivelInicial, setNivelInicial] = useState('');
  const [nivelFinal, setNivelFinal] = useState('');
  const [gradoInicial, setGradoInicial] = useState('');
  const [gradoFinal, setGradoFinal] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  const navigate = useNavigate()
  const location = useLocation()
  const areaId = location.state?.areaId
  const nombreCategoria = location.state?.nombreCategoria
 
  // Opciones para los niveles educativos
  const nivelesEducativos = [
    { id: 1, nombre: 'Primaria' },
    { id: 2, nombre: 'Secundaria' }
  ];
  
  // Opciones para los grados
  const grados = [
    { id: 1, nombre: '1ro' },
    { id: 2, nombre: '2do' },
    { id: 3, nombre: '3ro' },
    { id: 4, nombre: '4to' },
    { id: 5, nombre: '5to' },
    { id: 6, nombre: '6to' }
  ];

  useEffect(() => {
    if (!areaId) {
      navigate(-1)
    }
  }, [areaId, navigate, nombreCategoria]);

  const calcularOrden = (gradoId, nivelId) => {
    console.log(nivelId)
    return nivelId === "Secundaria" ? gradoId + 6 : gradoId;
  };
  
  // Manejar el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!nivelInicial || !gradoInicial || !nivelFinal || !gradoFinal) {
      setNotification({
        open: true,
        message: 'Por favor complete todos los campos requeridos',
        severity: 'warning'
      });
      return;
    }
    
    try {
      setLoading(true);

      const ordenInicial = calcularOrden(parseInt(gradoInicial), nivelInicial);
      const ordenFinal = calcularOrden(parseInt(gradoFinal), nivelFinal);

      const data = {
        //tabla nivel categoria
        grado_inicial_id: gradoInicial,
        grado_final_id: gradoFinal,
        area_id: areaId,          
        //tabla grado
        nivel_inicial_id: nivelInicial,
        nivel_final_id: nivelFinal, 
        orden_inicial: ordenInicial,
        orden_final: ordenFinal,
      }
      console.log(data)
      // Crear el grado o rango de grados
      /* const response = await axiosInstance.post(ENDPOINTS.grados, {
        
      }); */

      setNotification({
        open: true,
        message: 'Grado registrado correctamente',
        severity: 'success'
      });
      
      setTimeout(() => {
        navigate(-1); // Volver a la página anterior
      }, 2000);
      
    } catch (error) {
      console.error('Error al registrar grado:', error);
      setNotification({
        open: true,
        message: error.response?.data?.message || 'Error al registrar grado',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  }
  
  // Cerrar notificación
  const handleCloseNotification = () => {
    setNotification({
      ...notification,
      open: false
    });
  };
  
  // Cancelar y volver a la página anterior
  const handleCancel = () => {
    navigate(-1);
  };
  
  return (
    <div className="page-container">
      <Paper className="editor-grado-container">
        <form onSubmit={handleSubmit}>
          <Typography className="page-title">
            Editor Grado
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
            {/* Columna izquierda - Grado Inicial */}
            <Box sx={{ flex: 1 }}>
              <div className="nivel-section">
                <Typography className="section-label">
                  Nivel
                </Typography>
                
                <FormControl fullWidth className="select-field">
                  <Select
                    value={nivelInicial}
                    onChange={(e) => setNivelInicial(e.target.value)}
                    displayEmpty
                    className="select-input"
                  >
                    <MenuItem value="">Ninguno</MenuItem>
                    {nivelesEducativos.map((nivel) => (
                      <MenuItem key={`nivel-inicial-${nivel.id}`} value={nivel.nombre}>
                        {nivel.nombre}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              
              <div className="grado-section">
                <Typography className="section-label">
                  Grado Inicial
                </Typography>
                
                <FormControl fullWidth className="select-field">
                  <Select
                    value={gradoInicial}
                    onChange={(e) => setGradoInicial(e.target.value)}
                    displayEmpty
                    className="select-input"
                  >
                    {grados.map((grado) => (
                      <MenuItem key={`grado-inicial-${grado.id}`} value={grado.id}>
                        {grado.nombre}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            </Box>
            
            {/* Columna derecha - Grado Final */}
            <Box sx={{ flex: 1 }}>
              <div className="nivel-section">
                <Typography className="section-label">
                  Nivel
                </Typography>
                
                <FormControl fullWidth className="select-field">
                  <Select
                    value={nivelFinal}
                    onChange={(e) => setNivelFinal(e.target.value)}
                    displayEmpty
                    className="select-input"
                  >
                    <MenuItem value="">Ninguno</MenuItem>
                    {nivelesEducativos.map((nivel) => (
                      <MenuItem key={`nivel-final-${nivel.id}`} value={nivel.nombre}>
                        {nivel.nombre}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              
              <div className="grado-section">
                <Typography className="section-label">
                  Grado Final
                </Typography>
                
                <FormControl fullWidth className="select-field">
                  <Select
                    value={gradoFinal}
                    onChange={(e) => setGradoFinal(e.target.value)}
                    displayEmpty
                    className="select-input"
                  >
                    {grados.map((grado) => (
                      <MenuItem key={`grado-final-${grado.id}`} value={grado.id}>
                        {grado.nombre}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            </Box>
          </Box>
          
          {/* Botones de acción */}
          <div className="action-buttons">
            <Button
              className="cancel-btn"
              variant="outlined"
              color="inherit"
              onClick={handleCancel}
              disabled={loading}
            >
              Cancelar
            </Button>
            
            <Button
              className="save-btn"
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} className="loading-indicator" />
              ) : (
                'Guardar'
              )}
            </Button>
          </div>
        </form>
        
        {/* Notificaciones */}
        <Snackbar
          open={notification.open}
          autoHideDuration={6000}
          onClose={handleCloseNotification}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
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
  );
};

export default CrearGrado;