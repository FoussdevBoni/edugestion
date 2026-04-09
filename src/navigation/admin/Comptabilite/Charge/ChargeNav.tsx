import { Route, Routes } from 'react-router-dom'
import ChargesPage from '../../../../pages/admin/Comptabilite/charge/ChargesPage'
import NouvelleChargePage from '../../../../pages/admin/Comptabilite/charge/NouvelleChargePage'
import ChargeEditPage from '../../../../pages/admin/Comptabilite/charge/ChargeEditPage'
import ChargeDetailsPage from '../../../../pages/admin/Comptabilite/charge/ChargeDetailsPage'
export default function ChargeNav() {
  return (
   <Routes>
            <Route path='/' element={<ChargesPage />} />
            <Route path='/new' element={<NouvelleChargePage />} />
            <Route path='/update' element={<ChargeEditPage />} />
            <Route path='/details' element={<ChargeDetailsPage />} />


        </Routes>
  )
}
