import { useState, useEffect } from "react"
import { GraduationCap, Megaphone, Video,  FileSpreadsheet } from "lucide-react"
 import PdfUploader from "../../../components/pdfConfiguracionData/pdfUploader"
import VideoUploader from "../../../components/videoUplaodaer/VideosUpLoader"

import "./ConfigurarDatosCompetencia.css"

export default function ConfigurarDatosCompetencia() {

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
{/*           <PdfUploader title="Matemática" iconName="Square2StackIcon" storageKey="matematica-pdf" />
          <PdfUploader title="Biología" iconName="Dna" storageKey="biologia-pdf" />*/}
          <PdfUploader title="Física" iconName="Atom" storageKey="fisica-pdf" />
        </div>
      </section>

      <section id="convocatoria-section" className="convocatoria-section">
        <h2 className="section-titleConfigData">
          <Megaphone className="section-icon" /> Convocatoria
        </h2>
        <div className="cards-container">
          <PdfUploader title="Convocatoria Oficial" iconName="FileText"/>
        </div>
      </section>

      <section id="videos-section" className="videos-section">
        <h2 className="section-titleConfigData">
          <Video className="section-icon" /> Videos Instructivos
        </h2>
        <div className="cards-container">
          <VideoUploader title="Manual de Inscripción" iconName="BookOpen" storageKey="video-manual" />
          <VideoUploader title="Tutorial de Excel" iconName="FileSpreadsheet" storageKey="video-excel" />
          <VideoUploader title="Subir Boleta de Pago" iconName="Receipt" storageKey="video-boleta" />
        </div>
      </section>
    </div>
  )
}
