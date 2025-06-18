import { Outlet } from "react-router-dom";
import AdminFooter from "../AdminFooter";
import CrearCompetenciaAdmin from "../../page/administrador/CrearCompetencia/CrearCompetenciaAdmin";
import "../../components/AdminLayout.css"


const AdminCrearComp = () => {
  return (
    <div className="admin-layout">
      <main>
        <CrearCompetenciaAdmin/>
      </main>
      <AdminFooter />
    </div>
  )
}

export default AdminCrearComp