import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function MiPerfil() {
  const { id } = useParams();
  const navigate = useNavigate();  // Para manejar la navegación programáticamente

  return (
    <div>
      <h1>Perfil Tutor</h1>
      <p>Mostrando competidores para el tutor con ID: {id}</p>
    </div>
  ); 
}

export default MiPerfil;
