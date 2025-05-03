import { useState, useRef } from "react"
import "./fileUpLoader.css"

const FileUpLoader = ({onFileUpLoader, isLoading}) => {

    const [isDragging, setIsDragging] = useState(false)
    const [fileName, setFileName] = useState("")
    const fileInputRef = useRef(null)

    const handleDragOver = (e) => {
        e.preventDefault()
        setIsDragging(true)
    }
    
    const handleDragLeave = () => {
        setIsDragging(false)
    }
    
    const handleDrop = (e) => {
        e.preventDefault()
        setIsDragging(false)
    
        const files = e.dataTransfer.files
        if (files.length > 0) {
          processFile(files[0])
        }
    }

    const handleFileInputChange = (e) => {
        const files = e.target.files
        if (files.length > 0) {
          processFile(files[0])
        }
    }

  return (
    <div>FileUpLoader</div>
  )
}

export default FileUpLoader