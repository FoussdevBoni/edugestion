import { Route, Routes } from "react-router-dom";
import DataManagementPage from "../../../pages/admin/Data/DataManagementPage";


export default function DataNav() {
    return (
        <Routes>
            <Route path='/' element={
                <DataManagementPage />
            } />
            

        </Routes>
    )
}
