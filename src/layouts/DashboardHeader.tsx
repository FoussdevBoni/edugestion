// components/DashboardHeader.tsx
import {
  School, Edit, X,
  ChevronDown, Plus
} from "lucide-react";
import { EcoleInfo, NiveauScolaire } from "../utils/types/data";
import useCycles from "../hooks/cycles/useCycles";
import useEcoleImages from "../hooks/ecoleInfos/useEcoleImages";
import useGlobalFiltres from "../hooks/filters/useGlobalFiltres";
import { useNavigate } from "react-router-dom";

interface DashboardHeaderProps {
  niveauxScolaires: NiveauScolaire[];
  niveauSelectionne: string;
  cycleSelectionne: string;
  onNiveauChange: (niveau: string) => void;
  onCycleChange: (cycle: string) => void;
  onResetFiltres: () => void;
  onNiveauxMisAJour?: () => void;
  ecoleInfos: EcoleInfo | null,
  logoUrl: string | null
}

export default function DashboardHeader({
  niveauxScolaires,
  niveauSelectionne,
  cycleSelectionne,
  onNiveauChange,
  onCycleChange,
  onResetFiltres,
  onNiveauxMisAJour,
  ecoleInfos,
  logoUrl
}: DashboardHeaderProps) {

  const { cycles } = useCycles();

 const navigate = useNavigate()
  const {
    showNiveauxModal,
    setShowNiveauxModal,
    niveauxDisponibles,
    niveauxASelectionner,
    loadingNiveaux,
    plusieursNiveaux,
    cyclesDisponibles,
    plusieursCycles,
    loadNiveauxDisponibles,
    handleAjouterNiveaux,
    toggleNiveau,
    handleNiveauChange,
    handleCycleChange,
    handleResetFiltres
  } = useGlobalFiltres({
    niveauxScolaires,
    cycles,
    onNiveauChange,
    onCycleChange,
    onResetFiltres,
    onNiveauxMisAJour
  });

  const handleEdit = () => {
    navigate("/admin/configuration/ecole/update", { state: ecoleInfos });
  };




 

  return (
    <>
      <header className="bg-white border-b border-gray-200">
        {/* Ligne 1: Identité de l'école */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100">
          <div className="flex items-center gap-4">
           
              <>
                <div className="w-10 h-10 bg-primary/10 rounded-md flex items-center justify-center overflow-hidden">
                  {logoUrl ? (
                    <img src={logoUrl} alt="Logo" className="w-full h-full object-contain" />
                  ) : (
                    <School size={20} className="text-primary" />
                  )}
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-gray-800">
                    {ecoleInfos?.nom || "Votre école"}
                  </h1>
                  {ecoleInfos?.devise && (
                    <p className="text-xs text-gray-400">{ecoleInfos.devise}</p>
                  )}
                </div>
              </>
            
          </div>

            <button
              onClick={handleEdit}
              className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1.5 transition-colors"
            >
              <Edit size={14} />
              Modifier
            </button>
          
        </div>

        {/* Ligne 2: Filtres */}
        <div className="bg-gray-50 px-6 py-3">
          <div className="flex items-center gap-4 text-sm flex-wrap">
            <span className="text-gray-500 font-medium">Filtrer par :</span>

            {!plusieursNiveaux ? (
              <span className="text-gray-700 font-medium px-2">
                {niveauxScolaires[0]?.nom}
              </span>
            ) : (
              <div className="relative">
                <select
                  value={niveauSelectionne ?? ""}
                  onChange={(e) => handleNiveauChange(e.target.value)}
                  className="appearance-none bg-white border border-gray-200 rounded-md pl-3 pr-8 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                >
                  <option value="">Tous les niveaux</option>
                  {niveauxScolaires.map((niveau) => (
                    <option key={niveau.nom} value={niveau.nom}>
                      {niveau.nom}
                    </option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            )}

            <button
              onClick={() => {
                loadNiveauxDisponibles();
                setShowNiveauxModal(true);
              }}
              className="flex items-center gap-1 text-primary text-sm hover:text-primary/80 transition-colors"
            >
              <Plus size={14} />
              Ajouter un niveau
            </button>

            {plusieursCycles && (
              <>
                <span className="text-gray-300">|</span>
                <div className="relative">
                  <select
                    value={cycleSelectionne ?? ""}
                    onChange={(e) => handleCycleChange(e.target.value)}
                    className="appearance-none bg-white border border-gray-200 rounded-md pl-3 pr-8 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  >
                    <option value="">Tous les cycles</option>
                    {cyclesDisponibles.map((cycle) => (
                      <option key={cycle} value={cycle}>
                        {cycle}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </>
            )}

            {(niveauSelectionne !== "" || cycleSelectionne !== "") && (
              <button
                onClick={handleResetFiltres}
                className="text-gray-400 hover:text-gray-500 text-sm ml-auto transition-colors"
              >
                Réinitialiser
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Modal Ajouter des niveaux */}
      {showNiveauxModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800">Ajouter des niveaux scolaires</h2>
              <button
                onClick={() => setShowNiveauxModal(false)}
                className="p-1 hover:bg-gray-100 rounded-md transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6">
              <p className="text-sm text-gray-500 mb-4">
                Sélectionnez les niveaux que vous souhaitez ajouter à votre établissement.
              </p>

              {loadingNiveaux ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent"></div>
                </div>
              ) : niveauxDisponibles.length === 0 ? (
                <div className="text-center py-8 text-gray-400 text-sm">
                  Tous les niveaux sont déjà ajoutés
                </div>
              ) : (
                <div className="space-y-2 max-h-80 overflow-y-auto mb-6">
                  {niveauxDisponibles.map((niveau) => (
                    <button
                      key={niveau.nom}
                      type="button"
                      onClick={() => toggleNiveau(niveau.nom)}
                      className={`w-full flex items-center justify-between p-3 border rounded-md transition-colors ${
                        niveauxASelectionner.has(niveau.nom)
                          ? "border-primary bg-primary/5"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <span className="text-sm font-medium text-gray-700">{niveau.nom}</span>
                      <div className={`w-4 h-4 rounded-sm border-2 flex items-center justify-center ${
                        niveauxASelectionner.has(niveau.nom)
                          ? "bg-primary border-primary"
                          : "border-gray-300"
                      }`}>
                        {niveauxASelectionner.has(niveau.nom) && (
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setShowNiveauxModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleAjouterNiveaux}
                  disabled={niveauxASelectionner.size === 0 || loadingNiveaux}
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-md text-sm hover:bg-primary/90 disabled:opacity-50 transition-colors"
                >
                  Ajouter ({niveauxASelectionner.size})
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}