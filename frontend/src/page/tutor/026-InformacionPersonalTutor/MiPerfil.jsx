import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import perfilDefault from '../../../assets/perfil-default.png';
import correoIcon from '../../../assets/email.png'; 
import telefonoIcon from '../../../assets/telefono.png'; 
import ciIcon from '../../../assets/ci.png';
import axios from 'axios';
import './MiPerfil.css';

function MiPerfil() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [datosTutor, setDatosTutor] = useState(null);
  
  useEffect(() => {
    try {
      const getDataTutor = async ()=>{
        const response = await axios.get(`http://127.0.0.1:8000/api/VerMiPerfil/${id}/Tutor`)
        setDatosTutor(response.data)
      }
      getDataTutor()
    } catch (error) {
      console.log('Error cargando datos del tutor:', error)
    }
  }, [id]);


  if (!datosTutor) {
    return <p>Cargando datos del tutor...</p>;
  }

  return (
    <div className="perfil-container">
      <h1 className="titulo-pagina">Detalles del Perfil</h1>
      <div className="card-perfil">
        <img src={perfilDefault} alt="Foto de perfil" className="imagen-perfil" />
        <div className="info-personal">
          <div className="campo">
            <label>Nombre :</label>
            <div className="valor">{datosTutor.nombres}</div>
          </div>
          <div className="campo">
            <label>Apellido :</label>
            <div className="valor">{datosTutor.apellidos}</div>
          </div>
        </div>
      </div>
      <div className="card-perfil vertical">
        <div className="campo">
          <label>Correo :</label>
          <div className="valor">
            <img src={correoIcon} alt="Correo" className="icono" />
            {datosTutor.correo_electronico}
          </div>
        </div>
        <div className="campo">
          <label>Teléfono :</label>
          <div className="valor">
            <img src={telefonoIcon} alt="Teléfono" className="icono" />
            {datosTutor.telefono}
          </div>
        </div>
        <div className="campo">
          <label>Número de Carnet :</label>
          <div className="valor">
            <img src={ciIcon} alt="Carnet de Identidad" className="icono" />
            {datosTutor.ci}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MiPerfil;
