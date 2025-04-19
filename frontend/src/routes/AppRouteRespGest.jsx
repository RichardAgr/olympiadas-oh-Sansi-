import { Routes, Route } from "react-router-dom";
import HomeResponsable from "../page/reponsableGestion/HomeRespGest";
import RespGestLayout from "../components/RespGestLayout";
import ListIns from "../page/reponsableGestion/ListaInscritos";
import ListaTutores from "../page/reponsableGestion/ListaTutores";
import ValidarPagos from "../page/reponsableGestion/ValidacionDePagos";
import DetalleCompetidoresInscritos from "../page/reponsableGestion/DetalleCompetidoresInscritos";
import EstadoTutores from "../page/reponsableGestion/EstadoTutores";
import Prueba from "../page/reponsableGestion/VisualListTutor";

function AppRouteRespGest() {
  return (
    <Routes>
      <Route path="" element={<RespGestLayout />}>
        <Route index element={<HomeResponsable />} />
        {/* Otras rutas dentro de homeRespGestion */}
        <Route path="ListIns" element={<ListIns />} />
        <Route path="ListaTutores" element={<ListaTutores />} />
        <Route path="ValidarPagos" element={<ValidarPagos />} />
        <Route path="DetalleCompetidoresInscritos" element={<DetalleCompetidoresInscritos />} />
        <Route path="EstadoTutores" element={<EstadoTutores />} />
        <Route path="VisualListTutor" element={<Prueba />} />
      </Route>
    </Routes>
  );
}

export default AppRouteRespGest;
