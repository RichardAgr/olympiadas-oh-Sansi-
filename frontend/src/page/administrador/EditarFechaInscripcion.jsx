import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { es } from 'date-fns/locale';
import axiosInstance from "../../interceptor/interceptor";
import { ENDPOINTS } from "../../api/constans/endpoints";
import './EditarFechaInscripcion.css';

const EditarFechaInscripcion = () => {
  const { area_id } = useParams();
  const [area, setArea] = useState(null);
  const [fechaInscripcionInicio, setFechaInscripcionInicio] = useState(null);
  const [fechaInscripcionFin, setFechaInscripcionFin] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (area_id && !isNaN(area_id)) {
      setLoading(true);
      axiosInstance.get(`${ENDPOINTS.GET_AREAS}/${area_id}`)
        .then(response => {
          setArea(response.data);
        })
        .catch(error => {
          console.error("Error al cargar el área:", error);
          setError("Error al cargar el área.");
        })
        .finally(() => setLoading(false));
    } else {
      setError("ID de área no válido.");
      setLoading(false);
    }
  }, [area_id]);

  const handleAtras = () => {
    navigate('/registro-fechas');
  };

  const handleGuardar = () => {
    if (fechaInscripcionInicio && fechaInscripcionFin) {
      const fechaInscripcionInicioMySQL = fechaInscripcionInicio.toISOString().slice(0, 19).replace('T', ' ');
      const fechaInscripcionFinMySQL = fechaInscripcionFin.toISOString().slice(0, 19).replace('T', ' ');

      const datosCronograma = {
        area_id: area_id,
        competencia_id: area_id,  // Asignamos competencia_id = area_id automáticamente
        fecha_inicio: fechaInscripcionInicioMySQL,
        fecha_fin: fechaInscripcionFinMySQL,
        tipo_evento: "Inscripción",
        nombre_evento: "Inscripción General",
        descripcion: "Descripción no proporcionada",
        anio_olimpiada: new Date().getFullYear(),
      };

      console.log("Datos a enviar:", datosCronograma);

      axiosInstance.post(ENDPOINTS.CRONOGRAMA, datosCronograma)
        .then(response => {
          console.log("Fecha guardada correctamente:", response.data);
          navigate('/registro-fechas');
        })
        .catch(error => {
          console.error("Error al guardar la fecha:", error.response?.data || error);
          alert(`Ocurrió un error: ${JSON.stringify(error.response?.data)}`);
        });
    } else {
      alert('Selecciona ambas fechas');
    }
  };

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>{error}</p>;
  if (!area) return <p>Área no encontrada</p>;

  return (
    <div className="editar-fecha-inscripcion">
      <h2>Fecha de Inscripción</h2>
      <label>Área: {area.nombre}</label>

      <div className="fecha-container">
        <div className="fecha-item">
          <label>Inicia:</label>
          <DatePicker 
            selected={fechaInscripcionInicio} 
            onChange={date => setFechaInscripcionInicio(date)} 
            locale={es}  
            dateFormat="yyyy-MM-dd" 
          />
        </div>
        <div className="fecha-item">
          <label>Finaliza:</label>
          <DatePicker 
            selected={fechaInscripcionFin} 
            onChange={date => setFechaInscripcionFin(date)} 
            locale={es}  
            dateFormat="yyyy-MM-dd" 
          />
        </div>
      </div>

      <div className="botones">
        <button className="boton-atras" onClick={handleAtras}>Atrás</button>
        <button className="boton-guardar" onClick={handleGuardar}>Guardar</button>
      </div>
    </div>
  );
};

export default EditarFechaInscripcion;