import { Route, Routes } from 'react-router-dom'
import NiveauxClassePage from '../../../../pages/admin/Configuration/NiveauxClasse/NiveauxClassePage'
import NewNiveauClassePage from '../../../../pages/admin/Configuration/NiveauxClasse/NewNiveauClassePage'
import UpdateNiveauClassePage from '../../../../pages/admin/Configuration/NiveauxClasse/UpdateNiveauClassePage'
import NiveauClasseDetailsPage from '../../../../pages/admin/Configuration/NiveauxClasse/NiveauClasseDetailsPage'

export default function NiveauClasseNav() {
    return (
        <Routes>
            <Route path='/' element={<NiveauxClassePage />} />
            <Route path='/new' element={<NewNiveauClassePage />} />
            <Route path='/update' element={<UpdateNiveauClassePage />} />
            <Route path='/details' element={<NiveauClasseDetailsPage />} />


        </Routes>
    )
}
