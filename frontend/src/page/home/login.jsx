import React from "react";
import { Link } from "react-router-dom";
function login() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>LOGIN</h1>
      <p>Selecciona una opción:</p>
      <p>Para volver de nuevo a esta pagina dar click al "Ir a Login" en el Footer General:</p>

      <div>
        <Link to={
            "/admin"
        }>
        <button style={{ margin: "10px", padding: "10px" }}>Administrador</button>
        </Link>
        <Link to={"/respGest"}>
        <button style={{ margin: "10px", padding: "10px" }}>Responsable de Gestion</button>
        </Link>
        <Link to={"/tutor/${id}"}>
        <button style={{ margin: "10px", padding: "10px" }}>Tutor</button>
        </Link>
        
      </div>
    </div>
  );
}

export default login;