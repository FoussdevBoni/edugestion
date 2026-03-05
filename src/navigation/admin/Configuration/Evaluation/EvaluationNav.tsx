import { Route, Routes } from 'react-router-dom'
import EvaluationsPage from '../../../../pages/admin/Configuration/Evaluations/EvaluationsPage'
import NewEvaluationPage from '../../../../pages/admin/Configuration/Evaluations/NewEvaluationPage'
import UpdateEvaluationPage from '../../../../pages/admin/Configuration/Evaluations/UpdateEvaluationPage'
import EvaluationDetailsPage from '../../../../pages/admin/Configuration/Evaluations/EvaluationDetailsPage'

export default function EvaluationNav() {
    return (
        <Routes>
            <Route path='/' element={<EvaluationsPage />} />
            <Route path='/new' element={<NewEvaluationPage />} />
            <Route path='/update' element={<UpdateEvaluationPage />} />
            <Route path='/details' element={<EvaluationDetailsPage />} />
        </Routes>
    )
}
