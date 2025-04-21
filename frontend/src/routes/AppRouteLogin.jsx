import { Routes, Route, Navigate } from "react-router-dom";
import AppRouter from "./AppRouter";
import AppRouteRespGest from "./AppRouteRespGest";
import Login from "../page/home/login";

function AppRouteLogin() {
  return (
    <Routes>
     <Route path="/" element={<Navigate to="/login" />} />
      <Route path="login" element={<Login />} />
      <Route path="admin/*" element={<AppRouter />} />
      <Route path="respGest/*" element={<AppRouteRespGest />} />
    </Routes>
  );
}

export default AppRouteLogin;
