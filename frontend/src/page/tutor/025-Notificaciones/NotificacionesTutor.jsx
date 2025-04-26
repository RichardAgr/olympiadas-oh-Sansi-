import React from 'react';
import { useParams} from 'react-router-dom';

function NotificacionesTutor() {
  const { id } = useParams();


  return (
    <div>
      <h1>Notificaciones</h1>
      <p>Mostrando competidores para el tutor con ID: {id}</p>
    </div>
  ); 
}

export default NotificacionesTutor;
