import React, { useState } from 'react';
import "./AgregarRespon.css";
import { Helmet } from "react-helmet";

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
        <span className="frame2-roles-responsablede-gestin-agregar-responsable-text10">
          Contáctate con
        </span>
        <span className="frame2-roles-responsablede-gestin-agregar-responsable-text11">
          Facultad de Ciencias y Tecnología (UMSS)
        </span>
        <span className="frame2-roles-responsablede-gestin-agregar-responsable-text12">
          Responsables del evento
        </span>
        
        <div className="frame2-roles-responsablede-gestin-agregar-responsable-frame21">
          <span className="frame2-roles-responsablede-gestin-agregar-responsable-text13">
            Registrar Nuevo Responsable de Gestión
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

      </div>
    </div>
  );
}

export default RegistrarOrganizador;
