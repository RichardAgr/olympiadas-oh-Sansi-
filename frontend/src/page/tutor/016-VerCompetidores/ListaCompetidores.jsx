import React from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';

function ListaCompetidores() {
  const { id } = useParams();
  const navigate = useNavigate();  // Para manejar la navegación programáticamente
  // Función para redirigir al usuario
  const handleEditCompetidor = () => {
    navigate(`/tutor/${id}/ListaCompetidores/editarCompetidores`);
  };

  return (
    <div>
      <h1>Lista de Competidores</h1>
      <p>Mostrando competidores para el tutor con ID: {id}</p>
      <button className="btn btn-primary" onClick={handleEditCompetidor}>
        Editar Competidor
      </button>
    </div>
  ); 
}

export default ListaCompetidores;
