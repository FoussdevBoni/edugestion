import { Route, Routes } from 'react-router-dom'
import NewPaiementPage from '../../../pages/admin/Paiements/NewPaiementPage'
import UpdatePaiementPage from '../../../pages/admin/Paiements/UpdatePaiementPage'
import PaiementDetailsPage from '../../../pages/admin/Paiements/PaiementDetailsPage'
import PaiementsPage from '../../../pages/admin/Paiements/PaiementsPage'

export default function PaiementNav() {
  return (
    <Routes>
      <Route path='/' element={<PaiementsPage />} />
      <Route path='/new' element={<NewPaiementPage />} />
      <Route path='/update' element={<UpdatePaiementPage />} />
      <Route path='/details' element={<PaiementDetailsPage />} />


    </Routes>
  )

}
