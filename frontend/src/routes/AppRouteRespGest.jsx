import { Routes, Route,useParams } from "react-router-dom";
import HomeResponsable from "../page/reponsableGestion/HomeResponsable/HomeRespGest";
import RespGestLayout from "../components/RespGestLayout";
import ListIns from "../page/reponsableGestion/HU8-ListaCompetidores/ListaInscritos";
import VisualizarListaPagos from "../page/reponsableGestion/HU12VisualizarListaPagos/viewComponent/VisualizarListaPagos";
import DetalleCompetidoresInscritos from "../page/reponsableGestion/HU13-VerDetallesCompetidores/DetalleCompetidoresInscritos";
import EstadoTutores from "../page/reponsableGestion/HU11-HabilitarDeshabilitarTutores/EstadoTutores";
import VerDetallesPago  from "../components/verDetallesPago/VerDetallesPago";
import Tutores from "../page/reponsableGestion/HU9-ListaTutores/VisualListTutor";
import CompetidoresPage from "../page/reponsableGestion/HU10-HabilitarDeshabilitarCompetidor/viewComponent/CompetidoresPage";
import InformacionCompetidor from "../components/informacionCompetidor/InformacionCompetidor";
import MiPerfilRespGestion from "../page/reponsableGestion/PerfilResponsable/MiPerfilRespGestion";
import ConfiguracionRespGestion from "../page/reponsableGestion/EditarPerfilResponsable/ConfiguracionRespGestion";
import { CompetenciaProvider } from "../context/ContextIdCompetencia/idCompetencia";


function AppRouteRespGest() {
    const { id_respGest } = useParams()
  return (
    <CompetenciaProvider id_respGest={id_respGest}>
    <Routes>
      <Route path="" element={<RespGestLayout />}>
        <Route index element={<HomeResponsable />} />
        {/* Otras rutas dentro de homeRespGestion */}
        <Route path="ListIns" element={<ListIns />} />
        <Route path="ValidarPagos" element={<VisualizarListaPagos />} />
        <Route path="DetalleCompetidoresInscritos" element={<DetalleCompetidoresInscritos />} />
        <Route path="EstadoTutores" element={<EstadoTutores />} />
        <Route path="DetallePago" element={<VerDetallesPago />} />
        <Route path="VisualListTutor" element={<Tutores />} />
        <Route path="EstadoCompetidores" element={<CompetidoresPage />} />
        <Route path="DatosCompetidor/:id" element={< InformacionCompetidor />}/>
        <Route path="MiPerfil" element={<MiPerfilRespGestion />} />
        <Route path="Configuracion" element={<ConfiguracionRespGestion />} />
        

      </Route>
    </Routes>
    </CompetenciaProvider>
  );
}

export default AppRouteRespGest;
