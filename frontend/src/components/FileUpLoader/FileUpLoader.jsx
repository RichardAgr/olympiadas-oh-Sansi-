import { useState, useRef } from "react"
import "./fileUpLoader.css"

const FileUpLoader = ({onFileUpLoader, isLoading}) => {

    const [isDragging, setIsDragging] = useState(false)
    const [fileName, setFileName] = useState("")
    const fileInputRef = useRef(null)

    

  return (
    <div>FileUpLoader</div>
  )
}

export default FileUpLoader