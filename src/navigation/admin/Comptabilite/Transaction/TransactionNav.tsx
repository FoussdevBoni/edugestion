import { Route, Routes } from 'react-router-dom'
import TransactionsPage from '../../../../pages/admin/Comptabilite/transaction/TransactionsPage'
import TransactionDetailsPage from '../../../../pages/admin/Comptabilite/transaction/TransactionDetailsPage'



export default function TransactionNav() {
    return (
        <Routes>
            <Route path='/' element={<TransactionsPage />} />
       
            <Route path='/details' element={<TransactionDetailsPage />} />


        </Routes>
    )
}
