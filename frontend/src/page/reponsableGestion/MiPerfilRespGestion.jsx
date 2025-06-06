import { useEffect, useState } from "react";
import axios from "axios";
import "./MiPerfilRespGestion.css";

function MiPerfilRespGestion() {
  const [perfil, setPerfil] = useState(null);
  const [error, setError] = useState(null);

  const userId = JSON.parse(localStorage.getItem("user"))?.responsable_id;

  useEffect(() => {
    if (!userId) {
      setError("No se encontró el ID del usuario.");
      return;
    }

    axios.get(`http://127.0.0.1:8000/api/VerMiPerfil/${userId}/Responsable`)
      .then((res) => setPerfil(res.data))
      .catch((err) => {
        console.error(" Error:", err);
        setError("Error al cargar el perfil.");
      });
  }, [userId]);

  if (error) return <p>{error}</p>;
  if (!perfil) return <p>Cargando perfil...</p>;

  return (
    <div className="perfil-container">
      <h2 className="titulo-pagina">Mi Perfil</h2>
      <div className="card-perfil">
        <img
          src="/default-user.png"
          alt="Imagen de perfil"
          className="imagen-perfil"
        />
        <div className="info-personal">
          <div className="campo">
            <label>Nombre:</label>
            <div className="valor">{perfil.nombres}</div>
          </div>
          <div className="campo">
            <label>Apellido:</label>
            <div className="valor">{perfil.apellidos}</div>
          </div>
          <div className="campo">
            <label>Correo:</label>
            <div className="valor">{perfil.correo_electronico}</div>
          </div>
          <div className="campo">
            <label>Teléfono:</label>
            <div className="valor">{perfil.telefono}</div>
          </div>
          <div className="campo">
            <label>CI:</label>
            <div className="valor">{perfil.ci}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MiPerfilRespGestion;
