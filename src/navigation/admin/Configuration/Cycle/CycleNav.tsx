import { Route, Routes } from 'react-router-dom'
import CyclesPage from '../../../../pages/admin/Configuration/Cycles/CyclesPage'
import NewCyclePage from '../../../../pages/admin/Configuration/Cycles/NewCyclePage'
import UpdateCyclePage from '../../../../pages/admin/Configuration/Cycles/UpdateCyclePage'
import CycleDetailsPage from '../../../../pages/admin/Configuration/Cycles/CycleDetailsPage'

export default function CycleNav() {
    return (
        <Routes>
            <Route path='/' element={<CyclesPage />} />
            <Route path='/new' element={<NewCyclePage />} />
            <Route path='/update' element={<UpdateCyclePage />} />
            <Route path='/details' element={<CycleDetailsPage />} />


        </Routes>
    )
}
