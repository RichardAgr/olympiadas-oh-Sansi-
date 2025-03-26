// RegistrarCategoria.jsx
import { useState, useEffect } from 'react';
import {
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Grid,
  Box,
  Divider,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom'; 
import axiosInstance from '../../../../../../interception/interception';
import { ENDPOINTS } from '../../../../../../api/constans/endpoints';
import "./crearCategoria.css"



const CrearCategoria = ({ onClose, onSuccess }) => {
  //  formulario de categoría
  const navigate = useNavigate();
  const [nombreCategoria, setNombreCategoria] = useState('');
  const [descripcionCategoria, setDescripcionCategoria] = useState('');
  const [areaSeleccionada, setAreaSeleccionada] = useState('');

  const [categoriaCreada, setCategoriaCreada] = useState(null);
  
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const areasResponse = await axiosInstance.get(ENDPOINTS.areaCategoriaGrado);
        setAreas(areasResponse.data.data || []);
      } catch (error) {
        console.error('Error al cargar áreas:', error);
        setNotification({
          open: true,
          message: 'Error al cargar datos de áreas',
          severity: 'error'
        });
      }
    };
    
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!nombreCategoria.trim() || !areaSeleccionada) {
      setNotification({
        open: true,
        message: 'Por favor complete los campos obligatorios',
        severity: 'warning'
      });
      return;
    }
    
    try {
      setLoading(true);
      const response = await axiosInstance.post(ENDPOINTS.crearCategoria, {
        nombre: nombreCategoria,
        descripcion: descripcionCategoria,
        area_id: areaSeleccionada
      });

      setCategoriaCreada(response.data.data);
      
      setNotification({
        open: true,
        message: 'Categoría registrada correctamente',
        severity: 'success'
      });
      
      // Limpiar el formulario
      setNombreCategoria('');
      setDescripcionCategoria('');
      setAreaSeleccionada('');
      navigate(-1)
      
      // Notificar al componente padre
      if (onSuccess) {
        onSuccess(response.data.data);
      }
    } catch (error) {
      console.error('Error al registrar categoría:', error);
      setNotification({
        open: true,
        message: error.response?.data?.message || 'Error al registrar categoría',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };
  // Ruta a la página de creación de grado
  const handleCrearGrado = () => {
    if(!areaSeleccionada){
      setNotification({
      open: true,
      message: 'Información de área no disponible. Por favor, seleccione un área primero.',
      severity: 'warning'
    });
  }else{
      navigate("/crearGrado",{
          state: { 
            areaId: areaSeleccionada,
            nombre: nombreCategoria,
          } 
      })
    } 
  }


  const handleCloseNotification = () => {
    setNotification({
      ...notification,
      open: false
    });
  };

  return (
    <Paper className="registro-container">
      <form onSubmit={handleSubmit}>
        {/* Sección de Categoría */}
        <Typography className="section-title">
          Registrar Categoría
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              className="text-field"
              fullWidth
              label="Nombre de Categoría"
              value={nombreCategoria}
              onChange={(e) => setNombreCategoria(e.target.value)}
              margin="normal"
              variant="outlined"
              required
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              className="textarea-field"
              fullWidth
              label="Descripción de Categoría"
              value={descripcionCategoria}
              onChange={(e) => setDescripcionCategoria(e.target.value)}
              margin="normal"
              variant="outlined"
              multiline
              rows={4}
            />
          </Grid>
          
          <Grid item xs={12}>
            <FormControl fullWidth margin="normal" required className="select-field">
              <InputLabel id="area-select-label">Área</InputLabel>
              <Select
                labelId="area-select-label"
                value={areaSeleccionada}
                onChange={(e) => setAreaSeleccionada(e.target.value)}
                label="Área"
              >
                {areas.map((area) => (
                  <MenuItem key={area.area_id} value={area.area_id}>
                    {area.nombre_area}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        
        <Divider className="divider" />
        
        <Typography className="section-title">
          Registrar Grado
        </Typography>
        
        <div className="grado-display-section">
         
          <Button
            className="crear-grado-btn"
            variant="contained"
            color="primary"
            onClick={handleCrearGrado}
          >
            Grados
          </Button>
        </div>
        
        <div className="action-buttons">
          <Button
            className="cancel-btn"
            variant="outlined"
            color="inherit"
            onClick={onClose}
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
  );
};

export default CrearCategoria;