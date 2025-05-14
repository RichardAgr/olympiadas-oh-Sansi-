import { Routes, Route } from "react-router-dom";
import TutorLayout from "../components/TutorLayaut/TutorLayaut";
import TutorHome from "../page/tutor/HomeTutor/TutorHome";
import ListaCompetidores from "../page/tutor/016-VerCompetidores/ListaCompetidores";
import EditarCompetidores from "../page/tutor/019-EditarCompetidores/EditarCompetidores";
import BoletasView from "../page/tutor/023-VerBoletas/BoletasView";
import NotificacionesTutor from "../page/tutor/025-Notificaciones/NotificacionesTutor";
import MiPerfil from "../page/tutor/026-InformacionPersonalTutor/MiPerfil";
import Configuracion from "../page/tutor/027-EditarInformacionPersonalTutor/Configuracion";
import Login from "../page/home/login";
import SubirComprobante from "../page/tutor/024-SubirComprobante/SubirComprobante";
import InscribirManual from "../page/tutor/020-InscribirManual/InscribirManual";
import InscripcionExcel from "../page/tutor/017-InscripcionExcel/InscripcionExcel";
import VerRecibos from "../page/tutor/028-VerRecibos/VerRecibos";


function AppRouteTutor() {
  return (
    <Routes>
      <Route path="" element={<TutorLayout />}>
        <Route index element={<TutorHome />} />
        {/* Otras rutas dentro de homeRespGestion */}
        <Route path="ListaCompetidores" element={<ListaCompetidores />} />
        <Route path="ListaCompetidores/editarCompetidores/:idCompetidor" element={<EditarCompetidores />} />
        <Route path="VerBoletas" element={<BoletasView />} />
        <Route path="NotificacionesTutor" element={<NotificacionesTutor />} />
        <Route path="MiPerfil" element={<MiPerfil/>}/>
        <Route path="Configuracion" element={<Configuracion/>}/>
        <Route path="login" element={<Login/>}/>
        <Route path="SubirComprobante" element={<SubirComprobante/>}/>
        <Route path="InscribirManual" element={<InscribirManual/>}/>
        <Route path="InscripcionExcel" element={<InscripcionExcel/>}/>
        <Route path="VerRecibos" element={<VerRecibos/>}/>
        {/* Puedes agregar más rutas aquí según sea necesario */}
      </Route>
    </Routes>
  );
}

export default AppRouteTutor;
