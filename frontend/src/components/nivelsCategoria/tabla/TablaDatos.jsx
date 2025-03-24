import { useState,useEffect } from "react"
import AddIcon from "@mui/icons-material/Add"
import "./tablaDatos.css"
import axiosInstance from "../../../interception/interception"
import { ENDPOINTS } from "../../../api/constans/endpoints"
import {CustomEliminarCategoria} from "./customsTablaDatos/flowCategoria/eliminarCategoria/CustomEliminarCategoria"
import CustomTablaDatos from './customsTablaDatos/CustomTablaDatos'
import { CustomEliminarGrado} from "./customsTablaDatos/flowGrado/eliminarGrado/CustomEliminarGrado"

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
  } from "@mui/material"

  
  export default function TablaDatos() {
    
    const [categories, setCategories] = useState([])
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    useEffect(()=>{
      getCategories()
    },[])

    const handleOpenDeleteDialog =  (idNivel) => {
      let selectedCat = null
      try {
        categories.forEach((area) => {
          area.niveles_categoria.forEach((nivel) => {
            if (nivel.nivel_categoria_id === idNivel) {
              selectedCat = {
                id: nivel.nivel_categoria_id,
                nombre: nivel.nombre_categoria,
                descripcion: nivel.descripcion || "",
                area_id: area.area_id,
                area_nombre: area.nombre_area,
                rango_grados: nivel.rango_grados,
              };
            }
          });
        });
      }catch (error) {
        console.error("Error al preparar el diálogo de eliminación:", error)
        setNotification({
            open: true,
            message: "Error al preparar la eliminación",
            severity: "error",
          });
        }
        setSelectedCategory(selectedCat);
        setOpenDeleteDialog(true);
    }

    
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

 

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setTimeout(() => {
      setSelectedCategory(null);
    }, 300);
  };

  const rows = CustomTablaDatos(categories,{
    onEditCategory: (id) => console.log(`Editar categoría con ID: ${id}`),
    onDeleteCategory: handleOpenDeleteDialog,
    onEditGrado: () => console.log("Editar grado"),
    onDeleteGrado: handleOpenDeleteDialog,
    })

  const handleConfirmDelete = ()=>{
    setDeleteLoading(false);
  }

  const handleCloseNotification = () => {
    setNotification({
      ...notification,
      open: false,
    });
  };

  // Función para manejar la adición de una nueva categoría
  const handleAddCategory = () => {
    console.log("Agregar nueva categoría")
    // Aquí iría la lógica para abrir un modal o formulario de adición
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
      <CustomEliminarCategoria
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        categoria={selectedCategory}
        onConfirm={handleConfirmDelete}
        loading={deleteLoading}
      />

    <CustomEliminarGrado
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        categoria={selectedCategory}
        onConfirm={handleConfirmDelete}
        loading={deleteLoading}
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

