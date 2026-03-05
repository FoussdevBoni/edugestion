import { Route, Routes } from "react-router-dom";
import NewMatierePage from "../../../../pages/admin/Configuration/Matieres/NewMatierePage";
import UpdateMatierePage from "../../../../pages/admin/Configuration/Matieres/UpdateMatierePage";
import MatiereDetailsPage from "../../../../pages/admin/Configuration/Matieres/MatiereDetailsPage";
import MatieresPage from "../../../../pages/admin/Configuration/Matieres/MatieresPage";

export default function MatiereNav() {
    return (
        <Routes>
            <Route path='/' element={<MatieresPage />} />
            <Route path='/new' element={<NewMatierePage />} />
            <Route path='/update' element={<UpdateMatierePage />} />
            <Route path='/details' element={<MatiereDetailsPage />} />
        </Routes>
    )
}
