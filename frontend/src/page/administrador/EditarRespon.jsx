import React, { useState } from 'react';
import "./EditarRespon.css";
import { Helmet } from "react-helmet";
import logo from "../../assets/icono_oh_sansi.svg";
import notificacion from "../../assets/notificacion.svg";
import user from "../../assets/icon_user.svg";
import VentanaEmergente from './VentanaEmergente';

function RegistrarOrganizador() {
  const [mostrarVentana, setMostrarVentana] = useState(false);
  
  const abrirVentana = () => {
    setMostrarVentana(true);
  };

  const confirmarAccion = () => {
    console.log("Acción confirmada.");
    setMostrarVentana(false);
  };

  const cancelarAccion = () => {
    setMostrarVentana(false);
  };

  const cerrarVentana = () => {
    setMostrarVentana(false);
  };

  return (
    <div className="frame2-roles-responsablede-gestin-agregar-responsable-container1">
      <Helmet>
        <title>exported project</title>
      </Helmet>
      <div className="frame2-roles-responsablede-gestin-agregar-responsable-frame2-roles-responsablede-gestin-agregar-responsable">
        <img
          src="/external/rectangle31984-fnid-200h.png"
          alt="Rectangle31984"
          className="frame2-roles-responsablede-gestin-agregar-responsable-rectangle3"
        />
        <span className="frame2-roles-responsablede-gestin-agregar-responsable-text10">
          Contáctate con
        </span>
        <span className="frame2-roles-responsablede-gestin-agregar-responsable-text11">
          Facultad de Ciencias y Tecnología (UMSS)
        </span>
        <span className="frame2-roles-responsablede-gestin-agregar-responsable-text12">
          Responsables del evento
        </span>
        <div className="frame2-roles-responsablede-gestin-agregar-responsable-frameiconfacebookicon">
          <img
            src="/external/vector1984-vv3.svg"
            alt="Vector1984"
            className="frame2-roles-responsablede-gestin-agregar-responsable-vector10"
          />
          <img
            src="/external/vector1984-a65q.svg"
            alt="Vector1984"
            className="frame2-roles-responsablede-gestin-agregar-responsable-vector11"
          />
        </div>
        <div className="frame2-roles-responsablede-gestin-agregar-responsable-frame21">
          <span className="frame2-roles-responsablede-gestin-agregar-responsable-text13">
            Editar Responsable de Gestión
          </span>
          <div className="frame2-roles-responsablede-gestin-agregar-responsable-frame22">
            <span className="frame2-roles-responsablede-gestin-agregar-responsable-text14">
              Nombres
            </span>
            <input
              type="text"
              className="frame2-roles-responsablede-gestin-agregar-responsable-rectangle12"
              placeholder="Ingresa texto aquí"
            />
            <input
              type="text"
              className="frame2-roles-responsablede-gestin-agregar-responsable-rectangle14"
              placeholder="Ingresa texto aquí"
            />
            <input
              type="text"
              className="frame2-roles-responsablede-gestin-agregar-responsable-rectangle13"
              placeholder="Ingresa texto aquí"
            />
            <span className="frame2-roles-responsablede-gestin-agregar-responsable-text15">
              Apellidos
            </span>
            <span className="frame2-roles-responsablede-gestin-agregar-responsable-text16">
              Carnet de Identidad
            </span>
            <span className="frame2-roles-responsablede-gestin-agregar-responsable-text17">
              Correo electrónico
            </span>
            <input
              type="text"
              className="frame2-roles-responsablede-gestin-agregar-responsable-rectangle17"
              placeholder="Ingresa texto aquí"
            />
            <input
              type="text"
              className="frame2-roles-responsablede-gestin-agregar-responsable-rectangle18"
              placeholder="Ingresa texto aquí"
            />
            <span className="frame2-roles-responsablede-gestin-agregar-responsable-text18">
              Teléfono
            </span>
            <span className="frame2-roles-responsablede-gestin-agregar-responsable-text19">
              Información de Contacto
            </span>
            <span className="frame2-roles-responsablede-gestin-agregar-responsable-text20">
              Datos del Responsable
            </span>
            <button className="frame2-roles-responsablede-gestin-agregar-responsable-excel-button1">
              <span className="frame2-roles-responsablede-gestin-agregar-responsable-text21">
                Cancelar
              </span>
            </button>
          </div>
          <button className="frame2-roles-responsablede-gestin-agregar-responsable-excel-button2" onClick={abrirVentana}>
            <span className="frame2-roles-responsablede-gestin-agregar-responsable-text22">
              Guardar
            </span>
          </button>
        </div>

        {/* Ventana emergente */}
        {mostrarVentana && (
          <VentanaEmergente
            mensaje="¿Está seguro de que desea guardar los cambios?"
            onConfirm={confirmarAccion}
            onCancel={cancelarAccion}
            onClose={cerrarVentana}
          />
        )}

        <div className="frame2-roles-responsablede-gestin-agregar-responsable-container2">
          <div className="frame2-roles-responsablede-gestin-agregar-responsable-image">
            <div className="frame2-roles-responsablede-gestin-agregar-responsable-group10">
              <div className="frame2-roles-responsablede-gestin-agregar-responsable-group11">
                <div className="frame2-roles-responsablede-gestin-agregar-responsable-group12">
                  <div className="frame2-roles-responsablede-gestin-agregar-responsable-group13">
                    <img src={logo} alt="Logo svg" width="36" height="36" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <span className="frame2-roles-responsablede-gestin-agregar-responsable-text23">
            O! SanSi
          </span>
          <button className="frame2-roles-responsablede-gestin-agregar-responsable-text24">
            Roles
          </button>
          <div className="frame2-roles-responsablede-gestin-agregar-responsable-frame">
            <button className="frame2-roles-responsablede-gestin-agregar-responsable-text25">
              Inicio
            </button>
          </div>
          <button className="frame2-roles-responsablede-gestin-agregar-responsable-button21">
            <span className="frame2-roles-responsablede-gestin-agregar-responsable-text26">
              Admin
            </span>
            <img src={user} alt="User svg" width="25" height="25" />
          </button>
          <div className="frame2-roles-responsablede-gestin-agregar-responsable-notificationalarm2androidphonemobiledevicesmartpho1">
            <div className="frame2-roles-responsablede-gestin-agregar-responsable-notificationalarm2androidphonemobiledevicesmartpho2">
              <img src={notificacion} alt="Notificacion svg" width="20" height="20" />
              <img
                src="/external/vector32127-xe5.svg"
                alt="Vector32127"
                className="frame2-roles-responsablede-gestin-agregar-responsable-vector3"
              />
            </div>
          </div>
          <button className="frame2-roles-responsablede-gestin-agregar-responsable-text27">
            Evento
          </button>
          <button className="frame2-roles-responsablede-gestin-agregar-responsable-text28">
            Competidores
          </button>
        </div>
      </div>
    </div>
  );
}

export default RegistrarOrganizador;

