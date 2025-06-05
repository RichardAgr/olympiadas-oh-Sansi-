import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import HomeAdmin from "../page/administrador/HomeAdmin";
import AreasList from "../page/administrador/HU1/AreasList";
import AgregarArea from "../page/administrador/HU1/AgregarArea";
import EditArea from "../page/administrador/HU1/EditArea";
import VisualizarRegistro from "../page/administrador/HU4/VRegistroOrg";
import AgregarRespon from "../page/administrador/HU4/AgregarRespon";
import EditarRespon from "../page/administrador/HU4/EditarRespon";
import AreasRegistradas from "../page/administrador/VerAreasRegistradas";
import VEvento from "../page/administrador/ModificarEventos/VEvento";
import RegistroCategoria from "../page/administrador/HU2/RegistroCategoria";
import EditarCategoria from "../page/administrador/HU2/EditarCategoria";
import AgregarCategoria from "../page/administrador/HU2/AgregarCategoria";
import AppRouteRespGest from "./AppRouteRespGest";
import ConfigurarDatosCompetencia from "../page/administrador/configurarDatosCompetencia/ConfigurarDatosCompetencia";

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
          <Route path="Evento" element={<VEvento />} />
          <Route path="visualizarRegistro" element={<VisualizarRegistro/>}/>
          <Route path="visualizarRegistro/editarRegistro/:id" element={<EditarRespon/>}/>
          <Route path="visualizarRegistro/agregarRegistro" element={<AgregarRespon/>}/>
          <Route path="registro-categorias" element={<RegistroCategoria />} />
          <Route path="registro-categorias/editar/:id" element={<EditarCategoria />} />
          <Route path="registro-categorias/nueva" element={<AgregarCategoria />} />
          <Route path="configurar/datosCompetencia" element={<ConfigurarDatosCompetencia />} />
        </Route>
        <Route path="/homeRespGestion/*" element={<AppRouteRespGest />} />
      </Routes>
  );
};

export default AppRouter;
