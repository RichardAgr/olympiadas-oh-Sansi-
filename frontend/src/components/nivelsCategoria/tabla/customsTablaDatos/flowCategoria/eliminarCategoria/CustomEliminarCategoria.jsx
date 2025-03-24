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
} from "@mui/material"
import { Delete, Close, Warning, Error } from "@mui/icons-material"
import "./customEliminarCategoria.css"

export const CustomEliminarCategoria = ({ open, onClose, categoria, onConfirm, loading }) => {
  if (!categoria) return null

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle className="dialog-title">
        <Typography variant="h6">Confirmar eliminación</Typography>
        <IconButton aria-label="close" onClick={onClose} className="close-button">
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        <div className="warning-container">
          
          <Typography className='titleDialog' variant="h6">
            <Warning className="warning-icon" />
            ¿Está seguro que desea eliminar esta categoría?</Typography>
        </div>

        <Typography className='titleDialog' variant="body2" color="text.secondary">
          Esta acción no se puede deshacer. La categoría será eliminada.
        </Typography>

        <Paper className="details-paper" elevation={0}>
          <Typography variant="subtitle1" gutterBottom>
            Detalles de la categoría:
          </Typography>

          <div className="container-data">
          <div className="detail-row">
            <Typography className="detail-label">Área:</Typography>
            <Typography>{categoria.area_nombre}</Typography>
          </div>

          <div className="detail-row">
            <Typography className="detail-label">Nivel/Categoría:</Typography>
            <Typography>{categoria.nombre}</Typography>
          </div>
  
          </div>
        </Paper>

        {categoria.tiene_competidores && (
          <div className="error-message">
            <Error className="error-icon" />
            <Typography color="error">
              No se puede eliminar esta categoría porque tiene competidores inscritos.
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
          onClick={() => onConfirm(categoria.id)}
          color="error"
          variant="contained"
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Delete />}
          disabled={categoria.tiene_competidores || loading}
        >
          {loading ? "Eliminando..." : "Eliminar"}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

