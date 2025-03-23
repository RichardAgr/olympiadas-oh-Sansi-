import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import HomeAdmin from "../page/administrador/HomeAdmin";
import AreasList from "../page/administrador/AreasList";
import AgregarArea from "../page/administrador/AgregarArea";
import EditArea from "../page/administrador/EditArea";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<HomeAdmin />} />
          <Route path="areas" element={<AreasList />} />
          <Route path="areas/nueva" element={<AgregarArea />} />
          <Route path="areas/editar/:id" element={<EditArea />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;

