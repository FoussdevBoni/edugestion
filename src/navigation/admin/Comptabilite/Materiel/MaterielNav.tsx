import { Route, Routes } from 'react-router-dom'
import MaterielPage from '../../../../pages/admin/Comptabilite/materiel/MaterielPage'
import MaterielNouveauPage from '../../../../pages/admin/Comptabilite/materiel/MaterielNouveauPage'
import MaterielEditPage from '../../../../pages/admin/Comptabilite/materiel/MaterielEditPage'
import MaterielDetailsPage from '../../../../pages/admin/Comptabilite/materiel/MaterielDetailsPage'



export default function MaterielNav() {
    return (
        <Routes>
            <Route path='/' element={<MaterielPage />} />
            <Route path='/new' element={<MaterielNouveauPage />} />
            <Route path='/update' element={<MaterielEditPage />} />
            <Route path='/details' element={<MaterielDetailsPage />} />


        </Routes>
    )
}
