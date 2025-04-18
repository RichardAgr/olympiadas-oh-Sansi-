import React from "react";

function DetalleCompetidoresInscritos() {
  return (
    <div >
      <h1>Detalle Competidores Inscritos</h1>
       {/* Buscador + Filtro */}
       <div className="buscador">
        <input
          type="text"
          placeholder="Buscar por nombre"
        />
      </div>
        {/* Tabla */}
      <div className="contenedor-tabla">
        <table className="tabla">
          <thead>
            <tr>
              <th>Nombre Estudiante</th>
              <th>Colegio</th>
              <th>CI</th>
              <th>Curso</th>
              <th>Estado</th>
              <th>Competencia</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            
          </tbody>
        </table>

      </div>
    </div>
  );
}

export default DetalleCompetidoresInscritos;