import { Outlet, useParams } from "react-router-dom";
import TutorTopBar from "./TutorTopBar";
import AdminFooter from "../AdminFooter";

const TutorLayout = () => {
    
  return (
    <div className="admin-layout">
      <TutorTopBar />
      <main className="admin-content">
        <Outlet />
      </main>
      <AdminFooter />
    </div>
  );
};

export default TutorLayout;
