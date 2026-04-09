import { Route, Routes } from 'react-router-dom'
import MouvementsPage from '../../../../pages/admin/Comptabilite/mouvements/MouvementsPage'
import MouvementDetailsPage from '../../../../pages/admin/Comptabilite/mouvements/MouvementDetailsPage'

export default function MouvementNav() {
    return (
        <Routes>
            <Route path='/' element={<MouvementsPage />} />
            <Route path='/details' element={<MouvementDetailsPage />} />

        </Routes>
    )
}
