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
const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta raíz '/' redirige automáticamente a '/admin' */}
        <Route path="/" element={<Navigate to="/admin" />} />  {/* Agregado: Redirige la raíz a la página de administración */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<HomeAdmin />} />
          <Route path="areas" element={<AreasList />} />
          <Route path="verAreasRegistradas" element={<AreasRegistradas />} />
          <Route path="areas/nueva" element={<AgregarArea />} />
          <Route path="areas/editar/:id" element={<EditArea />} />
          <Route path="visualizarRegistro" element={<VisualizarRegistro/>}/>
          <Route path="visualizarRegistro/editarRegistro/:id" element={<EditarRespon/>}/>
          <Route path="visualizarRegistro/agregarRegistro" element={<AgregarRespon/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;