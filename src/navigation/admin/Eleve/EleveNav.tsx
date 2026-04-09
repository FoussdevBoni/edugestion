import { Route, Routes } from 'react-router-dom'
import ElevesPage from '../../../pages/admin/Eleves/ElevesPage'
import NewElevePage from '../../../pages/admin/Eleves/NewElevePage'
import UpdateElevePage from '../../../pages/admin/Eleves/UpdateElevePage'
import EleveDetailsPage from '../../../pages/admin/Eleves/EleveDetailsPage'
import ImportElevesPage from '../../../pages/admin/Eleves/ImportElevesPage'
import TransfertElevesPage from '../../../pages/admin/Eleves/TransfertElevesPage'
import UploadElevePhotosPage from '../../../pages/admin/Eleves/UploadElevePhotosPage'
import CarteIdentitePage from '../../../pages/admin/Cartes/CarteIdentitePage'

export default function EleveNav() {
    return (
        <Routes>
            <Route path='/' element={<ElevesPage />} />
            <Route path='/new' element={<NewElevePage />} />
            <Route path='/update' element={<UpdateElevePage />} />
            <Route path='/details' element={<EleveDetailsPage />} />
            <Route path='/import' element={<ImportElevesPage />} />
            <Route path='/transfert' element={<TransfertElevesPage />} />
            <Route path='/upload-photos' element={<UploadElevePhotosPage />} />
            <Route path='/cards' element={<CarteIdentitePage />} />


        </Routes>
    )
}
