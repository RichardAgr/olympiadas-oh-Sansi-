import { useState,useEffect } from "react"
import AddIcon from "@mui/icons-material/Add"
import "./tablaDatos.css"
import axiosInstance from "../../../interception/interception"
import { ENDPOINTS } from "../../../api/constans/endpoints"
import {DialogEliminar}  from "./DialogEliminar"
import CustomTablaDatos from './customsTablaDatos/CustomTablaDatos'
import { useNavigate } from 'react-router-dom'; 

import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Snackbar,
    Alert,
    Typography,
  } from "@mui/material"

  
  export default function TablaDatos() {
    
  const [categories, setCategories] = useState([])
  const navigate = useNavigate();
    
  const [openDeleteCategoryDialog, setOpenDeleteCategoryDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [deleteCategoryLoading, setDeleteCategoryLoading] = useState(false);
  
  const [openDeleteGradoDialog, setOpenDeleteGradoDialog] = useState(false);
  const [selectedGrado, setSelectedGrado] = useState(null);
  const [deleteGradoLoading, setDeleteGradoLoading] = useState(false);

    useEffect(()=>{
      getCategories()
    },[])

    const handleOpenDeleteCategoryDialog = (idNivel) => {
      let selectedCat = null;
      try {
        categories.forEach((area) => {
          area.niveles_categoria.forEach((nivel) => {
            if (nivel.nivel_categoria_id === idNivel) {
              selectedCat = {
                id: nivel.nivel_categoria_id,
                nombre: nivel.nombre_categoria,
                categoria_nombre: nivel.nombre_categoria,
                descripcion: nivel.descripcion || "",
                area_id: area.area_id,
                area_nombre: area.nombre_area,
                rango_grados: nivel.rango_grados,
              };
            }
          });
        });
      } catch (error) {
        console.error("Error al preparar el diálogo de eliminación:", error);
        setNotification({
          open: true,
          message: "Error al preparar la eliminación",
          severity: "error",
        });
      }
      setSelectedCategory(selectedCat);
      setOpenDeleteCategoryDialog(true);
    };

    const handleOpenDeleteGradoDialog = (idNivel) => {
      let selectedGrd = null;
      try {
        categories.forEach((area) => {
          area.niveles_categoria.forEach((nivel) => {
            if (nivel.nivel_categoria_id === idNivel) {
              selectedGrd = {
                id: nivel.nivel_categoria_id, // Asumiendo que tienes este campo
                nombre: nivel.rango_grados,
                area_nombre: area.nombre_area,
                nivel_educativo: nivel.nivel_educativo || "No especificado",
                abreviatura: nivel.abreviatura_grado || "",
                orden: nivel.orden_grado || 0,
              };
            }
          });
        });
      } catch (error) {
        console.error("Error al preparar el diálogo de eliminación de grado:", error);
        setNotification({
          open: true,
          message: "Error al preparar la eliminación del grado",
          severity: "error",
        });
      }
      setSelectedGrado(selectedGrd);
      setOpenDeleteGradoDialog(true);
    };
    
    const [notification, setNotification] = useState({
      open: false,
      message: "",
      severity: "success",
    });


  const getCategories=async ()=>{
    try {
      const res = await axiosInstance.get(ENDPOINTS.areaCategoriaGrado);
      setCategories(res.data.data);
    } catch (error) {
      console.error("Error al cargar datos:", error);
      setNotification({
        open: true,
        message: "Error al cargar los datos",
        severity: "error",
      });
    }
  } 

  const handleCloseDeleteCategoryDialog = () => {
    setOpenDeleteCategoryDialog(false);
    setTimeout(() => {
      setSelectedCategory(null);
    }, 300);
  };

  const handleCloseDeleteGradoDialog = () => {
    setOpenDeleteGradoDialog(false);
    setTimeout(() => {
      setSelectedGrado(null);
    }, 300);
  };



  const handleConfirmDeleteCategory = async (id)=>{
    try {
      setDeleteCategoryLoading(true);
      await axiosInstance.delete(ENDPOINTS.eliminarCategoria(id))

      getCategories()
      
      setNotification({
        open: true,
        message: "Categoría eliminada correctamente",
        severity: "success",
      });
      
      handleCloseDeleteCategoryDialog();
    } catch (error) {
      console.error("Error al eliminar la categoría:", error);
      setNotification({
        open: true,
        message: "Error al eliminar la categoría",
        severity: "error",
      });
    } finally {
      setDeleteCategoryLoading(false);
    }
  }

  const handleConfirmDeleteGrado = async (id)=>{
    try {
      setDeleteGradoLoading(true);
      await axiosInstance.put(ENDPOINTS.eliminarGrado(id))

      getCategories()
      
      setNotification({
        open: true,
        message: "Grado eliminado correctamente",
        severity: "success",
      });
      
      handleCloseDeleteGradoDialog();
    } catch (error) {
      console.error("Error al eliminar el grado:", error);
      setNotification({
        open: true,
        message: "Error al eliminar el grado",
        severity: "error",
      });
    } finally {
      setDeleteGradoLoading(false);
    }
  }

  const renderizarDetallesCategoria = (categoria) => {
    if ( !categoria ) return null
    return (
    <>
    <div  className="container-data">

    </div>
      <div className="detail-row">
        <Typography className="detail-label">Área:</Typography>
        <Typography>{categoria.area_nombre}</Typography>
      </div>
      <div className="detail-row">
        <Typography className="detail-label">Nivel/Categoría:</Typography>
        <Typography>{categoria.categoria_nombre}</Typography>
      </div>
    </>
    )
  };

  const renderizarDetallesGrado = (grado) => {
    if ( !grado ) return null
    return(
    <>
      <div className="detail-row">
        <Typography className="detail-label">Área:</Typography>
        <Typography>{grado.area_nombre}</Typography>
      </div>
      <div className="detail-row">
        <Typography className="detail-label">Grado:</Typography>
        <Typography>{grado.nombre}</Typography>
      </div>
    </>)
  }

  const handlers = {
    onEditCategory: (id) => navigate(`editCategoria/${id}`),
    onDeleteCategory: handleOpenDeleteCategoryDialog,
    onEditGrado: (id) => navigate(`editGrado/${id}`),
    onDeleteGrado: handleOpenDeleteGradoDialog,
  };

  const rows = CustomTablaDatos(categories,handlers)

  const handleCloseNotification = () => {
    setNotification({
      ...notification,
      open: false,
    });
  };

  // Función para manejar la adición de una nueva categoría
  const handleAddCategory = () => {
    navigate("/crearCategoria")
  }


  // Función para guardar los cambios
  const handleSave = () => {
    console.log("Guardar cambios")
    // Aquí iría la lógica para guardar los cambios
  }

  // Función para cancelar los cambios
  const handleCancel = () => {
    console.log("Cancelar cambios")
    // Aquí iría la lógica para cancelar los cambios
  }

  return (
    <div className="category-container">
      <div className="header-container">
        <div className="spacer"></div>
        <Button variant="contained" startIcon={<AddIcon />} className="add-button" onClick={handleAddCategory}>
          Agregar
        </Button>
      </div>

      <TableContainer  className="table-container">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className="header-cell"><h2>Área</h2></TableCell>
              <TableCell className="header-cell"><h2>Nivel / Categoría</h2></TableCell>
              <TableCell className="header-cell"><h2>Grado</h2></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          {categories.length > 0 ? (
              rows
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  Cargando datos...
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <div className="footer-buttons">
        <Button variant="outlined" onClick={handleCancel} className="cancel-button">
          Cancelar
        </Button>
        <Button variant="contained" onClick={handleSave} className="save-button">
          Guardar
        </Button>
      </div>
      <DialogEliminar
        open={openDeleteCategoryDialog}
        onClose={handleCloseDeleteCategoryDialog}
        item={selectedCategory}
        onConfirm={handleConfirmDeleteCategory}
        loading={deleteCategoryLoading}
        tipo="categoría"
        titulo="Confirmar eliminación de categoría"
        mensaje="¿Está seguro que desea eliminar esta categoría?"
        advertencia="Esta acción no se puede deshacer. La categoría será eliminada."
        detallesTitulo="Detalles de la categoría:"
        mensajeError="No se puede eliminar esta categoría porque tiene registros relacionados."
        renderizarDetalles={renderizarDetallesCategoria}
      />
      <DialogEliminar
        open={openDeleteGradoDialog}
        onClose={handleCloseDeleteGradoDialog}
        item={selectedGrado}
        onConfirm={handleConfirmDeleteGrado}
        loading={deleteGradoLoading}
        tipo="grado"
        titulo="Confirmar eliminación de grado"
        mensaje="¿Está seguro que desea eliminar este grado?"
        advertencia="Esta acción no se puede deshacer. El grado será eliminado."
        detallesTitulo="Detalles del grado:"
        mensajeError="No se puede eliminar este grado porque tiene cursos o categorías asociadas."
        renderizarDetalles={renderizarDetallesGrado}
      />
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>      
    </div>
  )
}

