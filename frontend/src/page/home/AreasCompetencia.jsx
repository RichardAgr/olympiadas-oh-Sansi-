import React, { useEffect, useState } from "react";
import axios from "axios";

import rect34 from "../../assets/Rectangle34.png";
import "./AreasCompetencia.css";

const AreasCompetencia = () => {
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("/areas.json")
      .then((res) => {
        console.log("Respuesta completa del JSON:", res.data);
        if (res.data && Array.isArray(res.data.areas)) {
          setAreas(res.data.areas);
          setError(null);
        } else {
          setError("Los datos no están en el formato esperado.");
          setAreas([]);
        }
      })
      .catch((err) => {
        console.error("Error al cargar las áreas:", err);
        setError("Error al cargar las áreas.");
        setAreas([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Cargando áreas...</div>;
  }

  if (error) {
    return <div style={{ color: "red" }}>{error}</div>;
  }

  return (
    <div className="area-container">
      <h1 className="area-title">ÁREAS EN COMPETENCIA</h1>

      <div className="area-card" style={{ backgroundImage: `url(${rect34})` }}>
        <div className="area-table-container">
          <table className="area-table">
            <thead>
              <tr>
                <th>Área</th>
                <th>Año de Escolaridad</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {areas.map((area, index) => (
                <tr key={index}>
                  <td>{area.nombre}</td>
                  <td>{area.descripcion}</td>
                  <td>
                    <button
                      className="pdf-button"
                      onClick={() => window.open(area.pdf, "_blank")}
                    >
                      Descargar PDF
                    </button>
                  </td>
                </tr>
              ))}
              {areas.length === 0 && (
                <tr>
                  <td colSpan="3">No hay áreas para mostrar.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AreasCompetencia;
