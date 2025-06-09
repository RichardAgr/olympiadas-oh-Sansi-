import { useEffect, useState, useRef } from "react"
import olimpicoImage from "../../assets/OLIMPICO1.png"
import rect34 from "../../assets/Rectangle34.png"
import rect28 from "../../assets/Rectangle28.png"
import rect32 from "../../assets/Rectangle32.png"
import rect33 from "../../assets/Rectangle33.png"
import iconVideo from "../../assets/image16.png"
import axios from 'axios'
import "./HomePrincipal.css"

const HomePrincipal = () => {
  const [convocatoria, setConvocatoria] = useState(null)
  const [tutoriales, setTutoriales] = useState([
  {
    titulo: "Inscripción Manual",
    texto: "Aprende cómo realizar tu inscripción paso a paso de forma manual",
    tipo_video: "manual",
    url: "",
  },
  {
    titulo: "Inscripción Excel",
    texto: "Guía completa para inscribirse usando el archivo Excel proporcionado",
    tipo_video: "excel",
    url: "",
  },
  {
    titulo: "Subir Boleta de Pago",
    texto: "Tutorial para subir correctamente tu comprobante de pago",
    tipo_video: "boleta",
    url: "",
  },
])
  const [loading, setLoading] = useState(true)
  const [showTransition, setShowTransition] = useState(false)
  const [showContent, setShowContent] = useState(false)
  const [error, setError] = useState(null)
  const [scrollState, setScrollState] = useState({
    opacity: 1,
    translateY: 0
  })
  const [showVideoAlert, setShowVideoAlert] = useState(false)
  const [showConvocatoriaAlert, setShowConvocatoriaAlert] = useState(false)
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
      const scrollPosition = window.scrollY
      const heroHeight = heroRef.current?.clientHeight || 0
      
      // Ajusta estos valores según necesites
      const fadeStart = heroHeight * 0.3
      const fadeEnd = heroHeight * 0.8
      
      const opacity = Math.max(0, Math.min(1, 1 - (scrollPosition - fadeStart) / (fadeEnd - fadeStart)))
      const translateY = scrollPosition * 0.3
      
      setScrollState({
        opacity,
        translateY
      })
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (!showContent) return

    const observerOptions = {
      threshold: [0, 0.1, 0.3, 0.5, 0.7, 0.9, 1],
      rootMargin: "-5% 0px -5% 0px",
    }

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const card = entry.target
        const intersectionRatio = entry.intersectionRatio

        if (entry.isIntersecting) {
          card.classList.add("revealed-home")
          
          if (intersectionRatio > 0.7) {
            card.classList.add("ghost-center-home")
            card.classList.remove("ghost-fade-home")
          } else if (intersectionRatio > 0.3) {
            card.classList.remove("ghost-center-home")
            card.classList.remove("ghost-fade-home")
          } else if (intersectionRatio > 0.1) {
            card.classList.add("ghost-fade-home")
            card.classList.remove("ghost-center-home")
          }
        
          if (intersectionRatio > 0.8) {
            cardsRef.current.forEach((otherCard) => {
              if (otherCard !== card && otherCard.classList.contains("revealed-home")) {
                otherCard.classList.add("ghost-fade-home")
                otherCard.classList.remove("ghost-center-home")
              }
            })
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
  const hasSeenLoading = sessionStorage.getItem('hasSeenLoading');
  
  const loadData = async () => {
  try {
    if (!hasSeenLoading) {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      sessionStorage.setItem('hasSeenLoading', 'true');
    }

    // Paso 1: Obtener competencia activa
    const compResponse = await axios.get('http://localhost:8000/api/info-competencia-activa');
    const competencia = compResponse.data.data[0]; // Asegúrate de que es un array

    if (!competencia || !competencia.competencia_id) {
      throw new Error('No se encontró una competencia activa válida.');
    }

    const id_competencia = competencia.competencia_id;

    // Paso 2: Usar el id_competencia para obtener el PDF de la convocatoria
    const response = await axios.get(`http://localhost:8000/api/documento-convocatoria/${id_competencia}/descargar`);
    const data = response.data;

    if (data.success) {
      setConvocatoria(data.data.url_pdf);
    } else {
      setConvocatoria(null);
    }

    // Paso 3: Obtener videos
    const videosResponse = await axios.get('http://localhost:8000/api/Mostrarvideos');
    const videosData = videosResponse.data.data;

    setTutoriales(prevTutoriales =>
      prevTutoriales.map(tutorial => {
        const videoEncontrado = videosData.find(v => v.tipo_video === tutorial.tipo_video);
        return {
          ...tutorial,
          url: videoEncontrado?.url_video || "",
          existe: videoEncontrado?.existe || false
        };
      })
    );

    // Paso 4: Finalizar carga
    if (!hasSeenLoading) {
      setLoading(false);
      setShowTransition(true);

      setTimeout(() => {
        setShowTransition(false);
        setShowContent(true);
      }, 2000);
    } else {
      setLoading(false);
      setShowContent(true);
    }

  } catch (err) {
    setError("Error al cargar los datos");
    console.error(err);
    setLoading(false);
  }
};

  
  loadData();
}, []);

const handleDownload = async() => {
    if (!convocatoria) {
      setShowConvocatoriaAlert(true)
      setTimeout(() => setShowConvocatoriaAlert(false), 3000)
      return
    }

const response = await axios.get(convocatoria, {
      responseType: 'blob'
    });
    
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `convocatoria-${convocatoria.año || '2025'}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  }

  const abrirVideo = (url,existe) => {
    if (!url || url.trim() === ""|| !existe) {
      setShowVideoAlert(true)
      setTimeout(() => setShowVideoAlert(false), 3000)
      return
    }
    window.open(url, "_blank")
  }

  // Pantalla de carga - solo al inicio
  if (loading && !localStorage.getItem('hasSeenLoading')) {
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
      {/* ALERTAS */}
      {showVideoAlert && (
        <div className="alert-overlay-home">
          <div className="alert-box-home">
            <h3>⚠️ Video no disponible</h3>
            <p>Este video tutorial aún no está disponible. Inténtalo más tarde.</p>
          </div>
        </div>
      )}

      {showConvocatoriaAlert && (
        <div className="alert-overlay-home">
          <div className="alert-box-home">
            <h3>⚠️ Convocatoria no disponible</h3>
            <p>La convocatoria aún no está disponible para descarga. Inténtalo más tarde.</p>
          </div>
        </div>
      )}

      {/* HERO SECTION CON EFECTO DE GALERÍA */}
      <div
        ref={heroRef}
        className="hero-section-home"
        style={{
          transform: `translateY(${scrollState.translateY * 0.5}px)`,
          opacity: scrollState.opacity,
          transition: 'opacity 0.3s ease-out, transform 0.4s ease-out'
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
          style={{ backgroundImage: `url(${rect34})` }}
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
          <img
            className="card-image-home"
            src={olimpicoImage || "/placeholder.svg"}
            alt="Anillos olímpicos con Torre Eiffel"
          />
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
              const bgImages = [rect28, rect32, rect33]
              const bgImage = bgImages[index] || bgImages[0]

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
                    <button className="tutorial-button-home" onClick={() => abrirVideo(tutorial.url, tutorial.existe)}>
                      <img src={iconVideo || "/placeholder.svg"} alt="Ver video" />
                    </button>
                    {(!tutorial.url || tutorial.url.trim() === "" || !tutorial.existe) && (
                      <div className="video-status-home">Video no Disponible</div>
                    )}
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

export default HomePrincipal
