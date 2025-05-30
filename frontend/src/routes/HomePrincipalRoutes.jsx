import { Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "../routes/PrivateRoutes";
import LayautHomePrincipal from "../components/HomePrincipalLayaut/layautHomePrincipal";
import HomePrincipal from "../page/home/HomePrincipal";
import AppRouteLogin from "./AppRouteLogin";
import AppRouter from "./AppRouter";
import AppRouteRespGest from "./AppRouteRespGest";
import AppRouteTutor from "./AppRouteTutor";
import Registrate from "../page/Login/Registrate";
import RecuperarContraseña from "../page/Login/RecuperarContraseña";
import AreasCompetencia from "../page/home/AreasCompetencia";


function HomePrincipalRoutes() {
   return (
    <Routes>
      <Route path="/" element={<Navigate to="/homePrincipal" />} />

      {/* Layout principal con login */}
      <Route path="/homePrincipal" element={<LayautHomePrincipal />}>
      <Route index element={<HomePrincipal />} />
        <Route path="login/*" element={<AppRouteLogin />} />
        <Route path="areasCompetencia" element={<AreasCompetencia />}/>
        <Route path="registrate" element={<Registrate />} />
        <Route path="recuperarContraseña" element={<RecuperarContraseña />} />
      </Route>

      <Route
        path="/admin/*"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <AppRouter />
          </PrivateRoute>
        }
      />

      <Route
        path="/respGest/*"
        element={
          <PrivateRoute allowedRoles={["responsable"]}>
            <AppRouteRespGest />
          </PrivateRoute>
        }
      />

      <Route
        path="/homeTutor/:id/tutor/*"
        element={
          <PrivateRoute allowedRoles={["tutor"]}>
            <AppRouteTutor />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}
export default HomePrincipalRoutes;
