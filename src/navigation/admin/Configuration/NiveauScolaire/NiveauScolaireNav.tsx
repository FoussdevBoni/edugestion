import { Route, Routes } from 'react-router-dom'
import NiveauScolairesPage from '../../../../pages/admin/Configuration/NiveauxScolaire/NiveauxScolairePage'
import NewNiveauScolairePage from '../../../../pages/admin/Configuration/NiveauxScolaire/NewNiveauSolaire'
import UpdateNiveauScolairePage from '../../../../pages/admin/Configuration/NiveauxScolaire/UpdateNiveauScolairePage'
import NiveauScolaireDetailsPage from '../../../../pages/admin/Configuration/NiveauxScolaire/NiveauScolaireDetailsPage'

export default function NiveauScolaireNav() {
    return (
        <Routes>
            <Route path='/' element={<NiveauScolairesPage />} />
            <Route path='/new' element={<NewNiveauScolairePage />} />
            <Route path='/update' element={<UpdateNiveauScolairePage />} />
            <Route path='/details' element={<NiveauScolaireDetailsPage />} />


        </Routes>
    )
}
