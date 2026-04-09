import { Route, Routes } from "react-router-dom";
import EcoleInfosPage from "../../../../pages/admin/Configuration/EcoleInfos/EcoleInfosPage";
import UpdateEcoleInfosPage from "../../../../pages/admin/Configuration/EcoleInfos/UpdateEcoleInfosPage";
import NewEcoleInfosPage from "../../../../pages/admin/Configuration/EcoleInfos/NewEcoleInfosPage";

export default function EcoleNav() {
    return (
        <Routes>
            <Route path='/' element={<EcoleInfosPage />} />
            <Route path='/update' element={<UpdateEcoleInfosPage />} />
            <Route path='/new' element={<NewEcoleInfosPage />} />

        </Routes>
    )
}
