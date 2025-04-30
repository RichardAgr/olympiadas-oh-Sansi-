import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import "./EditarCompetidores.css";
import { CheckCheck } from 'lucide-react';

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/JOSE/competidores.json");
        const competidorEncontrado = response.data.find(
          (c) => c.competidor_id === parseInt(idCompetidor)
        );

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
  }, [idCompetidor]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowConfirmationModal(true);
  };

  const confirmSave = async () => {
    setShowConfirmationModal(false);
    setLoading(true);

    try {
      //await axios.put(`/api/competidores/${idCompetidor}`, competidor);
      setShowSuccessModal(true);

      setTimeout(() => {
        setShowSuccessModal(false);
        navigate(`/homeTutor/${tutorId}/tutor/ListaCompetidores`);
      }, 2000);
    } catch (err) {
      setError(err.message || "Error al actualizar los datos");
    } finally {
      setLoading(false);
    }
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
  };

  const handleCancel = () => {
    navigate(`/homeTutor/${tutorId}/tutor/ListaCompetidores`);
  };

  if (loading && !competidor.nombres) {
    return <div>Cargando datos del competidor...</div>;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
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
        </div>

        <div className="form-group">
          <label htmlFor="ci">CI del competidor:</label>
          <input
            type="text"
            id="ci"
            value={competidor.ci}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="fechaNacimiento">Fecha de Nacimiento:</label>
          <input
            type="date"
            id="fechaNacimiento"
            value={competidor.fechaNacimiento}
            onChange={handleChange}
            required
          />
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
          <input
            type="text"
            id="departamento"
            value={competidor.departamento}
            onChange={handleChange}
            required
          />
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
        </div>

        <div className="form-group">
          <label>Áreas Inscritas:</label>
          <div className="read-only-field">
            {competidor.areasInscritas.split(",").map((area) => (
              <span key={area} className="area-tag">
                {area.trim()}
              </span>
            ))}
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
