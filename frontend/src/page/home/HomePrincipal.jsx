import { useEffect, useState,useRef } from "react";
import axios from "axios";

import olimpicoImage from "../../assets/OLIMPICO1.png";
import rect34 from "../../assets/Rectangle34.png";
import rect28 from "../../assets/Rectangle28.png";
import rect32 from "../../assets/Rectangle32.png";
import rect33 from "../../assets/Rectangle33.png";
import iconVideo from "../../assets/image16.png";

import "./HomePrincipal.css";

const HomePrincipal = () => {
  const [convocatoria, setConvocatoria] = useState(null)
  const [tutoriales, setTutoriales] = useState([
    {
      titulo: "Inscripcion Manual",
      texto: "Aprende los fundamentos de matemáticas para la olimpiada",
      url: "https://youtube.com/watch?v=example1",
    },
    {
      titulo: "Física Avanzada",
      texto: "Conceptos avanzados de física para competencias",
      url: "https://youtube.com/watch?v=example2",
    },
    {
      titulo: "Química Orgánica",
      texto: "Fundamentos de química orgánica e inorgánica",
      url: "https://youtube.com/watch?v=example3",
    },
  ])
  const [loading, setLoading] = useState(true)
  const [showTransition, setShowTransition] = useState(false)
  const [showContent, setShowContent] = useState(false)
  const [error, setError] = useState(null)
  const [scrollY, setScrollY] = useState(0)

  const observerRef = useRef(null)
  const cardsRef = useRef([])
  const heroRef = useRef(null)

  const createWaveText = (text) => {
    return text.split("").map((char, index) => <span key={index}>{char === " " ? "\u00A0" : char}</span>)
  }

  const createBuildingText = (text, className) => {
    return text.split("").map((char, index) => (
      <span key={index} className={`${className}-letter`} style={{ animationDelay: `${index * 0.05}s` }}>
        {char === " " ? "\u00A0" : char}
      </span>
    ))
  }

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (!showContent) return

    const observerOptions = {
      threshold: [0, 0.25, 0.5, 0.75, 1],
      rootMargin: "-10% 0px -10% 0px",
    }

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const card = entry.target
        const intersectionRatio = entry.intersectionRatio

        if (entry.isIntersecting) {
          card.classList.add("revealed-home")
          if (intersectionRatio > 0.6) {
            card.classList.add("ghost-center-home")
            card.classList.remove("ghost-fade-home")
            cardsRef.current.forEach((otherCard) => {
              if (otherCard !== card && otherCard.classList.contains("revealed-home")) {
                otherCard.classList.add("ghost-fade-home")
                otherCard.classList.remove("ghost-center-home")
              }
            })
          } else if (intersectionRatio > 0.3) {
            card.classList.remove("ghost-center-home")
            card.classList.remove("ghost-fade-home")
          } else {
            card.classList.add("ghost-fade-home")
            card.classList.remove("ghost-center-home")
          }
        } else {
          card.classList.remove("revealed-home", "ghost-center-home", "ghost-fade-home")
        }
      })
    }, observerOptions)
    setTimeout(() => {
      const elementsToObserve = document.querySelectorAll(
        ".scroll-reveal-home, .scroll-reveal-left-home, .scroll-reveal-right-home, .scroll-reveal-scale-home",
      )

      cardsRef.current = Array.from(elementsToObserve)

      elementsToObserve.forEach((el) => {
        if (observerRef.current) {
          observerRef.current.observe(el)
        }
      })
    }, 100)

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [showContent])

  useEffect(() => {
    // Simular tiempo de carga mínimo para mostrar la animación
    const minLoadTime = 3000 // 3 segundos
    const startTime = Date.now()

    setTimeout(() => {
      setConvocatoria({
        archivo: "/convocatoria-ejemplo.pdf",
        nombreDescarga: "convocatoria-osansi-2025.pdf",
      })

      const elapsedTime = Date.now() - startTime
      const remainingTime = Math.max(0, minLoadTime - elapsedTime)

      setTimeout(() => {
        setLoading(false)
        setShowTransition(true)

        // Después de 1.5 segundos de transición, mostrar contenido
        setTimeout(() => {
          setShowTransition(false)
          setShowContent(true)
        }, 1500)
      }, remainingTime)
    }, 500)
  }, [])

  const handleDownload = () => {
    if (!convocatoria) return
    const link = document.createElement("a")
    link.href = convocatoria.archivo
    link.download = convocatoria.nombreDescarga || "convocatoria.pdf"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const abrirVideo = (url) => {
    if (!url) return
    window.open(url, "_blank")
  }

  if (loading) {
    return (
      <div className="loading-screen-home">
        <div className="loading-container-home">
          <div className="loading-text-home">
            <span className="letter-home">O</span>
            <span className="letter-home">!</span>
            <span className="letter-home"> </span>
            <span className="letter-home">S</span>
            <span className="letter-home">A</span>
            <span className="letter-home">N</span>
            <span className="letter-home">S</span>
            <span className="letter-home">I</span>
          </div>
          <div className="loading-dots-home">
            <div className="dot-home"></div>
            <div className="dot-home"></div>
            <div className="dot-home"></div>
          </div>
        </div>
      </div>
    )
  }

  // Pantalla de transición con triángulo
  if (showTransition) {
    return (
      <div className="transition-screen-home">
        <div className="triangle-container-home">
          <div className="triangle-home"></div>
        </div>
      </div>
    )
  }

  if (error) return <p className="error-text-home">{error}</p>

  return (
    <div className={`home-container-home ${showContent ? "fade-in-home" : ""}`}>
      <div
        ref={heroRef}
        className="hero-section-home"
        style={{
          transform: `translateY(${scrollY * 0.5}px)`,
          opacity: Math.max(0, 1 - scrollY / 600),
        }}
      >
        <div className="hero-background-home"></div>
        <div className="hero-content-home">
          <h1 className="hero-title-home building-text-home">
            {createBuildingText("Únete al futuro de la ciencia y la tecnología", "building")}
          </h1>
          <h2 className="hero-subtitle-home building-text-home">
            {createBuildingText("OLIMPIADA CIENTÍFICA NACIONAL SAN SIMÓN 2025", "building")}
          </h2>
          <button className="download-button-home slide-in-top-home delay-2-home" onClick={handleDownload}>
            Descargar Convocatoria
          </button>
        </div>
      </div>

      <div className="content-wrapper-home">
        {/* PRESENTACIÓN */}
        <div
          className="card-home presentacion-card-home scroll-reveal-left-home"
          style={{ backgroundImage: `url(${rect34}` }}
        >
          <div className="card-text-home">
            <h3 className="card-title-home">
              <div className="wave-text-home">{createWaveText("PRESENTACIÓN")}</div>
            </h3>
            <p>
              El Comité de la Olimpiada Científica Nacional San Simón – O! SANSI, a través de la Facultad de Ciencias y
              Tecnología de la Universidad Mayor de San Simón, invita cordialmente a todos los estudiantes del Sistema
              de Educación Regular a participar en la edición 2025 de las Olimpiadas O! SANSI.
            </p>
          </div>
          <img className="card-image-home" src={olimpicoImage} alt="Anillos olímpicos con Torre Eiffel" />
        </div>

        {/* REQUISITOS */}
        <div className="card-home scroll-reveal-right-home" style={{ backgroundImage: `url(${rect34})` }}>
          <div className="card-text-home full-home">
            <h3 className="card-title-home">
              <div className="wave-text-home">{createWaveText("¿QUÉ REQUISITOS NECESITO?")}</div>
            </h3>
            <ul>
              <li>
                Ser estudiante de nivel Primaria o Secundaria del Sistema de Educación Regular del Estado Plurinacional
                de Bolivia.
              </li>
              <li>Registrar un tutor o profesor responsable del seguimiento del estudiante.</li>
              <li>Completar el formulario de inscripción, seleccionando el(la) área(s) en la que desea postularse.</li>
              <li>
                Cumplir con los requisitos específicos establecidos para la categoría de competencia correspondiente.
              </li>
              <li>
                Contar con un documento de identificación personal vigente (cédula de identidad) durante el desarrollo
                de la competencia.
              </li>
              <li>Disponer de un correo electrónico personal o del tutor para la comunicación oficial.</li>
            </ul>
          </div>
        </div>

        {/* PREMIOS */}
        <div className="card-home scroll-reveal-left-home" style={{ backgroundImage: `url(${rect34})` }}>
          <div className="card-text-home full-home">
            <h3 className="card-title-home">
              <div className="wave-text-home">{createWaveText("PREMIOS")}</div>
            </h3>
            <ul>
              <li>Los resultados de los ganadores se publicarán el 11 de julio en la página web de la O!SanSi.</li>
              <li>La premiación se realizará el 11 de julio a horas 15:00.</li>
              <li>
                Los estudiantes ubicados en los 5 primeros puestos a nivel nacional recibirán diplomas de honor, y los 3
                primeros recibirán medallas.
              </li>
              <li>Los tutores recibirán certificados.</li>
              <li>Ganadores de medallas de 6to de secundaria tendrán ingreso libre a la Facultad.</li>
            </ul>
          </div>
        </div>

        {/* VIDEOS TUTORIALES */}
        <div className="videos-section-home scroll-reveal-home">
          <div className="videos-header-home">
            <h3 className="videos-title-home">
              <div className="wave-text-home">{createWaveText("VIDEOS TUTORIALES")}</div>
            </h3>
          </div>
          <div className="tutorials-grid-home">
            {tutoriales.map((tutorial, index) => {
              const bgImages = [rect28, rect32,rect33 ]
              const bgImage = bgImages[0]

              return (
                <div
                  key={index}
                  className="tutorial-card-home scroll-reveal-scale-home"
                  style={{
                    backgroundImage: `url(${bgImage})`,
                    transitionDelay: `${index * 0.1}s`,
                  }}
                >
                  <div className="tutorial-overlay-home"></div>
                  <div className="tutorial-content-home">
                    <h4 className="tutorial-title-home">{tutorial.titulo}</h4>
                    <p className="tutorial-text-home" dangerouslySetInnerHTML={{ __html: tutorial.texto }} />
                    <button className="tutorial-button-home" onClick={() => abrirVideo(tutorial.url)}>
                      <img src={iconVideo} alt="Ver video" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePrincipal;
