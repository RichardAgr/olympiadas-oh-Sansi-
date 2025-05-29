import React, { useEffect, useState } from "react";
import axios from "axios";

import olimpicoImage from "../../assets/OLIMPICO1.png";
import rect34 from "../../assets/Rectangle34.png";
import rect28 from "../../assets/Rectangle28.png";
import rect32 from "../../assets/Rectangle32.png";
import rect33 from "../../assets/Rectangle33.png";
import iconVideo from "../../assets/image16.png";

import "./HomePrincipal.css";

const HomePrincipal = () => {
  const [convocatoria, setConvocatoria] = useState(null);
  const [tutoriales, setTutoriales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Carga simultánea de convocatoria y tutoriales desde /public
    const fetchConvocatoria = axios.get("/convocatoria.json");
    const fetchTutoriales = axios.get("/tutoriales.json");

    Promise.all([fetchConvocatoria, fetchTutoriales])
      .then(([convRes, tutRes]) => {
        setConvocatoria(convRes.data);
        setTutoriales(tutRes.data.tutoriales || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error cargando datos:", err);
        setError("Error al cargar los datos.");
        setLoading(false);
      });
  }, []);

  const handleDownload = () => {
    if (!convocatoria) return;
    const link = document.createElement("a");
    link.href = convocatoria.archivo;
    link.download = convocatoria.nombreDescarga || "convocatoria.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const abrirVideo = (url) => {
    if (!url) return;
    window.open(url, "_blank");
  };

  if (loading) return <p className="loading-text">Cargando...</p>;
  if (error) return <p className="error-text">{error}</p>;

  return (
    <div className="home-container">
      <h1 className="home-title">Únete al futuro de la ciencia y la tecnología</h1>
      <h2 className="home-subtitle">OLIMPIADA CIENTÍFICA NACIONAL SAN SIMÓN 2025</h2>

      <button className="download-button" onClick={handleDownload}>
        Descargar Convocatoria
      </button>

      {/* PRESENTACIÓN */}
      <div className="card presentacion-card" style={{ backgroundImage: `url(${rect34})` }}>
        <div className="card-text">
          <h3 className="card-title">PRESENTACIÓN</h3>
          <p>
            El Comité de la Olimpiada Científica Nacional San Simón – O! SANSI, a
            través de la Facultad de Ciencias y Tecnología de la Universidad Mayor de
            San Simón, invita cordialmente a todos los estudiantes del Sistema de
            Educación Regular a participar en la edición 2025 de las Olimpiadas O!
            SANSI.
          </p>
        </div>
        <img className="card-image" src={olimpicoImage} alt="Olimpico" />
      </div>

      {/* REQUISITOS */}
      <div className="card" style={{ backgroundImage: `url(${rect34})` }}>
        <div className="card-text full">
          <h3 className="card-title">¿QUÉ REQUISITOS NECESITO?</h3>
          <ul>
            <li>
              Ser estudiante de nivel Primaria o Secundaria del Sistema de Educación
              Regular del Estado Plurinacional de Bolivia.
            </li>
            <li>Registrar un tutor o profesor responsable del seguimiento del estudiante.</li>
            <li>
              Completar el formulario de inscripción, seleccionando el(la) área(s) en
              la que desea postularse.
            </li>
            <li>
              Cumplir con los requisitos específicos establecidos para la categoría de
              competencia correspondiente.
            </li>
            <li>
              Contar con un documento de identificación personal vigente (cédula de
              identidad) durante el desarrollo de la competencia.
            </li>
            <li>
              Disponer de un correo electrónico personal o del tutor para la comunicación
              oficial.
            </li>
          </ul>
        </div>
      </div>

      {/* PREMIOS */}
      <div className="card" style={{ backgroundImage: `url(${rect34})` }}>
        <div className="card-text full">
          <h3 className="card-title">PREMIOS</h3>
          <ul>
            <li>
              Los resultados de los ganadores se publicarán el 11 de julio en la página
              web de la O!SanSi.
            </li>
            <li>La premiación se realizará el 11 de julio a horas 15:00.</li>
            <li>
              Los estudiantes ubicados en los 5 primeros puestos a nivel nacional
              recibirán diplomas de honor, y los 3 primeros recibirán medallas.
            </li>
            <li>Los tutores recibirán certificados.</li>
            <li>
              Ganadores de medallas de 6to de secundaria tendrán ingreso libre a la
              Facultad.
            </li>
          </ul>
        </div>
      </div>

      {/* VIDEOS TUTORIALES */}
      <div className="card videos" style={{ backgroundImage: `url(${rect34})` }}>
        <div className="card-text video-text">
          <h3 className="card-title">VIDEOS TUTORIALES</h3>
        </div>
        <div className="tutorials-cards">
          {tutoriales.map((tutorial, index) => {
            let bgImage = rect28;
            if (index === 1) bgImage = rect32;
            else if (index === 2) bgImage = rect33;

            return (
              <div
                key={index}
                className="tutorial-card"
                style={{ backgroundImage: `url(${bgImage})` }}
              >
                {/* Mostrar título */}
                <h4 className="tutorial-title">{tutorial.titulo}</h4>

                {/* Mostrar texto */}
                <p
                  className="tutorial-text"
                  dangerouslySetInnerHTML={{ __html: tutorial.texto }}
                />
                <button
                  className="tutorial-button"
                  onClick={() => abrirVideo(tutorial.url)}
                >
                  <img src={iconVideo} alt="Ver video" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HomePrincipal;
