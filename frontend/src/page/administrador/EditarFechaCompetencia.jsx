import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';  // Usamos useParams para obtener el id de la URL
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { es } from 'date-fns/locale';  // Importamos el idioma español de date-fns
import './EditarFechaCompetencia.css';

const EditarFechaCompetencia = () => {
  const { id } = useParams(); // Obtiene el id de la URL
  const [competencia, setCompetencia] = useState(null);
  const [fechaCompetenciaInicio, setFechaCompetenciaInicio] = useState(null);
  const [fechaCompetenciaFin, setFechaCompetenciaFin] = useState(null);
  const navigate = useNavigate();  // Para navegación

  // Aquí simulas la carga de datos, como si viniera de un API
  const competencias = [
    { id: 1, nombre: 'Fútbol', fechaCompetenciaInicio: new Date('2025-04-01'), fechaCompetenciaFin: new Date('2025-04-10') },
    { id: 2, nombre: 'Baloncesto', fechaCompetenciaInicio: new Date('2025-04-05'), fechaCompetenciaFin: new Date('2025-04-15') },
  ];

  useEffect(() => {
    const competenciaSeleccionada = competencias.find(competencia => competencia.id === parseInt(id)); // Busca la competencia con el id
    if (competenciaSeleccionada) {
      setCompetencia(competenciaSeleccionada);
      setFechaCompetenciaInicio(competenciaSeleccionada.fechaCompetenciaInicio);
      setFechaCompetenciaFin(competenciaSeleccionada.fechaCompetenciaFin);
    }
  }, [id]);

  // Función para retroceder a la página anterior
  const handleAtras = () => {
    navigate('/registro-fechas');  // Aquí puedes colocar la ruta a la que quieres navegar
  };

  const handleGuardar = () => {
    if (fechaCompetenciaInicio && fechaCompetenciaFin) {
      // Redirigimos a la página de registro de fechas
      navigate('/registro-fechas');
    } else {
      alert('Selecciona ambas fechas');
    }
  };

  if (!competencia) return <p>Cargando...</p>;

  return (
    <div className="editar-fecha-competencia">
      <h2>Fecha de Competencia</h2>
      <label>Competencia: {competencia.nombre}</label>

      {/* Contenedor para las fechas alineadas lado a lado */}
      <div className="fecha-container">
        <div className="fecha-item">
          <label>Inicia:</label>
          <DatePicker 
            selected={fechaCompetenciaInicio || new Date()} 
            onChange={date => setFechaCompetenciaInicio(date)} 
            locale={es}  // Establecer idioma español
          />
        </div>
        <div className="fecha-item">
          <label>Finaliza:</label>
          <DatePicker 
            selected={fechaCompetenciaFin || new Date()} 
            onChange={date => setFechaCompetenciaFin(date)} 
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

export default EditarFechaCompetencia;
