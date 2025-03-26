import { useState } from 'react'
import { BrowserRouter,Route,Routes } from 'react-router-dom'
import './App.css'
import { HU2nivelesCategoria } from './components/nivelsCategoria/HU2nivelesCategoria'
import CrearCategoria from './components/nivelsCategoria/tabla/customsTablaDatos/flowCategoria/crearCategoria/CrearCategoria'
import CrearGrado from './components/nivelsCategoria/tabla/customsTablaDatos/flowGrado/crearGrado/CrearGrado'

function App() {
  return (
    <BrowserRouter>
          <Routes>
            <Route path='/' element={<CrearCategoria/>} />
            <Route path='/crearGrado' element={<CrearGrado/>} /> 
            <Route path='/ver' element={<HU2nivelesCategoria/>} /> 
          </Routes>
    </BrowserRouter>
  )
}

export default App
