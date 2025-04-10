import { useEffect, useState } from "react";
import axios from "axios";
import "./RegistroCategoria.css";
import { Edit, Trash2, Plus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import ModalEliminarCategoria from "../../components/ModalEliminarCategoria";

function RegistroCategoria() {
  const [categorias, setCategorias] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;
  const navigate = useNavigate();

  const [modalAbierto, setModalAbierto] = useState(false);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/nivel-categorias")
      .then((response) => {
        setCategorias(response.data);
      })
      .catch((error) => {
        console.error("Error al cargar categorías:", error);
      });
  }, []);

  const abrirModal = (categoria) => {
    setCategoriaSeleccionada(categoria);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setCategoriaSeleccionada(null);
  };

  const confirmarEliminacion = async () => {
    try {
      await axios.delete(
        `http://localhost:8000/api/nivel-categorias/${categoriaSeleccionada.nivel_categoria_id}`
      );
      alert("Categoría eliminada correctamente ✅");

      setCategorias((prev) =>
        prev.filter(
          (cat) => cat.nivel_categoria_id !== categoriaSeleccionada.nivel_categoria_id
        )
      );

      cerrarModal();
    } catch (error) {
      console.error("Error al eliminar categoría:", error);
      alert("❌ Error al eliminar la categoría.");
      cerrarModal();
    }
  };

  const categoriasFiltradas = categorias.filter((cat) =>
    cat.nombre.toLowerCase().includes(search.toLowerCase()) ||
    cat.area?.nombre.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(categoriasFiltradas.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const categoriasPaginadas = categoriasFiltradas.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="registro-categoria-container">
      <h5>Gestión de Categorías de Competencia</h5>

      {/* Buscador */}
      <div className="buscador-wrapper">
        <input
          type="text"
          placeholder="Buscar por nombre de categoría"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      <div className="tabla-categorias-wrapper">
        <button
          className="btn-agregar"
          onClick={() => navigate("/admin/registro-categorias/nueva")}
        >
          <Plus size={18} />
          Agregar
        </button>

        <table className="tabla-categorias">
          <thead>
            <tr>
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
                  <td>{cat.area?.nombre || "-"}</td>
                  <td>{cat.nombre}</td>
                  <td>
                    {cat.grado_inicial?.nombre} - {cat.grado_final?.nombre}
                  </td>
                  <td className="acciones">
                    <Link
                      to={`/admin/registro-categorias/editar/${cat.nivel_categoria_id}`}
                      className="boton-icono"
                    >
                      <Edit size={20} color="white" />
                    </Link>
                    <button
                      className="boton-icono"
                      onClick={() => abrirModal(cat)}
                    >
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
          <div className="pagination">
            <button onClick={() => goToPage(currentPage - 1)}>{"<"}</button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => goToPage(i + 1)}
                className={currentPage === i + 1 ? "active" : ""}
              >
                {i + 1}
              </button>
            ))}
            <button onClick={() => goToPage(currentPage + 1)}>{">"}</button>
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
    </div>
  );
}

export default RegistroCategoria;
