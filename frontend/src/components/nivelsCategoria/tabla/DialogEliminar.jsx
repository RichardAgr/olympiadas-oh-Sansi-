import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  IconButton,
  Divider,
  Paper,
  CircularProgress,
} from "@mui/material";
import { Delete, Close, Warning, Error } from "@mui/icons-material";
import "./dialogEliminar.css"

export const DialogEliminar = ({
  open,
  onClose,
  item ,
  onConfirm,
  loading,
  tipo = "elemento",
  titulo = "Confirmar eliminación",
  mensaje = "¿Está seguro que desea eliminar este elemento?",
  advertencia = "Esta acción no se puede deshacer. El elemento será eliminado.",
  detallesTitulo = "Detalles del elemento:",
  mensajeError = "No se puede eliminar este elemento porque tiene registros relacionados.",
  renderizarDetalles = null,
}) => {
  if(!open) return null

 if (!item) {
      return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
          <DialogTitle className="dialog-title">
            <Typography variant="h6" component="div">{titulo}</Typography>
            <IconButton aria-label="close" onClick={onClose} className="close-button">
              <Close />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ pt: 2, textAlign: 'center' }}>
            <CircularProgress size={40} />
            <Typography variant="body1" style={{ marginTop: 16 }}>
              Cargando información...
            </Typography>
          </DialogContent>
          <DialogActions className="dialog-actions">
            <Button onClick={onClose} color="inherit" variant="outlined">
              Cancelar
            </Button>
          </DialogActions>
        </Dialog>
      );
    }
  
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle className="dialog-title">
          <Typography variant="h6" component="div">{titulo}</Typography>
          <IconButton aria-label="close" onClick={onClose} className="close-button">
            <Close />
          </IconButton>
        </DialogTitle>
  
        <DialogContent sx={{ pt: 2 }}>
          <div className="warning-container">
            <Typography className='titleDialog' variant="h6">
              <Warning className="warning-icon" />
              {mensaje}
            </Typography>
          </div>
  
          <Typography className='titleDialog' variant="body2" color="text.secondary">
            {advertencia}
          </Typography>
  
          <Paper className="details-paper" elevation={0}>
            <Typography variant="subtitle1" gutterBottom>
              {detallesTitulo}
            </Typography>
  
            <div className="container-data">
              {renderizarDetalles ? (
                renderizarDetalles(item)
              ) : (
                <>
                  {Object.entries(item).map(([key, value]) => {
                    if (['id', 'tiene_registros_relacionados', 'area_id', 'grado_id', 'created_at', 'updated_at'].includes(key)) {
                      return null;
                    }
                    
                    const formattedKey = key
                      .replace(/_/g, ' ')
                      .split(' ')
                      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(' ');
                    
                    return (
                      <div key={key} className="detail-row">
                        <Typography className="detail-label">{formattedKey}:</Typography>
                        <Typography>{value !== null && value !== undefined ? value.toString() : '-'}</Typography>
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          </Paper>
  
          {item.tiene_registros_relacionados && (
            <div className="error-message">
              <Error className="error-icon" />
              <Typography color="error">
                {mensajeError}
              </Typography>
            </div>
          )}
        </DialogContent>
  
        <Divider />
  
        <DialogActions className="dialog-actions">
          <Button onClick={onClose} color="inherit" variant="outlined" disabled={loading}>
            Cancelar
          </Button>
          <Button
            onClick={() => onConfirm(item.id)}
            color="error"
            variant="contained"
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Delete />}
            disabled={item.tiene_registros_relacionados || loading}
          >
            {loading ? "Eliminando..." : `Eliminar ${tipo}`}
          </Button>
        </DialogActions>
      </Dialog>
  );
};
