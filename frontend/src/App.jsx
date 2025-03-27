import { useState } from 'react'
import { BrowserRouter,Route,Routes } from 'react-router-dom'
import './App.css'
import { HU2nivelesCategoria } from './components/nivelsCategoria/HU2nivelesCategoria'
import CrearCategoria from './components/nivelsCategoria/tabla/customsTablaDatos/flowCategoria/crearCategoria/CrearCategoria'
import CrearGrado from './components/nivelsCategoria/tabla/customsTablaDatos/flowGrado/crearGrado/CrearGrado'
import EditarCategoria from './components/nivelsCategoria/tabla/customsTablaDatos/flowCategoria/editarCategoria/EditarCategoria'
import EditarGrado from './components/nivelsCategoria/tabla/customsTablaDatos/flowGrado/editarGrado/EditarGrado'

function App() {
  return (
    <BrowserRouter>
          <Routes>
            <Route path='/' element={<HU2nivelesCategoria/>} /> 
            <Route path='/crearGrado' element={<CrearGrado/>} /> 
            <Route path='/editCategoria/:id' element={<EditarCategoria/>} /> 
            <Route path='/editGrado/:id' element={<EditarGrado/>} /> 
            <Route path='/crearCategoria' element={<CrearCategoria/>} /> 
          </Routes>
    </BrowserRouter>
  )
}

export default App
