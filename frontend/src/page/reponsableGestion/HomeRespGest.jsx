import React from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
function HomeRespGest() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Bienvenido al Home Responsable</h1>
      <p>Selecciona una opción:</p>

      <div>
        <Link to={"/respGest/DetalleCompetidoresInscritos"}>
        <button style={{ margin: "10px", padding: "10px" }}>DetalleCompetidoresInscritos</button>
        </Link>
        <Link to={"/respGest/EstadoTutores"}>
        <button style={{ margin: "10px", padding: "10px" }}>Deshabilitar/Habilitar Tutores</button>
        </Link>
        <button style={{ margin: "10px", padding: "10px" }}>Botón 3</button>
        <button style={{ margin: "10px", padding: "10px" }}>Botón 4</button>
      </div>
    </div>
  );
}

export default HomeRespGest;
