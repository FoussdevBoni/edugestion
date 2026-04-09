import { Route, Routes } from "react-router-dom";
import BulletinsPage from "../../../pages/admin/Bulletins/BulletinsPage";
import UpdateBulletinPage from "../../../pages/admin/Bulletins/UpdateBulletinPage";
import BulletinDetailsPage from "../../../pages/admin/Bulletins/BulletinDetailsPage";
import GenerateCalculsPage from "../../../pages/admin/Bulletins/GenerateCalculsPage";
import NewBulletinsPage from "../../../pages/admin/Bulletins/NewBulletinsPage";
import ConduitePage from "../../../pages/admin/Bulletins/ConduitePage";

export default function BulletinNav() {
    return (
        <Routes>
            <Route path='/' element={
                <BulletinsPage />
            } />
            <Route path='/update' element={<UpdateBulletinPage />} />
            <Route path='/details' element={<BulletinDetailsPage />} />
            <Route path='/calculate' element={<GenerateCalculsPage />} />
            <Route path='/new' element={<NewBulletinsPage />} />
            <Route path='/conduite' element={<ConduitePage />} />

        </Routes>
    )
}
