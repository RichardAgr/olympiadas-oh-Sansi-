import { useState } from 'react'
import './App.css'
import { HU2nivelesCategoria } from './components/nivelsCategoria/HU2nivelesCategoria'
import CrearCategoria from './components/nivelsCategoria/tabla/customsTablaDatos/flowCategoria/crearCategoria/CrearCategoria'

function App() {
  return (
    <>
      {/* <HU2nivelesCategoria/> */}
      <CrearCategoria/>
    </>
  )
}

export default App
