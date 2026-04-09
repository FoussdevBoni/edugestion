// components/DashboardHeader.tsx
import { useState, useEffect, useRef } from "react";
import {
  School, Edit, Save, X, Upload,
  ChevronDown, Plus
} from "lucide-react";
import useEcoleInfos from "../hooks/ecoleInfos/useEcoleInfos";
import { NiveauScolaire } from "../utils/types/data";
import useCycles from "../hooks/cycles/useCycles";
import useEcoleImages from "../hooks/ecoleInfos/useEcoleImages";
import { initialisationService } from "../services/initialisationService";
import { alertSuccess, alertServerError } from "../helpers/alertError";

interface DashboardHeaderProps {
  niveauxScolaires: NiveauScolaire[];
  niveauSelectionne: string;
  cycleSelectionne: string;
  onNiveauChange: (niveau: string) => void;
  onCycleChange: (cycle: string) => void;
  onResetFiltres: () => void;
  onNiveauxMisAJour?: () => void;
}

export default function DashboardHeader({
  niveauxScolaires,
  niveauSelectionne,
  cycleSelectionne,
  onNiveauChange,
  onCycleChange,
  onResetFiltres,
  onNiveauxMisAJour
}: DashboardHeaderProps) {

  const { ecoleInfos, updateEcoleInfos } = useEcoleInfos()
  const { cycles } = useCycles()
  const { logoUrl, uploadLogo, uploadLoading } = useEcoleImages()
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<any>(ecoleInfos);
  const [showNiveauxModal, setShowNiveauxModal] = useState(false);
  const [niveauxDisponibles, setNiveauxDisponibles] = useState<any[]>([]);
  const [niveauxASelectionner, setNiveauxASelectionner] = useState<Set<string>>(new Set());
  const [loadingNiveaux, setLoadingNiveaux] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const defaultNiveauApplied = useRef(false);
  const defaultCycleApplied = useRef(false);

  const plusieursNiveaux = niveauxScolaires.length > 1;

  useEffect(() => {
    if (plusieursNiveaux && niveauxScolaires.length > 0 && !defaultNiveauApplied.current) {
      if (niveauSelectionne === undefined || niveauSelectionne === null) {
        onNiveauChange(niveauxScolaires[0].nom);
        defaultNiveauApplied.current = true;
      } else if (niveauSelectionne === "" && defaultNiveauApplied.current === false) {
        if (niveauxScolaires[0]) {
          onNiveauChange(niveauxScolaires[0].nom);
        }
        defaultNiveauApplied.current = true;
      } else {
        defaultNiveauApplied.current = true;
      }
    }
  }, [plusieursNiveaux, niveauxScolaires, onNiveauChange, niveauSelectionne]);

  const cyclesDisponibles = cycles
    .filter(item => {
      if (!niveauSelectionne || niveauSelectionne === "") return true;
      return (item.niveauScolaire?.toLowerCase().trim() === niveauSelectionne?.toLowerCase().trim());
    })
    .map((cycle) => cycle.nom)
    .filter((value, index, self) => self.indexOf(value) === index);

  const plusieursCycles = cyclesDisponibles.length > 1;

  useEffect(() => {
    if (plusieursCycles && cyclesDisponibles.length > 0 && !defaultCycleApplied.current) {
      if (cycleSelectionne === undefined || cycleSelectionne === null) {
        onCycleChange(cyclesDisponibles[0]);
        defaultCycleApplied.current = true;
      } else if (cycleSelectionne === "" && defaultCycleApplied.current === false) {
        if (cyclesDisponibles[0]) {
          onCycleChange(cyclesDisponibles[0]);
        }
        defaultCycleApplied.current = true;
      } else {
        defaultCycleApplied.current = true;
      }
    }
  }, [plusieursCycles, cyclesDisponibles, onCycleChange, cycleSelectionne]);

  useEffect(() => {
    defaultNiveauApplied.current = false;
    defaultCycleApplied.current = false;
  }, [niveauxScolaires.length, cycles.length]);

  const loadNiveauxDisponibles = async () => {
    try {
      setLoadingNiveaux(true);
      const niveaux = await initialisationService.getNiveauxDisponibles("senegal");
      const existants = new Set(niveauxScolaires.map(n => n.nom));
      const disponibles = niveaux.filter(n => !existants.has(n.nom));
      setNiveauxDisponibles(disponibles.sort((a, b) => a.ordre - b.ordre));
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingNiveaux(false);
    }
  };

  const handleAjouterNiveaux = async () => {
    if (niveauxASelectionner.size === 0) return;
    
    try {
      const result = await initialisationService.importerNiveauxScolaires(
        "senegal",
        Array.from(niveauxASelectionner)
      );
      
      if (result.success) {
        alertSuccess(`${result.resultats?.niveauxScolaires.ajoutes} nouveau(x) niveau(x) ajouté(s) !`);
        setShowNiveauxModal(false);
        setNiveauxASelectionner(new Set());
        onNiveauxMisAJour?.();
        location.reload()
      }
    } catch (err) {
      alertServerError(err);
    }
  };

  const toggleNiveau = (nom: string) => {
    const newSet = new Set(niveauxASelectionner);
    if (newSet.has(nom)) {
      newSet.delete(nom);
    } else {
      newSet.add(nom);
    }
    setNiveauxASelectionner(newSet);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditForm(ecoleInfos);
  };

  const handleSave = async () => {
    try {
      updateEcoleInfos(editForm)
    } catch (error) {
      console.error(error)
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm(ecoleInfos);
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        await uploadLogo(file);
        setEditForm((prev: any) => ({ ...prev, logo: file.name }));
      } catch (error) {
        console.error("Erreur upload logo:", error);
      }
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleNiveauChange = (value: string) => {
    defaultNiveauApplied.current = true;
    onNiveauChange(value);
  };

  const handleCycleChange = (value: string) => {
    defaultCycleApplied.current = true;
    onCycleChange(value);
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200">
        {/* Ligne 1: Identité de l'école */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100">
          <div className="flex items-center gap-4">
            {!isEditing ? (
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
            ) : (
              <>
                <div className="relative">
                  <div className="w-10 h-10 bg-primary/10 rounded-md flex items-center justify-center overflow-hidden">
                    {logoUrl ? (
                      <img src={logoUrl} alt="Logo" className="w-full h-full object-contain" />
                    ) : (
                      <School size={20} className="text-primary" />
                    )}
                  </div>
                  {uploadLoading ? (
                    <div className="absolute -bottom-1 -right-1 p-1 bg-primary text-white rounded-full">
                      <div className="animate-spin h-2 w-2 border border-white border-t-transparent rounded-full" />
                    </div>
                  ) : (
                    <button
                      onClick={triggerFileInput}
                      className="absolute -bottom-1 -right-1 p-1 bg-primary text-white rounded-full hover:bg-primary/90 shadow-sm"
                    >
                      <Upload size={10} />
                    </button>
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept=".jpg,.jpeg"
                    className="hidden"
                    onChange={handleLogoUpload}
                  />
                </div>
                <div>
                  <input
                    type="text"
                    value={editForm?.nom || ''}
                    onChange={(e) => setEditForm({ ...editForm, nom: e.target.value })}
                    className="text-lg font-semibold text-gray-800 border-b border-primary/30 focus:outline-none focus:border-primary px-1 py-0 bg-transparent w-80"
                    placeholder="Nom de l'école"
                  />
                </div>
              </>
            )}
          </div>

          {!isEditing ? (
            <button
              onClick={handleEdit}
              className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1.5 transition-colors"
            >
              <Edit size={14} />
              Modifier
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-3 py-1.5 text-sm bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
              >
                <Save size={14} />
                Enregistrer
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                <X size={14} />
                Annuler
              </button>
            </div>
          )}
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
                onClick={() => {
                  defaultNiveauApplied.current = true;
                  defaultCycleApplied.current = true;
                  onResetFiltres();
                }}
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