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
  Divider,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import { useNavigate,useParams} from 'react-router-dom'; 
import axiosInstance from '../../../../../../interception/interception';
import { ENDPOINTS } from '../../../../../../api/constans/endpoints';
import "../crearCategoria/crearCategoria.css"

const EditarCategoria = () => {
  const navigate = useNavigate()
  const {id} = useParams()

  // Estados del formulario
  const [nombreCategoria, setNombreCategoria] = useState('')
  const [descripcionCategoria, setDescripcionCategoria] = useState('')
  const [areaSeleccionada, setAreaSeleccionada] = useState('')
  const [nombreArea, setNombreArea]=useState('')
  
  // Datos de la API
  const [categoriaData, setCategoriaData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        if (id) {
          const categoryResponse = await axiosInstance.get(ENDPOINTS.categoriaDatos(id));
          setCategoriaData(categoryResponse.data);
          
          if (categoryResponse.data) {
            setNombreCategoria(categoryResponse.data.nombre || '');
            setDescripcionCategoria(categoryResponse.data.descripcion || '');
            setAreaSeleccionada(categoryResponse.data.area_id || '');
            setNombreArea(categoryResponse.data.area_nombre || '');
          }
        }
      } catch (error) {
        console.error('Error al cargar datos:', error);
        setNotification({
          open: true,
          message: 'Error al cargar los datos necesarios',
          severity: 'error'
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id]);

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
      const response = await axiosInstance.put(ENDPOINTS.editarCategoria(id), {
        nombre: nombreCategoria,
        descripcion: descripcionCategoria,
        area_id: areaSeleccionada,
        grado_id_inicial: categoriaData.grado_inicial_id,
        grado_id_final: categoriaData.grado_final_id,
      });

      setNotification({
        open: true,
        message: 'Categoría actualizada correctamente',
        severity: 'success'
      });
      
      setTimeout(() => navigate(-1), 1500);
    } catch (error) {
      console.error('Error al editar categoría:', error);
      setNotification({
        open: true,
        message: error.response?.data?.message || 'Error al editar categoría',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCrearGrado = () => {
    if (!areaSeleccionada) {
      setNotification({
        open: true,
        message: 'Por favor seleccione un área primero',
        severity: 'warning'
      });
      return;
    }
  
  };

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <Paper className="registro-container">
      <form onSubmit={handleSubmit}>
        <Typography className="section-title">
          Editar Categoría
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
              disabled={loading}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              className="textarea-field"
              fullWidth
              label="Descripción"
              value={descripcionCategoria}
              onChange={(e) => setDescripcionCategoria(e.target.value)}
              margin="normal"
              variant="outlined"
              multiline
              rows={4}
              disabled={loading}
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
                disabled={loading}
              >
                  <MenuItem key={areaSeleccionada} value={areaSeleccionada}>
                    {nombreArea}
                  </MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        
        <Divider className="divider" />
        
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
              'Guardar Cambios'
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

export default EditarCategoria;