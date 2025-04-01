import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./AgregarRespon.css"; // ✅ Use same CSS as 'AgregarRespon'

function EditarRespon() {
  const { id } = useParams(); // ✅ Get ID from route
  const navigate = useNavigate(); // ✅ To redirect after success

  const [nombres, setNombres] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [ci, setCi] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");

  // ✅ Fetch data for this 'Responsable'
  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api/responsables/${id}`)
      .then((res) => {
        const data = res.data;
        setNombres(data.nombres);
        setApellidos(data.apellidos);
        setCi(data.ci);
        setCorreo(data.correo_electronico);
        setTelefono(data.telefono);
      })
      .catch((err) => {
        console.error("Error fetching responsable:", err);
      });
  }, [id]);

  // ✅ Handle submit to update
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://127.0.0.1:8000/api/responsables/${id}`, {
        nombres,
        apellidos,
        ci,
        correo_electronico: correo,
        telefono,
      });

      alert("✅ Responsable actualizado con éxito");
      navigate("/admin/visualizarRegistro");
    } catch (error) {
      console.error("❌ Error al actualizar:", error);
      alert("Hubo un error al actualizar al responsable");
    }
  };

  const handleCancel = () => {
    navigate("/admin/visualizarRegistro");
  };

  return (
    <div className="form-container">
      <h2>Editar Responsable de Gestión</h2>

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
          <button type="button" className="btn-cancelarResp" onClick={handleCancel}>
            Cancelar
          </button>
          <button type="submit" className="btn-guardarResp">
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditarRespon;
