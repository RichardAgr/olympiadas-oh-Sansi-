import React, { useState, useEffect } from 'react';
import { useNavigate} from 'react-router-dom';
import './Configuracion.css';
import perfilDefault from '../../../assets/perfil-default.png';
import correoIcon from '../../../assets/email.png';
import telefonoIcon from '../../../assets/telefono.png';
import ciIcon from '../../../assets/ci.png';
import AceptarCambiosIcon from '../../../assets/AceptarCambios.png';
import ConfirmacionIcon from '../../../assets/Confirmacion.png';
import axios from 'axios';

function Configuracion() {
  const navigate = useNavigate();

  // Estado para los datos del tutor
  const [datosTutor, setDatosTutor] = useState({});
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [exito, setExito] = useState(false);

  // Cargar datos desde el archivo JSON usando Axios
  useEffect(() => {
    axios.get('/datosTutor.json')
      .then(response => {
        setDatosTutor(response.data);
      })
      .catch(error => {
        console.error("Hubo un error al cargar los datos del tutor:", error);
      });
  }, []);

  const handleChange = (e) => {
    setDatosTutor({ ...datosTutor, [e.target.name]: e.target.value });
  };

  const confirmarGuardado = () => {
    setMostrarConfirmacion(true);
  };

  const guardarCambios = () => {
    setMostrarConfirmacion(false);
    setExito(true);
    console.log("Datos guardados:", datosTutor);
  };

  const volverHome = () => {
    navigate('/homeTutor/${id}/tutor');
  };

  return (
    <div className="perfil-container">
      <h1 className="titulo-pagina">Editar Perfil</h1>

      {/* Card 1 */}
      <div className="card-perfil">
        <img src={perfilDefault} alt="Foto de perfil" className="imagen-perfil" />

        <div className="info-personal">
          <div className="campo">
            <label>Nombre :</label>
            <div className="input-con-icono">
              <input
                type="text"
                name="nombre"
                value={datosTutor.nombre || ''}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="campo">
            <label>Apellido :</label>
            <div className="input-con-icono">
              <input
                type="text"
                name="apellido"
                value={datosTutor.apellido || ''}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Card 2 */}
      <div className="card-perfil vertical">
        <div className="campo">
          <label>Correo :</label>
          <div className="input-con-icono">
            <img src={correoIcon} alt="Correo" className="icono" />
            <input
              type="email"
              name="correo"
              value={datosTutor.correo || ''}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="campo">
          <label>Teléfono :</label>
          <div className="input-con-icono">
            <img src={telefonoIcon} alt="Teléfono" className="icono" />
            <input
              type="tel"
              name="telefono"
              value={datosTutor.telefono || ''}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="campo">
          <label>Número de Carnet :</label>
          <div className="input-con-icono">
            <img src={ciIcon} alt="Carnet" className="icono" />
            <input
              type="text"
              name="carnet"
              value={datosTutor.carnet || ''}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      {/* Botones */}
      <div className="botones-centrados">
        <button className="btn-guardar" onClick={confirmarGuardado}>Guardar</button>
        <button className="btn-cancelar" onClick={confirmarGuardado}>Cancelar</button>
      </div>

      {/* Modal de confirmación */}
      {mostrarConfirmacion && (
        <div className="modal-fondo">
          <div className="modal">
            <div className="modal-icono">
              <img src={AceptarCambiosIcon} alt="Aceptar cambios" className="icono-modal" />
            </div>
            <p>¿Está seguro de guardar los cambios?</p>
            <div className="modal-botones">
              <button className="btn-guardar" onClick={guardarCambios}>Guardar</button>
              <button className="btn-cancelar" onClick={() => setMostrarConfirmacion(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de éxito */}
      {exito && (
        <div className="modal-fondo">
          <div className="modal">
            <div className="modal-icono">
              <img src={ConfirmacionIcon} alt="Confirmación" className="icono-modal" />
            </div>
            <p>Cambios guardados con éxito</p>
            {/* Al hacer clic en este botón, se redirige a la página del TutorHome */}
            <button className="btn-guardar" onClick={volverHome}>Volver al Home</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Configuracion;