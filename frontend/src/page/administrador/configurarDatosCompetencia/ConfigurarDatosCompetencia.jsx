import { useState, useEffect } from "react"
import { GraduationCap, Megaphone, Video } from "lucide-react"
/* import PdfUploader from "@/components/pdf-uploader"
import VideoUploader from "@/components/video-uploader"
*/
import "./ConfigurarDatosCompetencia.css"

export default function ConfigurarDatosCompetencia() {
  const [activeSection, setActiveSection] = useState("areas")

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100

      const areasSection = document.getElementById("areas-section")
      const convocatoriaSection = document.getElementById("convocatoria-section")
      const videosSection = document.getElementById("videos-section")

      if (videosSection && scrollPosition >= videosSection.offsetTop) {
        setActiveSection("videos")
      } else if (convocatoriaSection && scrollPosition >= convocatoriaSection.offsetTop) {
        setActiveSection("convocatoria")
      } else if (areasSection) {
        setActiveSection("areas")
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Función para desplazarse a una sección
  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId)
    if (section) {
      window.scrollTo({
        top: section.offsetTop - 80,
        behavior: "smooth",
      })
    }
  }

  return (
    <div className="ContainerConfigData">
      <div className="page-headerConfigData">
        <h1 className="titulo-configData">Portal de Competencias Académicas</h1>
        <p>Sube y administra documentos y videos de las competencias</p>
      </div>

      <section id="areas-section" className="areas-section">
        <h2 className="section-titleConfigData">
          <GraduationCap className="section-icon" /> Áreas Académicas
        </h2>
        <div className="cards-container">
          <h1>areas</h1>
{/*           <PdfUploader title="Matemática" iconName="Square2StackIcon" storageKey="matematica-pdf" />
          <PdfUploader title="Biología" iconName="Dna" storageKey="biologia-pdf" />
          <PdfUploader title="Física" iconName="Atom" storageKey="fisica-pdf" /> */}
        </div>
      </section>

      <section id="convocatoria-section" className="convocatoria-section">
        <h2 className="section-titleConfigData">
          <Megaphone className="section-icon" /> Convocatoria
        </h2>
        <div className="cards-container">
          <h2>convocatoria</h2>
          {/* <PdfUploader title="Convocatoria Oficial" iconName="FileText" storageKey="convocatoria-pdf" /> */}
        </div>
      </section>

      <section id="videos-section" className="videos-section">
        <h2 className="section-titleConfigData">
          <Video className="section-icon" /> Videos Instructivos
        </h2>
        <div className="cards-container">
          <h1>videos</h1>
{/*           <VideoUploader title="Manual de Inscripción" iconName="BookOpen" storageKey="video-manual" />
          <VideoUploader title="Tutorial de Excel" iconName="FileSpreadsheet" storageKey="video-excel" />
          <VideoUploader title="Subir Boleta de Pago" iconName="Receipt" storageKey="video-boleta" /> */}
        </div>
      </section>
    </div>
  )
}
