import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import "./EditarCompetidores.css";
import { CheckCheck } from "lucide-react";

function EditarCompetidores() {
  const { id: tutorId, idCompetidor } = useParams();
  const navigate = useNavigate();
  const [competidor, setCompetidor] = useState({
    nombres: "",
    apellidos: "",
    ci: "",
    fechaNacimiento: "",
    colegio: "",
    curso: "",
    departamento: "",
    provincia: "",
    areasInscritas: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/informacionCompetidores/${idCompetidor}/competidor`
        );
        const competidorEncontrado = response.data.informacion_competidor;

        if (!competidorEncontrado) {
          throw new Error("Competidor no encontrado");
        }

        setCompetidor(competidorEncontrado);
      } catch (err) {
        setError(err.message || "Error al cargar datos");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [idCompetidor, tutorId]);

  const validateForm = () => {
    const newErrors = {};

    if (competidor.nombres.trim().length < 3)
      newErrors.nombres = "Debe tener al menos 3 caracteres.";
    if (competidor.apellidos.trim().length < 6)
      newErrors.apellidos = "Debe tener al menos 6 caracteres.";
    if (competidor.ci.trim().length < 7)
      newErrors.ci = "Debe tener al menos 7 caracteres.";
    if (competidor.departamento.trim().length < 4)
      newErrors.departamento = "Debe tener al menos 4 caracteres.";
    if (competidor.provincia.trim().length < 4)
      newErrors.provincia = "Debe tener al menos 4 caracteres.";

    // Validación de fecha de nacimiento
    if (!competidor.fecha_nacimiento) {
      newErrors.fecha_nacimiento = "La fecha de nacimiento es requerida";
    } else {
      const birthDate = new Date(competidor.fecha_nacimiento);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }

      if (age < 5 || age > 18) {
        newErrors.fecha_nacimiento = "La edad debe estar entre 5 y 18 años";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setShowConfirmationModal(true);
    }
  };

  const confirmSave = async () => {
    setShowConfirmationModal(false);
    setLoading(true);
  
    try {
      // Formatear la fecha antes de enviarla
      const formattedDate = formatDateForAPI(competidor.fecha_nacimiento);
      
      await axios.put(
        `http://127.0.0.1:8000/api/tutor/editarCompetidor/${idCompetidor}`,
        {
          nombres: competidor.nombres,
          apellidos: competidor.apellidos,
          ci: competidor.ci,
          fechaNacimiento: formattedDate, // Usar la fecha formateada
          departamento: competidor.departamento,
          provincia: competidor.provincia,
        }
      );
      setShowSuccessModal(true);
      setTimeout(() => {
        setShowSuccessModal(false);
        navigate(-1);
      }, 2000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Error al actualizar los datos"
      );
    } finally {
      setLoading(false);
    }
  };
  
  // Función para formatear la fecha para la API
  const formatDateForAPI = (dateString) => {
    if (!dateString) return "";
    
    // Si ya está en formato YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return dateString;
    }
  
    // Para formato "dd/mm/yyyy" o "dd-mm-yyyy"
    if (dateString.includes("/") || dateString.includes("-")) {
      const [day, month, year] = dateString.split(/[/-]/);
      return `${year.padStart(4, "20")}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }
  
    // Para otros formatos, devuelve una cadena vacía o maneja según sea necesario
    return "";
  };

  const cancelSave = () => {
    setShowConfirmationModal(false);
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setCompetidor((prev) => ({
      ...prev,
      [id]: value,
    }));

    if (errors[id]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[id];
        return newErrors;
      });
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const formatDateForInput = (dateString) => {
    if (!dateString) return "";

    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return dateString;
    }

    // Para formato "dd/mm/yyyy" o "dd-mm-yyyy"
    if (dateString.includes("/") || dateString.includes("-")) {
      const [day, month, year] = dateString.split(/[/-]/);
      return `${year.padStart(4, "20")}-${month.padStart(
        2,
        "0"
      )}-${day.padStart(2, "0")}`;
    }

    // Para formato "ddmmyy" (como "06/06/07")
    if (dateString.length === 8 && dateString.includes("/")) {
      const [day, month, year] = dateString.split("/");
      return `20${year.padStart(2, "0")}-${month.padStart(
        2,
        "0"
      )}-${day.padStart(2, "0")}`;
    }

    return "";
  };

  if (loading && !competidor.nombres) {
    return <div>Cargando datos del competidor...</div>;
  }

  if (error) {
    return <div className="error-message2">Error: {error}</div>;
  }

  return (
    <div className="editar-competidor-container">
      <h1>Datos del Competidor</h1>

      <form className="competidor-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="nombres">Nombres del competidor:</label>
          <input
            type="text"
            id="nombres"
            value={competidor.nombres}
            onChange={handleChange}
            required
          />
          {errors.nombres && (
            <span className="error-message2">{errors.nombres}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="apellidos">Apellidos del competidor:</label>
          <input
            type="text"
            id="apellidos"
            value={competidor.apellidos}
            onChange={handleChange}
            required
          />
          {errors.apellidos && (
            <span className="error-message2">{errors.apellidos}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="ci">CI del competidor:</label>
          <input
            type="text"
            id="ci"
            value={competidor.ci}
            onChange={(e) => {
              // Validación para aceptar solo números
              if (/^\d*$/.test(e.target.value)) {
                handleChange(e);
              }
            }}
            required
          />
          {errors.ci && <span className="error-message2">{errors.ci}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="fechaNacimiento">Fecha de Nacimiento:</label>
          <input
            type="date"
            id="fecha_nacimiento"
            name="fecha_nacimiento"
            value={formatDateForInput(competidor.fecha_nacimiento)}
            onChange={handleChange}
            required
          />
          {errors.fecha_nacimiento && (
            <span className="error-message2">{errors.fecha_nacimiento}</span>
          )}
        </div>

        <div className="form-group">
          <label>Colegio:</label>
          <div className="read-only-field">{competidor.colegio}</div>
        </div>

        <div className="form-group">
          <label>Curso:</label>
          <div className="read-only-field">{competidor.curso}</div>
        </div>

        <div className="form-group">
          <label htmlFor="departamento">Departamento:</label>
          <select
            id="departamento"
            value={competidor.departamento}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione un departamento</option>
            <option value="Beni">Beni</option>
            <option value="Chuquisaca">Chuquisaca</option>
            <option value="Cochabamba">Cochabamba</option>
            <option value="La Paz">La Paz</option>
            <option value="Oruro">Oruro</option>
            <option value="Pando">Pando</option>
            <option value="Potosí">Potosí</option>
            <option value="Santa Cruz">Santa Cruz</option>
            <option value="Tarija">Tarija</option>
          </select>
          {errors.departamento && (
            <span className="error-message2">{errors.departamento}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="provincia">Provincia:</label>
          <input
            type="text"
            id="provincia"
            value={competidor.provincia}
            onChange={handleChange}
            required
          />
          {errors.provincia && (
            <span className="error-message2">{errors.provincia}</span>
          )}
        </div>

        <div className="form-group">
          <label>Áreas Inscritas:</label>
          <div className="read-only-field">
            <span className="area-tag">{competidor.area}</span>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="cancel-button"
            onClick={handleCancel}
            disabled={loading}
          >
            Cancelar
          </button>
          <button type="submit" className="save-button" disabled={loading}>
            {loading ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </form>

      {/* Modal de Confirmación */}
      {showConfirmationModal && (
        <div className="modal-overlay">
          <div className="modal">
            <button className="cerrar" onClick={cancelSave}>
              ×
            </button>
            <h2>¿Está seguro de Guardar?</h2>
            <div className="modal-actions">
              <button className="modal-button no-button" onClick={cancelSave}>
                No
              </button>
              <button className="modal-button yes-button" onClick={confirmSave}>
                Sí
              </button>
            </div>
          </div>
        </div>
      )}

      {showSuccessModal && (
        <div className="modal-overlay">
          <div className="modal success-modal">
            <h2>Cambios guardados con éxito</h2>

            <div className="success-icon-container">
              <CheckCheck className="success-icon" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EditarCompetidores;
