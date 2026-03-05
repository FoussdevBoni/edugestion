import { Route, Routes } from "react-router-dom";
import EcoleInfosPage from "../../../../pages/admin/Configuration/EcoleInfos/EcoleInfosPage";
import UpdateEcoleInfosPage from "../../../../pages/admin/Configuration/EcoleInfos/UpdateEcoleInfosPage";

export default function EcoleNav() {
    return (
        <Routes>
            <Route path='/' element={<EcoleInfosPage />} />
            <Route path='/update' element={<UpdateEcoleInfosPage />} />

        </Routes>
    )
}
