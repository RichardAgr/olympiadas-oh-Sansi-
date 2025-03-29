import { Routes, Route } from "react-router-dom";
import VRegistroFechas from './page/administrador/VRegistroFechas';
import EditarFechaInscripcion from './page/administrador/EditarFechaInscripcion';
import EditarFechaCompetencia from './page/administrador/EditarFechaCompetencia';

function App() {
  return (
    <Routes>
      <Route path="/" element={<VRegistroFechas />} /> {/* Página de inicio */}
      <Route path="/registro-fechas" element={<VRegistroFechas />} />
      <Route path="/editar-fecha-inscripcion/:id" element={<EditarFechaInscripcion />} />
      <Route path="/editar-fecha-competencia/:id" element={<EditarFechaCompetencia />} />
    </Routes>
  );
}

export default App;


