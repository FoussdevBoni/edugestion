import { Route, Routes } from 'react-router-dom'
import SeancesPage from '../../../pages/admin/Seances/SeancesPage'

export default function EmploiDuTempNav() {
    return (
        <Routes>
            <Route path='/' element={<SeancesPage />} />
        </Routes>
    )
}
