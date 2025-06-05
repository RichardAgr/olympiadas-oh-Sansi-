import { Outlet } from "react-router-dom";
import AdminTopBar from "./AdminTopBar";
import AdminFooter from "./AdminFooter"; 
import "./adminLayout.css"

const AdminLayout = () => {
  return (
    <div className="admin-layout">
      <AdminTopBar />
      <main>
        <Outlet />
      </main>
      <AdminFooter />
    </div>
  );
};

export default AdminLayout;
