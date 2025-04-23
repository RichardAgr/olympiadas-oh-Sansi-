import { Routes, Route, Navigate } from "react-router-dom";
import AppRouter from "./AppRouter";
import AppRouteRespGest from "./AppRouteRespGest";
import Login from "../page/home/login";
import AppRouteTutor from "./AppRouteTutor";
function AppRouteLogin() {
  return (
    <Routes>
     <Route path="/" element={<Navigate to="/login" />} />
      <Route path="login" element={<Login />} />
      <Route path="admin/*" element={<AppRouter />} />
      <Route path="respGest/*" element={<AppRouteRespGest />} />
      <Route path="tutor/:id/*" element={<AppRouteTutor />} />
      {/* Otras rutas de login */}
    </Routes>
  );
}

export default AppRouteLogin;
