import { Route, Routes } from "react-router-dom";
import LicenseScreen from "../../pages/auth/LicenceScreen";

export default function AdminNav() {
  return (
    <Routes>
       <Route path="/login" element={<LicenseScreen />} />
    </Routes>
  )
}