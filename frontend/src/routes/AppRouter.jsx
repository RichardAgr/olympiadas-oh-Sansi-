import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import HomeAdmin from "../page/administrador/HomeAdmin";
import AreasList from "../page/administrador/AreasList";
import AgregarArea from "../page/administrador/AgregarArea";
import EditArea from "../page/administrador/EditArea";
import VisualizarRegistro from "../page/administrador/VRegistroOrg";
import AgregarRespon from "../page/administrador/AgregarRespon";
import EditarRespon from "../page/administrador/EditarRespon";
import AreasRegistradas from "../page/administrador/VerAreasRegistradas";
import VEvento from "../page/administrador/VEvento";
import VEditarFechaInscripcion from "../page/administrador/VEditarFechaInscripcion";
import VEditarFechaCompetencia from "../page/administrador/VEditarFechaCompetencia";
import RegistroCategoria from "../page/administrador/RegistroCategoria";
import EditarCategoria from "../page/administrador/EditarCategoria";
import AgregarCategoria from "../page/administrador/AgregarCategoria";
import AppRouteRespGest from "./AppRouteRespGest";

const AppRouter = () => {
  return (
      <Routes>
        {/* Redirect root path '/' to '/admin' */}
        <Route path="/" element={<Navigate to="/admin" />} />

        <Route path="" element={<AdminLayout />}>
          <Route index element={<HomeAdmin />} />
          <Route path="areas" element={<AreasList />} />
          <Route path="verAreasRegistradas" element={<AreasRegistradas />} />
          <Route path="areas/nueva" element={<AgregarArea />} />
          <Route path="areas/editar/:id" element={<EditArea />} />
          <Route path="visualizarRegistro" element={<VisualizarRegistro />} />
          <Route path="visualizarRegistro/editarRegistro/:id" element={<EditarRespon />} />
          <Route path="visualizarRegistro/agregarRegistro" element={<AgregarRespon />} />
          <Route path="Evento/FechaInscripcion/:areaId/:competenciaId" element={<VEditarFechaInscripcion />} />
          <Route path="Evento/FechaCompetencia/:areaId/:competenciaId?" element={<VEditarFechaCompetencia />} />
          <Route path="Evento" element={<VEvento />} />
          <Route path="visualizarRegistro" element={<VisualizarRegistro/>}/>
          <Route path="visualizarRegistro/editarRegistro/:id" element={<EditarRespon/>}/>
          <Route path="visualizarRegistro/agregarRegistro" element={<AgregarRespon/>}/>
          <Route path="registro-categorias" element={<RegistroCategoria />} />
          <Route path="registro-categorias/editar/:id" element={<EditarCategoria />} />
          <Route path="registro-categorias/nueva" element={<AgregarCategoria />} />
        </Route>
        <Route path="/homeRespGestion/*" element={<AppRouteRespGest />} />
      </Routes>
  );
};

export default AppRouter;
