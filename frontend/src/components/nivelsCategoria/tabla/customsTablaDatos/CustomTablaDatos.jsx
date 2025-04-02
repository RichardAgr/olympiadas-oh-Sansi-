import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"
import {
    TableCell,
    TableRow,
    IconButton,
  } from "@mui/material"

export default function CustomTablaDatos (categories, handlers) {
  const {
    onEditCategory,
    onDeleteCategory,
    onEditGrado,
    onDeleteGrado
  } = handlers;
    const rows = []

    categories.forEach((area) => {
      area.niveles_categoria.forEach((nivel) => {
        rows.push(
          <TableRow key={`${area.area_id}-${nivel.nivel_categoria_id}`}>
            <TableCell>{area.nombre_area}</TableCell>
            <TableCell>
              <div className="content-row">
                {nivel.nombre_categoria}
                <div className="action-buttons">
                  <IconButton
                    color="primary"
                    onClick={() => onEditCategory(nivel.nivel_categoria_id)}
                    className="icon-button"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="primary"
                    onClick={() => onDeleteCategory(nivel.nivel_categoria_id)}
                    className="icon-button"
                  >
                    <DeleteIcon />
                  </IconButton>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div className="content-row">
                {nivel.rango_grados}
                <div className="action-buttons">
                  <IconButton
                    color="primary"
                    onClick={() => onEditGrado(nivel.nivel_categoria_id)}
                    className="icon-button"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="primary"
                    onClick={() => onDeleteGrado(nivel.nivel_categoria_id)}
                    className="icon-button"
                  >
                    <DeleteIcon />
                  </IconButton>
                </div>
              </div>
            </TableCell>
          </TableRow>,
        )
      })
    })

    return rows
  }
