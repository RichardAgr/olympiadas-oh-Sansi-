import { Routes, Route } from "react-router-dom";
import TutorLayout from "../components/TutorLayaut/TutorLayaut";
import TutorHome from "../page/tutor/HomeTutor/TutorHome";

function AppRouteTutor() {
  return (
    <Routes>
      <Route path="" element={<TutorLayout />}>
        <Route index element={<TutorHome />} />
        {/* Otras rutas dentro de homeRespGestion */}
      </Route>
    </Routes>
  );
}

export default AppRouteTutor;
