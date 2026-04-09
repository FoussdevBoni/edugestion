import { Route, Routes } from 'react-router-dom'
import NewInscriptionPage from '../../../pages/admin/Inscriptions/ReinscriptionPage'
import UpdateInscriptionPage from '../../../pages/admin/Inscriptions/UpdateInscriptionPage'
import InscriptionDetailsPage from '../../../pages/admin/Inscriptions/InscriptionDetailsPage'
import InscriptionsPage from '../../../pages/admin/Inscriptions/InscriptionsPage'

export default function InscriptionNav() {
    return (
        <Routes>
            <Route path='/' element={<InscriptionsPage />} />
            <Route path='/new' element={<NewInscriptionPage />} />
            <Route path='/update' element={<UpdateInscriptionPage />} />
            <Route path='/details' element={<InscriptionDetailsPage />} />


        </Routes>
    )
}
