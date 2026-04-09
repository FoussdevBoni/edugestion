import { Route, Routes } from 'react-router-dom'
import NewClassePage from '../../../../pages/admin/Configuration/Classes/NewClassePage'
import UpdateClassePage from '../../../../pages/admin/Configuration/Classes/UpdateClassePage'
import ClasseDetailsPage from '../../../../pages/admin/Configuration/Classes/ClasseDetailsPage'
import ClassesPage from '../../../../pages/admin/Configuration/Classes/ClassesPage'

interface PagesProps {
  config?: boolean
}
export default function ClasseNav({config}: PagesProps) {
    return (
        <Routes>
            <Route path='/' element={<ClassesPage config={config}   />} />
            <Route path='/new' element={<NewClassePage config={config}  />} />
            <Route path='/update' element={<UpdateClassePage  config={config} />} />
            <Route path='/details' element={<ClasseDetailsPage config={config}  />} />


        </Routes>
    )
}
