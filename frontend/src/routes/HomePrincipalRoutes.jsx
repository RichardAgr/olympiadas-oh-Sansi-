import { Routes, Route, Navigate } from "react-router-dom";

import LayautHomePrincipal from "../components/HomePrincipalLayaut/layautHomePrincipal";
import HomePrincipal from "../page/home/HomePrincipal";
import AppRouteLogin from "./AppRouteLogin";
import AppRouter from "./AppRouter";
import AppRouteRespGest from "./AppRouteRespGest";
import AppRouteTutor from "./AppRouteTutor";


function HomePrincipalRoutes() {
   return (
    <Routes>
      <Route path="/" element={<Navigate to="/homePrincipal" />} />

      {/* Layout principal con login */}
      <Route path="/homePrincipal" element={<LayautHomePrincipal />}>
      <Route index element={<HomePrincipal />} />
        <Route path="login" element={<AppRouteLogin />} />
      </Route>

      {/* Rutas independientes según rol */}
      <Route path="/admin/*" element={<AppRouter />} />
      <Route path="/respGest/*" element={<AppRouteRespGest />} />
      <Route path="/homeTutor/:id/tutor/*" element={<AppRouteTutor />} />
    </Routes>
  );
}
export default HomePrincipalRoutes;
