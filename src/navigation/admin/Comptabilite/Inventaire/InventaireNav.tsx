import { Route, Routes } from "react-router-dom";
import InventairesPage from "../../../../pages/admin/Comptabilite/inventaire/InventairesPage";
import NouvelInventairePage from "../../../../pages/admin/Comptabilite/inventaire/NouvelInventairePage";
import InventaireEditPage from "../../../../pages/admin/Comptabilite/inventaire/InventaireEditPage";
import InventaireDetailsPage from "../../../../pages/admin/Comptabilite/inventaire/InventaireDetailsPage";



export default function InventaireNav() {
    return (
        <Routes>
            <Route path='/' element={<InventairesPage />} />
            <Route path='/new' element={<NouvelInventairePage />} />
            <Route path='/update' element={<InventaireEditPage />} />
            <Route path='/details' element={<InventaireDetailsPage />} />


        </Routes>
    )
}
