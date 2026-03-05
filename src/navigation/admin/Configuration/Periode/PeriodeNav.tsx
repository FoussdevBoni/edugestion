import { Route, Routes } from "react-router-dom";
import PeriodesPage from "../../../../pages/admin/Configuration/Periodes/PeriodesPage";
import NewPeriodePage from "../../../../pages/admin/Configuration/Periodes/NewPeriodePage";
import UpdatePeriodePage from "../../../../pages/admin/Configuration/Periodes/UpdatePeriodePage";
import ClasseDetailsPage from "../../../../pages/admin/Configuration/Classes/ClasseDetailsPage";

export default function PeriodeNav() {
     return (
         <Routes>
             <Route path='/' element={<PeriodesPage />} />
             <Route path='/new' element={<NewPeriodePage />} />
             <Route path='/update' element={<UpdatePeriodePage />} />
             <Route path='/details' element={<ClasseDetailsPage />} />
 
 
         </Routes>
     )
}
