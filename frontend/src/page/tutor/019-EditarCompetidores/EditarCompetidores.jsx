import React from 'react';
import { Link, useParams } from 'react-router-dom';

function EditarCompetidores() {
  const { id, idCompetidor } = useParams();

  return (
    <div>
      <h1>Editar Competidores</h1>
      <p>Mostrando competidores para el tutor con ID: {id}</p>
      <p>Competidor Id: {idCompetidor}</p>
    </div>
  ); 
}

export default EditarCompetidores;