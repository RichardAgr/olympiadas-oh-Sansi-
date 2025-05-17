import { useState, useEffect } from "react"
import { Save, Eye, Trash, Video, Link } from "lucide-react"
/* import Modal from "@/components/modal"
import Notification from "@/components/notification" */
/* import { getIconComponent } from "@/lib/icon-helper" */
import "../pdfConfiguracionData/pdfUploader.css"

export default function VideoUploader({ title, iconName, storageKey }) {
  const [videoUrl, setVideoUrl] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [notification, setNotification] = useState({ show: false, message: "", type: "" })

  const handleUrlChange = (e) => {
    setVideoUrl(e.target.value)
  }

  const handleSaveUrl = () => {
    if (!videoUrl) {
      showNotification("Por favor ingresa una URL de YouTube", "error")
      return
    }

    // Validación simple para URL de YouTube
    if (!videoUrl.includes("youtube.com") && !videoUrl.includes("youtu.be")) {
      showNotification("Por favor ingresa una URL válida de YouTube", "error")
      return
    }

    showNotification("URL de video guardada correctamente", "success")
  }

  const handleView = () => {
    if (!videoUrl) {
      showNotification("No hay video para visualizar", "error")
      return
    }

    setIsModalOpen(true)
  }

  const handleDelete = () => {
    setVideoUrl("")
    showNotification("URL de video eliminada correctamente", "success")
  }

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return ""

    try {
      // Extraer el ID del video de YouTube
      let videoId = ""

      if (url.includes("youtube.com/watch")) {
        const urlParams = new URLSearchParams(new URL(url).search)
        videoId = urlParams.get("v") || ""
      } else if (url.includes("youtu.be/")) {
        videoId = url.split("youtu.be/")[1].split("?")[0]
      }

      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`
      }
    } catch (error) {
      console.error("Error parsing YouTube URL:", error)
    }

    return url
  }

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type })
  }

  const hideNotification = () => {
    setNotification({ ...notification, show: false })
  }

  return (
    <>
      <div className="card">
        <div className="card-header">
          <div className="card-icon"><Video size={24} /></div>
          <h3 className="card-title">{title}</h3>
        </div>

        <div className="upload-container">
          <input
            type="text"
            className="url-input"
            placeholder="Pega el enlace de YouTube aquí"
            value={videoUrl}
            onChange={handleUrlChange}
          />
          <button className="btn btn-view full-width" onClick={handleSaveUrl}>
            <Save className="icon-small" /> Guardar URL
          </button>
        </div>

        {videoUrl ? (
          <div className="file-info">
            <div className="file-name-container">
              <Link className="icon-small" />
              <span className="file-name-text">Video de YouTube</span>
            </div>
            <div className="button-group">
              <button className="btn btn-view" onClick={handleView}>
                <Eye className="icon-small" /> Ver
              </button>
              <button className="btn btn-delete" onClick={handleDelete}>
                <Trash className="icon-small" /> Eliminar
              </button>
            </div>
          </div>
        ) : (
          <div className="no-file">No hay URL de video guardada</div>
        )}
      </div>

{/*       <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Reproduciendo video">
        <div className="video-player">
          <iframe
            width="100%"
            height="100%"
            src={getYouTubeEmbedUrl(videoUrl)}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </Modal>

      <Notification
        message={notification.message}
        type={notification.type}
        isVisible={notification.show}
        onClose={hideNotification}
      /> */}
    </>
  )
}
