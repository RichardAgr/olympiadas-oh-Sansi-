import { useEffect, useState } from "react";
import perfilDefault from "../../assets/perfil-default.png";
import correoIcon from "../../assets/email.png";
import telefonoIcon from "../../assets/telefono.png";
import ciIcon from "../../assets/ci.png";
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

    axios
      .get(`http://127.0.0.1:8000/api/VerMiPerfil/${userId}/Responsable`)
      .then((res) => setPerfil(res.data))
      .catch((err) => {
        console.error("Error al obtener el perfil:", err);
        setError("Error al cargar el perfil.");
      });
  }, [userId]);

  if (error) return <p className="mensaje-error">{error}</p>;
  if (!perfil) return <p>Cargando perfil...</p>;

  return (
    <div className="perfil-container">
      <h1 className="titulo-pagina">Detalles del Perfil</h1>

      <div className="card-perfil">
        <img src={perfilDefault} alt="Foto de perfil" className="imagen-perfil" />

        <div className="info-personal">
          <div className="campo">
            <label>Nombre:</label>
            <div className="valor">{perfil.nombres}</div>
          </div>

          <div className="campo">
            <label>Apellido:</label>
            <div className="valor">{perfil.apellidos}</div>
          </div>
        </div>
      </div>

      <div className="card-perfil vertical">
        <div className="campo">
          <label>Correo:</label>
          <div className="valor">
            <img src={correoIcon} alt="Correo" className="icono" />
            {perfil.correo_electronico}
          </div>
        </div>

        <div className="campo">
          <label>Teléfono:</label>
          <div className="valor">
            <img src={telefonoIcon} alt="Teléfono" className="icono" />
            {perfil.telefono}
          </div>
        </div>

        <div className="campo">
          <label>CI:</label>
          <div className="valor">
            <img src={ciIcon} alt="Carnet" className="icono" />
            {perfil.ci}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MiPerfilRespGestion;

