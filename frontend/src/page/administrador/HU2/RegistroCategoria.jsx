
import { useEffect, useState } from "react"
import "./RegistroCategoria.css"
import { Edit, Trash2, Plus } from "lucide-react"
import { Link, useNavigate, useParams } from "react-router-dom"
import ModalEliminarCategoria from "../../../components/ModalEliminarCategoria"
import api from '../../../components/Tokens/api';

function RegistroCategoria() {
  const [areasConCategorias, setAreasConCategorias] = useState([])
  const [categorias, setCategorias] = useState([]) // Categorías aplanadas
  const [search, setSearch] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 15
  const navigate = useNavigate()

  const [modalAbierto, setModalAbierto] = useState(false)
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const { id_competencia } = useParams();
  const routeTo=(subruta)=>`/admin/HomeAdmin/${id_competencia}/${subruta}`;

  // Función para aplanar las categorías
  const aplanarCategorias = (data) => {
    const categoriasAplanadas = []

    data.forEach((area) => {
      area.categorias.forEach((categoria) => {
        categoriasAplanadas.push({
          ...categoria,
          area_nombre: area.nombre,
          area_id: area.area_id,
          costo: area.costo,
        })
      })
    })

    return categoriasAplanadas
  }

  useEffect(() => {
    api
      .get(`http://localhost:8000/api/areasCategoriasGrados`)
      .then((response) => {

        if (response.data.success && response.data.data) {
          setAreasConCategorias(response.data.data)
          const categoriasAplanadas = aplanarCategorias(response.data.data)
          setCategorias(categoriasAplanadas)
        }
      })
      .catch((error) => {
        console.error("Error al cargar categorías:", {
          errorMessage: error.message,
          errorData: error.response?.data,
        })
      })
  }, [])

  const abrirModal = (categoria) => {
    setCategoriaSeleccionada(categoria)
    setModalAbierto(true)
  }

  const cerrarModal = () => {
    setModalAbierto(false)
    setCategoriaSeleccionada(null)
  }

  const confirmarEliminacion = async () => {
    try {
/*       console.log("ID enviado para eliminar:", categoriaSeleccionada.nivel_categoria_id) */

      const response = await api.delete(
        `http://localhost:8000/api/nivel-categorias/${categoriaSeleccionada.nivel_categoria_id}`,
      )
/* 
      console.log("Datos de respuesta:", response.data) */

      

      // Actualizar el estado eliminando la categoría
      setCategorias((prev) => prev.filter((cat) => cat.nivel_categoria_id !== categoriaSeleccionada.nivel_categoria_id))

      cerrarModal()
      setShowSuccessModal(true)
    } catch (error) {
      console.error("Datos del error:", error.response?.data || error.message)
      cerrarModal()
    }
  }

  // Filtrar categorías por nombre de categoría o área
  const categoriasFiltradas = categorias.filter(
    (cat) =>
      cat.nombre.toLowerCase().includes(search.toLowerCase()) ||
      cat.area_nombre.toLowerCase().includes(search.toLowerCase()) ||
      cat.rango_grado.toLowerCase().includes(search.toLowerCase()),
  )

  const totalPages = Math.ceil(categoriasFiltradas.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const categoriasPaginadas = categoriasFiltradas.slice(startIndex, startIndex + itemsPerPage)

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  return (
    <div className="registro-categoria-containerLi">
      <h5>Gestión de Categorías de Competencia</h5>

      {/* Buscador */}
      <div className="buscador-wrapperLi">
        <input
          type="text"
          placeholder="Buscar por área, categoría o grado..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setCurrentPage(1)
          }}
        />
      </div>

      <div className="tabla-categorias-wrapperLi">
        <button className="btn-agregarLi" onClick={() => navigate(routeTo("registro-categorias/nueva"))}>
          <Plus size={18} />
          Agregar
        </button>

        <table className="tabla-categoriasLi">
          <thead>
            <tr className="cabeceraLi">
              <th>Área</th>
              <th>Nombre Nivel / Categoría</th>
              <th>Grados</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categoriasPaginadas.length > 0 ? (
              categoriasPaginadas.map((cat) => (
                <tr key={cat.nivel_categoria_id}>
                  <td>{cat.area_nombre}</td>
                  <td className="accionesLi2">{cat.nombre}</td>
                  <td>{cat.rango_grado}</td>
                  <td className="accionesLi">
                    <Link to={routeTo(`/admin/registro-categorias/editar/${cat.nivel_categoria_id}`)} className="boton-iconoLi">
                      <Edit size={20} color="white" />
                    </Link>
                    <button className="boton-iconoLi" onClick={() => abrirModal(cat)}>
                      <Trash2 size={20} color="white" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ textAlign: "center", padding: "1rem" }}>
                  No hay categorías registradas.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="paginationLi">
            <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
              {"<"}
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button key={i} onClick={() => goToPage(i + 1)} className={currentPage === i + 1 ? "activeLi" : ""}>
                {i + 1}
              </button>
            ))}
            <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>
              {">"}
            </button>
          </div>
        )}
      </div>

      {/* Modal personalizado */}
      {modalAbierto && (
        <ModalEliminarCategoria
          categoria={categoriaSeleccionada}
          onCancel={cerrarModal}
          onConfirm={confirmarEliminacion}
        />
      )}

      {showSuccessModal && (
        <div className="modal-overlayLi">
          <div className="modal-contentLi">
            <h3>Operación exitosa</h3>
            <p>La categoría ha sido eliminada correctamente.</p>
            
            <div className="modal-buttonsLi">
              <button className="modal-confirmLi" onClick={() => setShowSuccessModal(false)}>Aceptar</button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default RegistroCategoria
