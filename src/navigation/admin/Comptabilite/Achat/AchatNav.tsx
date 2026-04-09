import { Route, Routes } from 'react-router-dom'
import AchatsPage from '../../../../pages/admin/Comptabilite/achat/AchatsPage'
import NouvelAchatPage from '../../../../pages/admin/Comptabilite/achat/NouvelAchatPage'
import AchatEditPage from '../../../../pages/admin/Comptabilite/achat/AchatEditPage'
import AchatDetailsPage from '../../../../pages/admin/Comptabilite/achat/AchatDetailsPage'


export default function AchatNav() {
    return (
        <Routes>
            <Route path='/' element={<AchatsPage />} />
            <Route path='/new' element={<NouvelAchatPage />} />
            <Route path='/update' element={<AchatEditPage />} />
            <Route path='/details' element={<AchatDetailsPage />} />


        </Routes>
    )
}
