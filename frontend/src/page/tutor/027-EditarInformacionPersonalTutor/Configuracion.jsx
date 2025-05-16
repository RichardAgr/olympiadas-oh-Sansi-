import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

  const [datosTutor, setDatosTutor] = useState({});
  const [errores, setErrores] = useState({});
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [exito, setExito] = useState(false);

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
    const { name, value } = e.target;
    let error = '';

    if ((name === 'nombre' || name === 'apellido') && !/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]*$/.test(value)) {
      error = 'Solo se permiten letras';
    } else if ((name === 'nombre' || name === 'apellido') && value.length > 30) {
      error = 'Máximo 30 caracteres';
    } else if ((name === 'telefono' || name === 'carnet') && !/^\d*$/.test(value)) {
      error = 'Solo se permiten números';
    } else if ((name === 'telefono' || name === 'carnet') && value.length > 10) {
      error = 'Máximo 10 dígitos';
    }

    setDatosTutor({ ...datosTutor, [name]: value });
    setErrores({ ...errores, [name]: error });
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
            {errores.nombre && <p className="error">{errores.nombre}</p>}
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
            {errores.apellido && <p className="error">{errores.apellido}</p>}
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
          {errores.telefono && <p className="error">{errores.telefono}</p>}
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
          {errores.carnet && <p className="error">{errores.carnet}</p>}
        </div>
      </div>

      {/* Botones */}
      <div className="botones-centrados">
        <button className="btn-guardar" onClick={confirmarGuardado}>Guardar</button>
        <button className="btn-cancelar" onClick={volverHome}>Cancelar</button>
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
            <button className="btn-guardar" onClick={volverHome}>Volver al Home</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Configuracion;
