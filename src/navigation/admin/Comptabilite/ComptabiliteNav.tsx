import { Route, Routes } from 'react-router-dom'
import AchatNav from './Achat/AchatNav'
import MaterielNav from './Materiel/MaterielNav'
import InventaireNav from './Inventaire/InventaireNav'
import TransactionNav from './Transaction/TransactionNav'
import StatsPage from '../../../pages/admin/Comptabilite/StatsPage'
import ComptabiliteLayout from '../../../layouts/comptabilite/ComptabiliteLayout'
import ChargeNav from './Charge/ChargeNav'
import MouvementNav from './Mouvement/MouvementNav'



export default function ComptabiliteNav() {
    return (
       <ComptabiliteLayout>
         <Routes>
            <Route path='/' element={<StatsPage />} />
            <Route path='/accueil' element={<StatsPage />} />
            <Route path='/achats/*' element={<AchatNav />} />
            <Route path='/materiel/*' element={<MaterielNav />} />
            <Route path='/inventaires/*' element={<InventaireNav />} />
            <Route path='/transactions/*' element={<TransactionNav />} />
            <Route path='/charges/*' element={<ChargeNav />} />
            <Route path='/mouvements/*' element={<MouvementNav />} />


        </Routes>
       </ComptabiliteLayout>
    )
}
