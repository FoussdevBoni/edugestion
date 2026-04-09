import { Route, Routes } from "react-router-dom";
import NewMatierePage from "../../../../pages/admin/Configuration/Matieres/NewMatierePage";
import UpdateMatierePage from "../../../../pages/admin/Configuration/Matieres/UpdateMatierePage";
import MatiereDetailsPage from "../../../../pages/admin/Configuration/Matieres/MatiereDetailsPage";
import MatieresPage from "../../../../pages/admin/Configuration/Matieres/MatieresPage";

interface PagesProps {
  config?: boolean
}


export default function MatiereNav({config}: PagesProps) {
    return (
        <Routes>
            <Route path='/' element={<MatieresPage config={config} />} />
            <Route path='/new' element={<NewMatierePage config={config}  />} />
            <Route path='/update' element={<UpdateMatierePage  config={config} />} />
            <Route path='/details' element={<MatiereDetailsPage config={config}  />} />
        </Routes>
    )
}
