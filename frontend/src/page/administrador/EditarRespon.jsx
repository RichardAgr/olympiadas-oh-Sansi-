import React, { useState } from 'react';
import "./EditarRespon.css";
import { Helmet } from "react-helmet";

import VentanaEmergente from './VentanaEmergente';
import { Link } from 'react-router-dom';

function RegistrarOrganizador() {
  const [mostrarVentana, setMostrarVentana] = useState(false);
  const [nombres, setNombres] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [carnet, setCarnet] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  
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
              value={nombres} // Asegúrate de definir el estado correspondiente
              onChange={(e) => setNombres(e.target.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g, ""))} // Permite solo letras y espacios
              required
            />
            <span className="frame2-roles-responsablede-gestin-agregar-responsable-text15">
              Apellidos
            </span>
            <input
              type="number"
              className="frame2-roles-responsablede-gestin-agregar-responsable-rectangle14"
              placeholder="Ingresa número aquí"
              value={carnet} // Asegúrate de tener un estado para esto
              onChange={(e) => setCarnet(e.target.value.replace(/[^0-9]/g, ""))} // Permite solo números
              required
            />
            <span className="frame2-roles-responsablede-gestin-agregar-responsable-text16">
              Carnet de Identidad
            </span>
            <input
              type="text" // Manteniendo el tipo como 'text' para permitir letras
              className="frame2-roles-responsablede-gestin-agregar-responsable-rectangle13"
              placeholder="Ingresa texto aquí"
              value={apellidos} // Asegúrate de tener un estado para esto
              onChange={(e) => setApellidos(e.target.value.replace(/[^a-zA-Z\s]/g, ""))} // Permite solo letras y espacios
              required
            />
            <span className="frame2-roles-responsablede-gestin-agregar-responsable-text17">
              Correo electrónico
            </span>
            <input
              type="email"
              className="frame2-roles-responsablede-gestin-agregar-responsable-rectangle17"
              placeholder="Ingresa correo electronico aquí"
              value={correo} // Asegúrate de tener un estado para esto
              onChange={(e) => setCorreo(e.target.value)} // Maneja el cambio normalmente
              required
            />
            <span className="frame2-roles-responsablede-gestin-agregar-responsable-text18">
              Teléfono
            </span>
            <input
              type="tel"
              className="frame2-roles-responsablede-gestin-agregar-responsable-rectangle18"
              placeholder="Ingresa número Telefonico"
              value={telefono} // Asegúrate de tener un estado para esto
              onChange={(e) => setTelefono(e.target.value.replace(/[^0-9]/g, ""))} // Permite solo números
              pattern="[0-9]{7,10}" // Asegura que el número tenga entre 7 y 10 dígitos
              required
            />
            <span className="frame2-roles-responsablede-gestin-agregar-responsable-text19">
              Información de Contacto
            </span>
            <span className="frame2-roles-responsablede-gestin-agregar-responsable-text20">
              Datos del Responsable
            </span>
            <Link to="/admin/visualizarRegistro">
              <button className="frame2-roles-responsablede-gestin-agregar-responsable-excel-button1">
              <span className="frame2-roles-responsablede-gestin-agregar-responsable-text21">
                Cancelar
              </span>
              </button>
              </Link>
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
