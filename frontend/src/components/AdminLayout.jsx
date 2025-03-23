import { Outlet } from "react-router-dom";
import AdminTopBar from "./AdminTopBar";
import AdminFooter from "./AdminFooter"; 

const AdminLayout = () => {
  return (
    <div className="admin-layout">
      <AdminTopBar />
      <main className="admin-content">
        <Outlet />
      </main>
      <AdminFooter />
    </div>
  );
};

export default AdminLayout;
