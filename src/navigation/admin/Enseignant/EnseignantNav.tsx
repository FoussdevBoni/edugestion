import { Route, Routes } from "react-router-dom";
import EnseignantsPage from "../../../pages/admin/Enseignant/EnseignantsPage";
import NewEnseignantPage from "../../../pages/admin/Enseignant/NewEnseignantPage";
import UpdateEnseignantPage from "../../../pages/admin/Enseignant/UpdateEnseignantPage";
import EnseignantDetailsPage from "../../../pages/admin/Enseignant/EnseignantDetailsPage";

export default function EnseigantNav() {
  return (
    <Routes>
      <Route path='/' element={<EnseignantsPage />} />
      <Route path='/new' element={<NewEnseignantPage />} />
      <Route path='/update' element={<UpdateEnseignantPage />} />
      <Route path='/details' element={<EnseignantDetailsPage />} />
    </Routes>
  )
}
