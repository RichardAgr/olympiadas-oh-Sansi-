import { useState } from "react"
import AddIcon from "@mui/icons-material/Add"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"
import "./tablaDatos.css"

import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    IconButton,
  } from "@mui/material"

export default function TablaDatos() {
    
  const [categories, setCategories] = useState([
    { id: 1, area: "Astronomía y Astrofísica", nivel: "3P", grado: "3ro Primaria" },
    { id: 2, area: "Astronomía y Astrofísica", nivel: "4P", grado: "4to Primaria" },
    { id: 3, area: "Astronomía y Astrofísica", nivel: "5P", grado: "5to Primaria" },
    { id: 4, area: "Astronomía y Astrofísica", nivel: "6P", grado: "6to Primaria" },
    { id: 5, area: "Astronomía y Astrofísica", nivel: "1S", grado: "1ro Secundaria" },
    { id: 6, area: "Astronomía y Astrofísica", nivel: "2S", grado: "2do Secundaria" },
    { id: 7, area: "Astronomía y Astrofísica", nivel: "3S", grado: "3ro Secundario" },
    { id: 8, area: "Astronomía y Astrofísica", nivel: "4S", grado: "4to Secundario" },
  ])

  // Función para manejar la adición de una nueva categoría
  const handleAddCategory = () => {
    console.log("Agregar nueva categoría")
    // Aquí iría la lógica para abrir un modal o formulario de adición
  }

  // Función para manejar la edición de una categoría
  const handleEditCategory = (id) => {
    console.log(`Editar categoría con ID: ${id}`)
    // Aquí iría la lógica para editar una categoría
  }

  // Función para manejar la eliminación de una categoría
  const handleDeleteCategory = (id) => {
    console.log(`Eliminar categoría con ID: ${id}`)
    // Aquí iría la lógica para eliminar una categoría
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

      <TableContainer component={Paper} className="table-container">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className="header-cell">Área</TableCell>
              <TableCell className="header-cell">
                Nivel / Categoría
              </TableCell>
              <TableCell className="header-cell">Grados</TableCell>
              <TableCell className="header-cell">Seleccionar</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell>{category.area}</TableCell>
                <TableCell>{category.nivel}</TableCell>
                <TableCell>{category.grado}</TableCell>
                <TableCell>
                  <div className="action-buttons">
                    <IconButton color="primary" onClick={() => handleEditCategory(category.id)} className="icon-button">
                      <EditIcon />
                    </IconButton>
                    <IconButton color="primary" onClick={() => handleDeleteCategory(category.id)} className="icon-button">
                      <DeleteIcon />
                    </IconButton>
                  </div>
                </TableCell>
              </TableRow>
            ))}
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
    </div>
  )
}

