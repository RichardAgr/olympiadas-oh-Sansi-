import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';  // Usamos useParams para obtener el id de la URL
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { es } from 'date-fns/locale';  // Importamos el idioma español de date-fns
import './EditarFechaInscripcion.css';

const EditarFechaInscripcion = () => {
  const { id } = useParams(); // Obtiene el id de la URL
  const [area, setArea] = useState(null);
  const [fechaInscripcionInicio, setFechaInscripcionInicio] = useState(null);
  const [fechaInscripcionFin, setFechaInscripcionFin] = useState(null);
  const navigate = useNavigate();  // Para navegación

  // Aquí simulas la carga de datos, como si viniera de un API
  const areas = [
    { id: 1, nombre: 'Astronomía', fechaInscripcionInicio: new Date('2025-04-01'), fechaInscripcionFin: new Date('2025-04-10') },
    { id: 2, nombre: 'Biología', fechaInscripcionInicio: new Date('2025-04-05'), fechaInscripcionFin: new Date('2025-04-15') },
  ];

  useEffect(() => {
    const areaSeleccionada = areas.find(area => area.id === parseInt(id)); // Busca el área con el id
    if (areaSeleccionada) {
      setArea(areaSeleccionada);
      setFechaInscripcionInicio(areaSeleccionada.fechaInscripcionInicio);
      setFechaInscripcionFin(areaSeleccionada.fechaInscripcionFin);
    }
  }, [id]);

  // Función para retroceder a la página anterior
  const handleAtras = () => {
    navigate('/registro-fechas');  // Aquí puedes colocar la ruta a la que quieres navegar
  };

  const handleGuardar = () => {
    if (fechaInscripcionInicio && fechaInscripcionFin) {
      // Redirigimos a la página de registro de fechas
      navigate('/registro-fechas');
    } else {
      alert('Selecciona ambas fechas');
    }
  };

  if (!area) return <p>Cargando...</p>;

  return (
    <div className="editar-fecha-inscripcion">
      <h2>Fecha de Inscripción</h2>
      <label>Área: {area.nombre}</label>

      {/* Contenedor para las fechas alineadas lado a lado */}
      <div className="fecha-container">
        <div className="fecha-item">
          <label>Inicia:</label>
          <DatePicker 
            selected={fechaInscripcionInicio || new Date()} 
            onChange={date => setFechaInscripcionInicio(date)} 
            locale={es}  // Establecer idioma español
          />
        </div>
        <div className="fecha-item">
          <label>Finaliza:</label>
          <DatePicker 
            selected={fechaInscripcionFin || new Date()} 
            onChange={date => setFechaInscripcionFin(date)} 
            locale={es}  // Establecer idioma español
          />
        </div>
      </div>

      {/* Contenedor para los botones */}
      <div className="botones">
        <button className="boton-atras" onClick={handleAtras}>Atrás</button>
        <button className="boton-guardar" onClick={handleGuardar}>Guardar</button>
      </div>
    </div>
  );
};

export default EditarFechaInscripcion;
