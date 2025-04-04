import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

// Admin Pages
import VRegistroOrg from "./page/administrador/AgregarRespon";

// Niveles/Categoría components
import { HU2nivelesCategoria } from "./components/nivelsCategoria/HU2nivelesCategoria";
import CrearCategoria from "./components/nivelsCategoria/tabla/customsTablaDatos/flowCategoria/crearCategoria/CrearCategoria";
import CrearGrado from "./components/nivelsCategoria/tabla/customsTablaDatos/flowGrado/crearGrado/CrearGrado";
import EditarCategoria from "./components/nivelsCategoria/tabla/customsTablaDatos/flowCategoria/editarCategoria/EditarCategoria";
import EditarGrado from "./components/nivelsCategoria/tabla/customsTablaDatos/flowGrado/editarGrado/EditarGrado";
import VEvento from "./page/administrador/VEvento.jsx";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<VRegistroOrg />} />

        <Route path="/niveles" element={<HU2nivelesCategoria />} />
        <Route path="/categoria/nueva" element={<CrearCategoria />} />
        <Route path="/categoria/editar/:id" element={<EditarCategoria />} />
        <Route path="/grado/nuevo" element={<CrearGrado />} />
        <Route path="/grado/editar/:id" element={<EditarGrado />} />
        <Route path="/Evento" element={<VEvento />} />
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
