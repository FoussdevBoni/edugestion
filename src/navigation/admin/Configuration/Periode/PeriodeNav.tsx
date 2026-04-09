import { Route, Routes } from "react-router-dom";
import PeriodesPage from "../../../../pages/admin/Configuration/Periodes/PeriodesPage";
import NewPeriodePage from "../../../../pages/admin/Configuration/Periodes/NewPeriodePage";
import UpdatePeriodePage from "../../../../pages/admin/Configuration/Periodes/UpdatePeriodePage";
import PeriodeDetailsPage from "../../../../pages/admin/Configuration/Periodes/PeriodeDetailsPage";

export default function PeriodeNav() {
     return (
         <Routes>
             <Route path='/' element={<PeriodesPage />} />
             <Route path='/new' element={<NewPeriodePage />} />
             <Route path='/update' element={<UpdatePeriodePage />} />
             <Route path='/details' element={<PeriodeDetailsPage />} />
 
 
         </Routes>
     )
}
