import { Route, Routes } from 'react-router-dom'
import VentesPage from '../../../../pages/admin/Comptabilite/vente/VentesPage'
import NouvelleVentePage from '../../../../pages/admin/Comptabilite/vente/NouvelleVentePage'
import UpdateVentePage from '../../../../pages/admin/Comptabilite/vente/UpdateVentePage'
import VenteDetailsPage from '../../../../pages/admin/Comptabilite/vente/VenteDetailsPage'



export default function VenteNav() {
    return (
        <Routes>
            <Route path='/' element={<VentesPage />} />
            <Route path='/new' element={<NouvelleVentePage />} />
            <Route path='/update' element={<UpdateVentePage />} />
            <Route path='/details' element={<VenteDetailsPage />} />


        </Routes>
    )
}
