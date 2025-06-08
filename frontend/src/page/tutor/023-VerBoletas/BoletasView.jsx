import { useParams } from 'react-router-dom';
import { useState, useEffect } from "react";
import { Loader, AlertTriangle, X } from "lucide-react";
import axios from 'axios'
import "./boletasView.css";

function BoletasView() {
  const [boletas, setBoletas] = useState([]);
  const [nombreTutor, setNombreTutor] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState("");

  const { id } = useParams();

  useEffect(() => {
    const fetchTutorData = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/tutor/${id}/boletas`);
        setBoletas(response.data.boletas);
        setNombreTutor(response.data.tutor.nombre_completo);
        setLoading(false);
      } catch (err) {
        console.error("Error al obtener las boletas del tutor:", err);
        setError("No se pudieron cargar las boletas del tutor");
        setLoading(false);
      }
    };
    
    fetchTutorData();
  }, [id]);

  const handleViewComprobante = (imageUrl) => {
    setCurrentImage(imageUrl);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setCurrentImage("");
  };

  const LoadingSpinner = () => {
    return (
      <div className="loading-container">
        <Loader size={40} className="spinner" />
        <p>Cargando datos...</p>
      </div>
    );
  };

  const ErrorMessage = ({ message }) => {
    return (
      <div className="error-container">
        <AlertTriangle size={48} className="error-icon" />
        <h2>Error</h2>
        <p>{message}</p>
      </div>
    );
  };

  return (
    <div className="boletas-container">
      <div className="boletas-header">
        <h1>Boletas de Pago</h1>
        <div className="tutor-info">
          <span>Tutor: {nombreTutor}</span>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : (
        <div className="table-wrapper">
          <table className="boletas-table">
            <thead>
              <tr>
                <th>Área</th>
                <th>Nro. Comprobante</th>
                <th>Monto(Bs)</th>
                <th>Cantidad de competidores</th>
                <th>Fecha de pago</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {boletas.map((boleta, index) => (
                <tr key={index}>
                  <td>{boleta.area}</td>
                  <td>{boleta.numero_comprobante}</td>
                  <td>{boleta.monto}</td>
                  <td>{boleta.cantidad_competidores}</td>
                  <td>{boleta.fecha_pago}</td>
                  <td>
                    <button 
                      className="ver-comprobante-btn"
                      onClick={() => handleViewComprobante(boleta.imagen_url)}
                    >
                      Ver Comprobante
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}


{modalOpen && (
              <div className="receipt-image-modal">
                <div className="receipt-image-container">
                  <button className="close-receipt" onClick={closeModal}>
                    <X size={20} />
                  </button>
                  <h3>Comprobante de Pago</h3>
                  <img
                    src={currentImage|| "/placeholder.svg"}
                    alt="Comprobante de pago"
                    className="receipt-img"
                  />
                </div>
              </div>
            )}
    </div>
  );
}

export default BoletasView;