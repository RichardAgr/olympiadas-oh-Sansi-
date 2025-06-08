import { useState, useRef, useEffect } from "react"
import { Save, Eye, Trash, Video, Link, X, CheckCircle, AlertCircle } from "lucide-react"
import axios from "axios"
import "../pdfConfiguracionData/pdfUploader.css"

export default function VideoUploader({ title, type }) {
  const [videoUrl, setVideoUrl] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [notification, setNotification] = useState({ show: false, message: "", type: "" })
  const [videoData, setVideoData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const modalRef = useRef(null)

  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        setIsLoading(true)
        const response = await axios.get("http://localhost:8000/api/Mostrarvideos")

        if (response.data?.data) {
        // Busca el video que coincida con el tipo (type)
        const foundVideo = response.data.data.find(
          (video) => video.tipo_video === type
        );

        if (foundVideo) {
          setVideoData(foundVideo);
          setVideoUrl(foundVideo.url_video);
        } else {
          // No se encontró video para este tipo
          setVideoData(null);
          setVideoUrl("");
        }
      }
      } catch (error) {
        console.error("Error al obtener datos del video:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchVideoData()
  }, [type])

  const handleUrlChange = (e) => {
    setVideoUrl(e.target.value)
  }

  const handleSaveUrl = async () => {
    if (!videoUrl) {
      showNotification("Por favor ingresa una URL de YouTube", "error")
      return
    }

    try {
      const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/
      if (!youtubeRegex.test(videoUrl)) {
        showNotification("Por favor ingresa una URL válida de YouTube", "error")
        return
      }

      const payload = {
        tipo_video: type,
        url_video: videoUrl,
        fecha_creacion: new Date().toISOString().split("T")[0],
      }

      showNotification("Guardando URL de video...", "info")

     const res = await axios.post("http://localhost:8000/api/Guardarvideos", payload)

      if (res.status === 200 || res.status === 201) {
        showNotification("URL de video guardada correctamente", "success")


        if (res.data && res.data.data) {
          setVideoData(res.data.data)
        } else {
          const updatedResponse = await axios.get("http://localhost:8000/api/Mostrarvideos")
          if (updatedResponse.data && updatedResponse.data.data && updatedResponse.data.data[type]) {
            setVideoData(updatedResponse.data.data[type])
          }
        }
      } else {
        throw new Error(res.data.message || "Error al guardar el video")
      }
    } catch (error) {
      console.error("Error al guardar el video:", error)
      showNotification(error.message || "Error al guardar el video", "error")
    }
  }

  const handleView = () => {
    if (!videoUrl) {
      showNotification("No hay video para visualizar", "error")
      return
    }

    setIsModalOpen(true)
  }

  const handleDelete = async () => {
    if (videoData) {
      try {
        const res = await axios.delete(`http://localhost:8000/api/Eliminarvideos/${type}`)

        if (res.status === 200) {
          setVideoData(null)
          setVideoUrl("")
          showNotification("Video eliminado correctamente", "success")
        } else {
          throw new Error(res.data.message || "Error al eliminar el video")
        }
      } catch (error) {
        console.error("Error al eliminar el video:", error)
        showNotification(error.message || "Error al eliminar el video", "error")
      }
    } else {
      setVideoUrl("")
      showNotification("URL de video eliminada", "success")
    }
  }

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return ""

    try {
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
    setTimeout(() => {
      setNotification({ ...notification, show: false })
    }, 1500)
  }

  return (
    <div className="video-uploader-container">
      {/* Notification */}
      {notification.show && (
        <div className={`notification ${notification.type}`}>
          <div className="notification-icon">
            {notification.type === "success" ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          </div>
          <div className="notification-message">{notification.message}</div>
          <button className="notification-close" onClick={() => setNotification({ ...notification, show: false })}>
            <X size={16} />
          </button>
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <div className="card-icon">
            <Video size={24} />
          </div>
          <h3 className="card-title">{title}</h3>
        </div>

        {isLoading ? (
          <div className="loading-indicator">Cargando...</div>
        ) : (
          <>
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
          </>
        )}
      </div>

      {/* Modal centrado en la pantalla */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-containerPDF" ref={modalRef}>
            <div className="modal-header">
              <h3 className="modal-titlePDF">Reproduciendo video</h3>
              <button className="modal-closePDF" onClick={() => setIsModalOpen(false)}>
                <X size={24} />
              </button>
            </div>
            <div className="modal-contentPDF">
              <iframe
                width="100%"
                height="100%"
                src={getYouTubeEmbedUrl(videoUrl)}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="video-player"
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
