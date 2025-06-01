import { useEffect, useState } from "react";
import axios from "axios";
import "./RegistroCategoria.css";
import { Edit, Trash2, Plus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import ModalEliminarCategoria from "../../../components/ModalEliminarCategoria";

function RegistroCategoria() {
  const [categorias, setCategorias] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  const navigate = useNavigate();

  const [modalAbierto, setModalAbierto] = useState(false);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/nivel-categorias")
      .then((response) => {
        console.log("Datos de categorías recibidos:", response.data);
        setCategorias(response.data);
      })
      .catch((error) => {
        console.error("Error al cargar categorías:", {
          errorMessage: error.message,
          errorData: error.response?.data,
        });
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
      console.log(
        "ID enviado para eliminar:",
        categoriaSeleccionada.nivel_categoria_id
      );

      const response = await axios.delete(
        `http://localhost:8000/api/nivel-categorias/${categoriaSeleccionada.nivel_categoria_id}`
      );

      console.log("Datos de respuesta:", response.data);

      alert("Categoría eliminada correctamente ✅");

      setCategorias((prev) =>
        prev.filter(
          (cat) =>
            cat.nivel_categoria_id !== categoriaSeleccionada.nivel_categoria_id
        )
      );

      cerrarModal();
    } catch (error) {
      console.error("Datos del error:", error.response?.data || error.message);
      alert("❌ Error al eliminar la categoría.");
      cerrarModal();
    }
  };

  const categoriasFiltradas = categorias.filter(
    (cat) =>
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
    <div className="registro-categoria-containerLi">
      <h5>Gestión de Categorías de Competencia</h5>

      {/* Buscador */}
      <div className="buscador-wrapperLi">
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

      <div className="tabla-categorias-wrapperLi">
        <button
          className="btn-agregarLi"
          onClick={() => navigate("/admin/registro-categorias/nueva")}
        >
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
                  <td>{cat.area?.nombre || "-"}</td>
                  <td className="accionesLi2">{cat.nombre}</td>
                  <td>
                    {cat.grado_inicial?.nombre} - {cat.grado_final?.nombre}
                  </td>
                  <td className="accionesLi">
                    <Link
                      to={`/admin/registro-categorias/editar/${cat.nivel_categoria_id}`}
                      className="boton-iconoLi"
                    >
                      <Edit size={20} color="white" />
                    </Link>
                    <button
                      className="boton-iconoLi"
                      onClick={() => abrirModal(cat)}
                    >
                      <Trash2 size={20} color="white" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="4"
                  style={{ textAlign: "center", padding: "1rem" }}
                >
                  No hay categorías registradas.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="paginationLi">
            <button onClick={() => goToPage(currentPage - 1)}>{"<"}</button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => goToPage(i + 1)}
                className={currentPage === i + 1 ? "activeLi" : ""}
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
