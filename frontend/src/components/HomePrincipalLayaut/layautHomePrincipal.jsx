import { Outlet } from "react-router-dom";
import HomePrincipalTopBar from "./homePrincipalTopBar";
import AdminFooter from "../AdminFooter";

const LayautHomePrincipal = () => {
  return (
    <div className="admin-layout">
      <HomePrincipalTopBar />
      <main className="admin-content">
        <Outlet />
      </main>
      <AdminFooter />
    </div>
  );
};

export default LayautHomePrincipal;
