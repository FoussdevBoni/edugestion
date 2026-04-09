import { Route, Routes } from "react-router-dom";
import NiveauScolaireNav from "./NiveauScolaire/NiveauScolaireNav";
import CycleNav from "./Cycle/CycleNav";
import NiveauClasseNav from "./NiveauClasse/NiveauClasseNav";
import ClasseNav from "./Classe/ClasseNav";
import PeriodeNav from "./Periode/PeriodeNav";
import EvaluationNav from "./Evaluation/EvaluationNav";
import ConfigurationLayout from "../../../layouts/configuration/ConfigurationLayout";
import MatiereNav from "./Matiere/MatiereNav";
import EcoleNav from "./Ecole/EcoleNav";
import EcoleInfosPage from "../../../pages/admin/Configuration/EcoleInfos/EcoleInfosPage";
import ImportDataPage from "../../../pages/admin/Configuration/ImportDataPage";

export default function ConfigurationNav() {
    return (
        <ConfigurationLayout>
            <Routes>
                <Route path='/' element={<EcoleInfosPage />} />
                <Route path='/import' element={<ImportDataPage />} />
                <Route path='/ecole/*' element={<EcoleNav />} />
                <Route path='/niveaux-scolaire/*' element={<NiveauScolaireNav />} />
                <Route path='/cycles/*' element={<CycleNav />} />
                <Route path='/niveaux-classe/*' element={<NiveauClasseNav />} />
                <Route path='/periodes/*' element={<PeriodeNav />} />
                <Route path='/evaluations/*' element={<EvaluationNav />} />
                <Route path='/matieres/*' element={<MatiereNav config={true} />} />
                <Route path='/classes/*' element={<ClasseNav config={true} />} />

            </Routes>
        </ConfigurationLayout>
    )
}
