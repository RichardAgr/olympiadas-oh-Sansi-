import { Outlet } from "react-router-dom";
import ResponsableTopBar from "./RespGestTopBar";
import AdminFooter from "./AdminFooter"; 

const RespGestLayout = () => {
  return (
    <div className="admin-layout">
      <ResponsableTopBar />
      <main className="admin-content">
        <Outlet />
      </main>
      <AdminFooter />
    </div>
  );
};

export default RespGestLayout;
