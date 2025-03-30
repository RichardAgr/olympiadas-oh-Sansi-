import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { es } from 'date-fns/locale';
import axiosInstance from "../../interceptor/interceptor";
import { ENDPOINTS } from "../../api/constans/endpoints";
import './EditarFechaCompetencia.css';

const EditarFechaCompetencia = () => {
  const [fechaCompetenciaInicio, setFechaCompetenciaInicio] = useState(null);
  const navigate = useNavigate(); 

  // Función para retroceder a la página anterior
  const handleAtras = () => {
    navigate('/registro-fechas');  
  };

  const handleGuardar = () => {
    if (fechaCompetenciaInicio) {
      // Convertimos la fecha a formato compatible con MySQL (YYYY-MM-DD HH:MM:SS)
      const fechaFormatoMySQL = fechaCompetenciaInicio.toISOString().slice(0, 19).replace('T', ' ');
  
      const datosCompetencia = {
        fecha_inicio: fechaFormatoMySQL,  // Fecha en formato compatible con MySQL
        estado: 1,  // Usamos 1 para 'activo'
      };
  
      // Realizamos la solicitud para guardar la fecha de competencia
      axiosInstance.post(`${ENDPOINTS.COMPETENCIA}`, datosCompetencia)
        .then(response => {
          console.log("Fecha de competencia registrada correctamente:", response.data);
          navigate('/registro-fechas');  // Redirigir a la página de registro de fechas
        })
        .catch(error => {
          if (error.response) {
            // Imprimir los errores específicos de validación
            console.log("Errores de validación:", error.response.data.errors);
            alert(`Ocurrió un error al guardar la fecha: ${error.response.data.message || JSON.stringify(error.response.data.errors)}`);
          } else if (error.request) {
            // Error cuando no se recibe respuesta del servidor
            console.error("Error de red: No se recibió respuesta del servidor.");
            alert("Error de red. No se recibió respuesta del servidor.");
          } else {
            // Error desconocido
            console.error("Error desconocido:", error);
            alert("Error de red o configuración del servidor.");
          }
        });
    } else {
      alert('Selecciona la fecha');
    }
  };

  return (
    <div className="editar-fecha-competencia">
      <h2>Registrar Fecha de Competencia</h2>

      <div className="fecha-container">
        <div className="fecha-item">
          <label>Fecha de inicio:</label>
          <DatePicker 
            selected={fechaCompetenciaInicio} 
            onChange={date => setFechaCompetenciaInicio(date)} 
            locale={es}  
            dateFormat="yyyy/MM/dd"  
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

export default EditarFechaCompetencia;