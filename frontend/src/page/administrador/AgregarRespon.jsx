import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Asegúrate de que useNavigate esté importado
import "./AgregarRespon.css";

function AgregarRespon() {
  // Estados para cada campo
  const [nombres, setNombres] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [ci, setCi] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");

  // Inicializa useNavigate para la navegación
  const navigate = useNavigate();

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Enviar los datos al backend
      await axios.post("http://127.0.0.1:8000/api/responsables", {
        nombres,
        apellidos,
        ci,
        correo_electronico: correo,
        telefono,
      });

      // Al éxito, mostrar mensaje y redirigir a la vista de registros
      alert("Responsable de Gestión registrado con éxito ✅");
      navigate("/admin/visualizarRegistro");
    } catch (error) {
      console.error("Error al registrar al responsable:", error);
      alert("Hubo un error al registrar al responsable ❌");
    }
  };

  // Función para redirigir al cancelar
  const handleCancel = () => {
    navigate("/admin/visualizarRegistro");
  };

  return (
    <div className="form-container">
      <h2>Registrar Nuevo Responsable de Gestión</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="section-title">Datos del Responsable</div>
        
        <div className="form-row">
          <div className="form-group">
            <label>Nombre</label>
            <input 
              type="text" 
              value={nombres} 
              onChange={(e) => setNombres(e.target.value)} 
              required 
            />
          </div>
          
          <div className="form-group">
            <label>Apellidos</label>
            <input 
              type="text" 
              value={apellidos} 
              onChange={(e) => setApellidos(e.target.value)} 
              required 
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Carnet de Identidad</label>
            <input 
              type="text" 
              value={ci} 
              onChange={(e) => setCi(e.target.value)} 
              required 
            />
          </div>
        </div>

        <div className="section-title">Información de Contacto</div>

        <div className="form-row">
          <div className="form-group">
            <label>Correo electrónico</label>
            <input 
              type="email" 
              value={correo} 
              onChange={(e) => setCorreo(e.target.value)} 
              required 
            />
          </div>

          <div className="form-group">
            <label>Teléfono</label>
            <input 
              type="tel" 
              value={telefono} 
              onChange={(e) => setTelefono(e.target.value)} 
              required 
            />
          </div>
        </div>

        <div className="button-groupResp">
          <button type="button" className="btn-cancelarResp" onClick={handleCancel}>Cancelar</button>
          <button type="submit" className="btn-guardarResp">Guardar</button>
        </div>
      </form>
    </div>
  );
}

export default AgregarRespon;
