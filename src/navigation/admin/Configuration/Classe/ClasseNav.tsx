import { Route, Routes } from 'react-router-dom'
import NewClassePage from '../../../../pages/admin/Configuration/Classes/NewClassePage'
import UpdateClassePage from '../../../../pages/admin/Configuration/Classes/UpdateClassePage'
import ClasseDetailsPage from '../../../../pages/admin/Configuration/Classes/ClasseDetailsPage'
import ClassesPage from '../../../../pages/admin/Configuration/Classes/ClassesPage'

export default function ClasseNav() {
    return (
        <Routes>
            <Route path='/' element={<ClassesPage />} />
            <Route path='/new' element={<NewClassePage />} />
            <Route path='/update' element={<UpdateClassePage />} />
            <Route path='/details' element={<ClasseDetailsPage />} />


        </Routes>
    )
}
