import { Navigate, Route, Routes } from "react-router-dom"
import Dashboard from "../../pages/admin/Dashboard"
import ComptabilitePage from "../../pages/admin/ComptabilitePage"
import CarteIdentitesPage from "../../pages/admin/CarteIdentitesPage"
import BulletinsPage from "../../pages/admin/BulletinsPage"
import NotesPage from "../../pages/admin/NotesPage"
import InscriptionsPage from "../../pages/admin/InscriptionsPage"
import LicencesPage from "../../pages/admin/LicencesPage"
import ParamettresPage from "../../pages/admin/ParametresPage"
import PaiementsPage from "../../pages/admin/PaiementsPage"
import EmploieDuTempPage from "../../pages/admin/EmploieDuTempPage"
import DashboardLayout from "../../layouts/DashboardLayout"
import EleveNav from "./Eleve/EleveNav"
import EnseignantNav from "./Enseignant/EnseignantNav"
import ConfigurationNav from "./Configuration/ConfigurationNav"

const MainNav = () => {
  return (
    <DashboardLayout>
      <Routes>
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/configuration/*' element={<ConfigurationNav />} />
        <Route path='/eleves/*' element={<EleveNav />} />
        <Route path='/enseignants/*' element={<EnseignantNav />} />


        <Route path='/comptabilite' element={<ComptabilitePage />} />
        <Route path='/carte-identite' element={<CarteIdentitesPage />} />
        <Route path='/bulletins' element={<BulletinsPage />} />
        <Route path='/notes' element={<NotesPage />} />
        <Route path='/inscriptions' element={<InscriptionsPage />} />
        <Route path='/emploie-temps' element={<EmploieDuTempPage />} />
        <Route path='/paiements' element={<PaiementsPage />} />
        <Route path='/parametres' element={<ParamettresPage />} />
        <Route path='/licences' element={<LicencesPage />} />

        <Route path="*" element={<Navigate to="/dashboard" replace />} />

      </Routes>
    </DashboardLayout>

  )
}

export default function AdminNav() {
  return (
    <Routes>
      <Route path="/*" element={<MainNav />} />
    </Routes>
  )
}
