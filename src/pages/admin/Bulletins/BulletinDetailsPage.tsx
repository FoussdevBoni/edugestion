// src/pages/admin/bulletins/BulletinDetailsPage.tsx
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Download, Edit } from "lucide-react";
import { Bulletin } from "../../../utils/types/data";
import useBulletins from "../../../hooks/bulletins/useBulletins";
import useEcoleInfos from "../../../hooks/ecoleInfos/useEcoleInfos";

export default function BulletinDetailsPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { handleDownload } = useBulletins({});
    const bulletin: Bulletin = location.state;
    const { ecoleInfos } = useEcoleInfos()

    // Vérification de sécurité au début
    if (!bulletin || !bulletin.eleve) {
        return (
            <div className="text-center py-12 animate-fade-in-up">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 max-w-md mx-auto">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <p className="text-gray-500 text-center mb-4">Bulletin non trouvé ou données incomplètes</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="w-full px-4 py-2 bg-gradient-to-r from-primary to-primary/80 text-white rounded-lg hover:shadow-md transition-all duration-300"
                    >
                        Retour
                    </button>
                </div>
            </div>
        );
    }

    const getAppreciationColor = (appreciation: string) => {
        const colors: Record<string, string> = {
            "Excellent": "text-green-600 bg-green-50",
            "Très Bien": "text-blue-600 bg-blue-50",
            "Bien": "text-primary bg-primary/10",
            "Assez Bien": "text-yellow-600 bg-yellow-50",
            "Passable": "text-orange-600 bg-orange-50",
            "Insuffisant": "text-red-600 bg-red-50"
        };
        return colors[appreciation] || "text-gray-600 bg-gray-50";
    };

    // Sécurisation de l'accès aux données
    const moyennesParMatiere = bulletin.moyennesParMatiere || [];
    const colonnesNotes = moyennesParMatiere[0]?.notes?.items?.map(item => item.nom) || [];
    const vieScolaire = bulletin.vieScolaire || { absences: 0, retards: 0, conduite: null };
    const commentaires = bulletin.commentaires || { decisionConseil: "", observations: "" };
    const resultatFinal = bulletin.resultatFinal || { 
        totalPoints: 0, 
        totalCoefficients: 0, 
        moyenneGenerale: 0, 
        rang: 0,
        moyenneAnnuelle: null,
        moyennesPeriodesAnterieures: []
    };
    const periode = bulletin.periode || "Période";
    const eleve = bulletin.eleve || { prenom: "", nom: "", classe: "", matricule: "" };

    return (
        <div className="max-w-7xl mx-auto space-y-6 pb-8">
            {/* En-tête avec animation */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fade-in-up">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-300 group"
                    >
                        <ArrowLeft size={20} className="text-gray-600 group-hover:text-primary transition-colors" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            Bulletin de {eleve.prenom} {eleve.nom}
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">
                            {eleve.classe} • {periode} • {ecoleInfos?.anneeScolaire || ""}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate("/admin/bulletins/update", { state: bulletin })}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:shadow-md transition-all duration-300 hover:scale-[1.02]"
                    >
                        <Edit size={16} />
                        Modifier
                    </button>
                    <button
                        onClick={() => handleDownload(bulletin)}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:shadow-md transition-all duration-300 hover:scale-[1.02]"
                    >
                        <Download size={16} />
                        Télécharger
                    </button>
                </div>
            </div>

            {/* Entête du bulletin */}
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-sm border border-gray-100 p-6 transition-all duration-300 hover:shadow-md animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-xl">
                            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 uppercase tracking-wider">Élève</p>
                            <p className="font-semibold text-gray-800">{eleve.prenom} {eleve.nom}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-xl">
                            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-4 0h4" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 uppercase tracking-wider">Matricule</p>
                            <p className="font-semibold text-gray-800 font-mono">{eleve.matricule || "-"}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-xl">
                            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 uppercase tracking-wider">Classe</p>
                            <p className="font-semibold text-gray-800">{eleve.classe}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-xl">
                            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 uppercase tracking-wider">Période</p>
                            <p className="font-semibold text-gray-800">{periode} {ecoleInfos?.anneeScolaire || ""}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tableau des notes - uniquement si des données existent */}
            {moyennesParMatiere.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Matière</th>
                                    {colonnesNotes.map((nom, index) => (
                                        <th key={index} className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            {nom}
                                        </th>
                                    ))}
                                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Moyenne</th>
                                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Coef.</th>
                                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Points</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Appréciation</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {moyennesParMatiere.map((matiere, idx) => (
                                    <tr key={matiere.matiereId || idx} className="hover:bg-gray-50 transition-colors duration-200">
                                        <td className="px-6 py-4 font-semibold text-gray-800">{matiere.matiere || "-"}</td>
                                        {matiere.notes?.items?.map((item, idx2) => (
                                            <td key={idx2} className="px-6 py-4 text-center font-mono text-gray-700">
                                                {item.note ?? "-"}
                                            </td>
                                        ))}
                                        <td className="px-6 py-4 text-center font-mono font-bold text-primary text-lg">
                                            {matiere.moyenneVingtieme ?? "-"}
                                        </td>
                                        <td className="px-6 py-4 text-center font-mono text-gray-600">{matiere.coefficient ?? "-"}</td>
                                        <td className="px-6 py-4 text-center font-mono font-semibold text-gray-800">
                                            {matiere.pointsPonderes ?? "-"}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getAppreciationColor(matiere.appreciation || "")}`}>
                                                {matiere.appreciation || "-"}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Statistiques et décisions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Statistiques */}
                <div className="bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-sm border border-blue-100 p-6 transition-all duration-300 hover:shadow-md animate-fade-in-up" style={{ animationDelay: '400ms' }}>
                    <div className="flex items-center gap-2 mb-4">
                        <div className="p-2 bg-blue-500/10 rounded-lg">
                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <h3 className="font-semibold text-gray-800">Résultats</h3>
                    </div>
                    <dl className="space-y-3">
                        <div className="flex justify-between items-center p-2 rounded-lg hover:bg-white/50 transition-colors">
                            <dt className="text-gray-500">Total points</dt>
                            <dd className="font-mono font-bold text-gray-800">{resultatFinal.totalPoints ?? 0}</dd>
                        </div>
                        <div className="flex justify-between items-center p-2 rounded-lg hover:bg-white/50 transition-colors">
                            <dt className="text-gray-500">Total coefficients</dt>
                            <dd className="font-mono font-bold text-gray-800">{resultatFinal.totalCoefficients ?? 0}</dd>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-white/50 rounded-lg mt-2">
                            <dt className="text-gray-700 font-semibold">Moyenne générale</dt>
                            <dd className="font-mono font-bold text-primary text-2xl">
                                {resultatFinal.moyenneGenerale ?? 0}
                            </dd>
                        </div>
                        <div className="flex justify-between items-center p-2 rounded-lg hover:bg-white/50 transition-colors">
                            <dt className="text-gray-500">Rang</dt>
                            <dd className="font-mono font-bold text-gray-800">{resultatFinal.rang ?? "-"}</dd>
                        </div>
                    </dl>
                </div>

                {/* Vie scolaire */}
                <div className="bg-gradient-to-br from-white to-green-50 rounded-xl shadow-sm border border-green-100 p-6 transition-all duration-300 hover:shadow-md animate-fade-in-up" style={{ animationDelay: '500ms' }}>
                    <div className="flex items-center gap-2 mb-4">
                        <div className="p-2 bg-green-500/10 rounded-lg">
                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="font-semibold text-gray-800">Vie scolaire</h3>
                    </div>
                    <dl className="space-y-3">
                        <div className="flex justify-between items-center p-2 rounded-lg hover:bg-white/50 transition-colors">
                            <dt className="text-gray-500">Absences</dt>
                            <dd className="font-mono font-bold text-gray-800">{vieScolaire.absences ?? 0} h</dd>
                        </div>
                        <div className="flex justify-between items-center p-2 rounded-lg hover:bg-white/50 transition-colors">
                            <dt className="text-gray-500">Retards</dt>
                            <dd className="font-mono font-bold text-gray-800">{vieScolaire.retards ?? 0}</dd>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-white/50 rounded-lg mt-2">
                            <dt className="text-gray-700 font-semibold">Note de conduite</dt>
                            <dd className={`font-mono font-bold text-xl ${(vieScolaire.conduite || 0) >= 15 ? 'text-green-600' : (vieScolaire.conduite || 0) >= 10 ? 'text-orange-600' : 'text-red-600'}`}>
                                {vieScolaire.conduite || 0}/20
                            </dd>
                        </div>
                    </dl>
                </div>

                {/* Décisions */}
                <div className="bg-gradient-to-br from-white to-purple-50 rounded-xl shadow-sm border border-purple-100 p-6 transition-all duration-300 hover:shadow-md animate-fade-in-up" style={{ animationDelay: '600ms' }}>
                    <div className="flex items-center gap-2 mb-4">
                        <div className="p-2 bg-purple-500/10 rounded-lg">
                            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="font-semibold text-gray-800">Décision du conseil</h3>
                    </div>
                    <p className={`font-semibold mb-4 p-2 rounded-lg text-center ${
                        commentaires.decisionConseil === "Admis" ? "bg-green-100 text-green-700" :
                        commentaires.decisionConseil === "Redoublement" ? "bg-red-100 text-red-700" :
                        "bg-gray-100 text-gray-700"
                    }`}>
                        {commentaires.decisionConseil || "Non définie"}
                    </p>

                    <h4 className="font-medium text-gray-700 mb-2">Observations</h4>
                    <p className="text-gray-600 text-sm italic p-3 bg-white/50 rounded-lg">
                        "{commentaires.observations || "Aucune observation"}"
                    </p>

                    {resultatFinal.moyennesPeriodesAnterieures && resultatFinal.moyennesPeriodesAnterieures.some(m => m) && (
                        <div className="mt-4 pt-4 border-t border-purple-100">
                            <p className="text-sm text-gray-500 mb-2">Moyennes antérieures</p>
                            {resultatFinal.moyennesPeriodesAnterieures.map((m, idx) => {
                                if (!m) return null;
                                return (
                                    <div key={idx} className="flex justify-between items-center p-2 rounded-lg hover:bg-white/50 transition-colors">
                                        <span className="text-sm text-gray-600">{m.nom}</span>
                                        <span className="font-mono font-semibold text-gray-800">{m.moyenne}</span>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    <div className="mt-3 pt-3 border-t border-purple-100">
                        <div className="flex justify-between items-center p-2 bg-white/50 rounded-lg">
                            <span className="text-gray-700 font-semibold">Moyenne annuelle</span>
                            <span className="font-mono font-bold text-primary text-xl">{resultatFinal.moyenneAnnuelle || "-"}</span>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fade-in-up {
                    animation: fadeInUp 0.5s ease-out forwards;
                    opacity: 0;
                }
            `}</style>
        </div>
    );
}