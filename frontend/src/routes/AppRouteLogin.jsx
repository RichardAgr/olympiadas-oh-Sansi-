import { Routes, Route, Navigate } from "react-router-dom";
import AppRouter from "./AppRouter";
import AppRouteRespGest from "./AppRouteRespGest";
import Login from "../page/Login/login"
import AppRouteTutor from "./AppRouteTutor";
function AppRouteLogin() {
  return (
     <Routes>
      <Route index element={<Login />} />
      <Route path="admin/*" element={<AppRouter />} />
      <Route path="respGest/*" element={<AppRouteRespGest />} />
      <Route path="homeTutor/:id/tutor/*" element={<AppRouteTutor />} />
    </Routes>
  );
}

export default AppRouteLogin;
