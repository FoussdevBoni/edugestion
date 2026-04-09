import { Navigate, Route, Routes } from "react-router-dom"
import DashboardLayout from "../../layouts/DashboardLayout"
import EleveNav from "./Eleve/EleveNav"
import EnseignantNav from "./Enseignant/EnseignantNav"
import ConfigurationNav from "./Configuration/ConfigurationNav"
import InscriptionNav from "./Inscription/InscriptionNav"
import PaiementNav from "./Paiement/PaiementNav"
import EmploiDuTempNav from "./EmploieDuTemp/EmploiDuTempNav"
import NoteNav from "./Note/NoteNav"
import ComptabiliteNav from "./Comptabilite/ComptabiliteNav"
import DashboardPage from "../../pages/admin/DashboardPage"
import BulletinNav from "./Bulletin/BulletinNav"
import ProtectedRoute from "../../components/auth/ProtectedRoutes"
import EcoleRequired from "../../components/auth/EcoleRequired"
import MatiereNav from "./Configuration/Matiere/MatiereNav"
import ClasseNav from "./Configuration/Classe/ClasseNav"
import PortailScolaire from "../../pages/admin/HomePage"

const MainNav = () => {
  return (
    <Routes>
      <Route path='/home' element={<PortailScolaire />} />
      <Route path='/dashboard' element={<DashboardPage />} />
      <Route path='/configuration/*' element={<ConfigurationNav />} />
      <Route path='/eleves/*' element={<EleveNav />} />
      <Route path='/matieres/*' element={<MatiereNav />} />
      <Route path='/classes/*' element={<ClasseNav />} />
      <Route path='/enseignants/*' element={<EnseignantNav />} />
      <Route path='/inscriptions/*' element={<InscriptionNav />} />
      <Route path='/paiements/*' element={<PaiementNav />} />
      <Route path='/emploie-temps/*' element={<EmploiDuTempNav />} />
      <Route path='/notes/*' element={<NoteNav />} />
      <Route path='/comptabilite/*' element={<ComptabiliteNav />} />
      <Route path='/bulletins/*' element={<BulletinNav />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default function AdminNav() {
  return (
    <ProtectedRoute>
      <EcoleRequired>
        <DashboardLayout>
          <Routes>
            <Route path="/*" element={<MainNav />} />
          </Routes>
        </DashboardLayout>
      </EcoleRequired>
    </ProtectedRoute>
  )
}