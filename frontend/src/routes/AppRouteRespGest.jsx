import { Routes, Route } from "react-router-dom";
import HomeResponsable from "../page/reponsableGestion/HomeRespGest";
import RespGestLayout from "../components/RespGestLayout";
import ListIns from "../page/reponsableGestion/ListaInscritos";
import ListaTutores from "../page/reponsableGestion/ListaTutores";
import VisualizarListaPagos from "../page/reponsableGestion/HU12VisualizarListaPagos/viewComponent/VisualizarListaPagos";
import DetalleCompetidoresInscritos from "../page/reponsableGestion/DetalleCompetidoresInscritos";
import EstadoTutores from "../page/reponsableGestion/EstadoTutores";
import VerDetallesPago  from "../components/verDetallesPago/VerDetallesPago";
import Tutores from "../page/reponsableGestion/VisualListTutor";
import CompetidoresPage from "../page/reponsableGestion/HU10-HabilitarDeshabilitarCompetidor/viewComponent/CompetidoresPage";
import InformacionCompetidor from "../components/informacionCompetidor/InformacionCompetidor";

function AppRouteRespGest() {
  return (
    <Routes>
      <Route path="" element={<RespGestLayout />}>
        <Route index element={<HomeResponsable />} />
        {/* Otras rutas dentro de homeRespGestion */}
        <Route path="ListIns" element={<ListIns />} />
        <Route path="ListaTutores" element={<ListaTutores />} />
        <Route path="ValidarPagos" element={<VisualizarListaPagos />} />
        <Route path="DetalleCompetidoresInscritos" element={<DetalleCompetidoresInscritos />} />
        <Route path="EstadoTutores" element={<EstadoTutores />} />
        <Route path="DetallePago" element={<VerDetallesPago />} />
        <Route path="VisualListTutor" element={<Tutores />} />
        <Route path="EstadoCompetidores" element={<CompetidoresPage />} />
        <Route path="DatosCompetidor/:id" element={< InformacionCompetidor />}/>
      </Route>
    </Routes>
  );
}

export default AppRouteRespGest;
