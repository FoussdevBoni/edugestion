import { useState, useEffect, useRef } from "react";
import {
  ChevronLeft, ChevronRight, Calendar, Clock,
  User, Plus, X,
  Trash2, AlertCircle
} from "lucide-react";
import { useEcoleNiveau } from "../../../hooks/filters/useEcoleNiveau";
import DeleteConfirmationModal from "../../../components/ui/DeleteConfirmationModal";
import useClasses from "../../../hooks/classes/useClasses";
import useMatieres from "../../../hooks/matieres/useMatieres";
import useSeances from "../../../hooks/seances/useSeances";
import useEnseignants from "../../../hooks/enseignants/useEnseignants";

// Types
import { Classe, Matiere } from "../../../utils/types/data";
import { alertServerError, alertSuccess } from "../../../helpers/alertError";

// Jours de la semaine
const JOURS = [
  "LUNDI",
  "MARDI",
  "MERCREDI",
  "JEUDI",
  "VENDREDI",
  "SAMEDI"
];

const JOURS_FR = {
  LUNDI: "Lundi",
  MARDI: "Mardi",
  MERCREDI: "Mercredi",
  JEUDI: "Jeudi",
  VENDREDI: "Vendredi",
  SAMEDI: "Samedi"
};

interface SeanceModalData {
  id?: string;
  classe: string;
  classeId: string;
  matiere: string;
  matiereId: string;
  jour: string;
  heureDebut: string;
  heureFin: string;
  enseignant: string;
  enseignantId: string;
  niveauClasse: string;
  cycle: string;
  niveauScolaire: string;
}

export default function SeancesPage() {
  const { niveauSelectionne, cycleSelectionne } = useEcoleNiveau();
  const { classes, loading: classesLoading } = useClasses();
  const { matieres, loading: matieresLoading } = useMatieres();
  const { seances, loading: seancesLoading, createSeance, updateSeance, deleteSeance } = useSeances();
  const { enseignants, loading: enseignantsLoading } = useEnseignants();

  const [selectedClasse, setSelectedClasse] = useState<string>("");
  const [selectedClasseObj, setSelectedClasseObj] = useState<Classe | null>(null);
  const [filteredSeances, setFilteredSeances] = useState<any[]>([]);
  const [matieresDeLaClasse, setMatieresDeLaClasse] = useState<Matiere[]>([]);
  const [filteredEnseignants, setFilteredEnseignants] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSeance, setSelectedSeance] = useState<SeanceModalData | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const classesFiltrees = classes.filter(classe => {
    const matchesNiveau = niveauSelectionne ? classe.niveauScolaire === niveauSelectionne : true;
    const matchesCycle = cycleSelectionne ? classe.cycle === cycleSelectionne : true;
    return matchesNiveau && matchesCycle;
  }).sort((a, b) => a.nom.localeCompare(b.nom));

  useEffect(() => {
    if (classesFiltrees.length > 0 && !selectedClasse) {
      setSelectedClasse(classesFiltrees[0].id);
      setSelectedClasseObj(classesFiltrees[0]);
    }
  }, [classesFiltrees]);

  useEffect(() => {
    if (selectedClasse) {
      const classe = classes.find(c => c.id === selectedClasse);
      setSelectedClasseObj(classe || null);
    }
  }, [selectedClasse, classes]);

  useEffect(() => {
    if (selectedClasseObj) {
      const seancesDeLaClasse = seances.filter(s => s.classeId === selectedClasseObj.id);
      setFilteredSeances(seancesDeLaClasse);
    }
  }, [selectedClasseObj, seances]);

  useEffect(() => {
    if (selectedClasseObj) {
      const matieresDuNiveau = matieres.filter(m => m.niveauClasseId === selectedClasseObj.niveauClasseId);
      setMatieresDeLaClasse(matieresDuNiveau);
    }
  }, [selectedClasseObj, matieres]);

  useEffect(() => {
    if (selectedSeance?.classeId && selectedSeance?.matiereId) {
      const enseignantsFiltres = enseignants.filter(enseignant => {
        return enseignant.enseignements?.some((enseignement: any) => 
          enseignement.classeId === selectedSeance.classeId && 
          enseignement.matiereId === selectedSeance.matiereId
        );
      });
      setFilteredEnseignants(enseignantsFiltres);
    } else {
      setFilteredEnseignants([]);
    }
  }, [selectedSeance?.classeId, selectedSeance?.matiereId, enseignants]);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  const getSeance = (matiereId: string, jour: string) => {
    return filteredSeances.find(s => s.matiereId === matiereId && s.jour === jour);
  };

  const formatHeure = (heure: string) => {
    return heure.substring(0, 5);
  };

  const handleCellClick = (matiere: Matiere, jour: string) => {
    if (!selectedClasseObj) return;

    const seanceExistante = getSeance(matiere.id, jour);

    if (seanceExistante) {
      setSelectedSeance({
        id: seanceExistante.id,
        classe: seanceExistante.classe,
        classeId: seanceExistante.classeId,
        matiere: seanceExistante.matiere,
        matiereId: seanceExistante.matiereId,
        jour: seanceExistante.jour,
        heureDebut: seanceExistante.heureDebut,
        heureFin: seanceExistante.heureFin,
        enseignant: seanceExistante.enseignant,
        enseignantId: seanceExistante.enseignantId,
        niveauClasse: seanceExistante.niveauClasse,
        cycle: seanceExistante.cycle,
        niveauScolaire: seanceExistante.niveauScolaire
      });
    } else {
      setSelectedSeance({
        classe: selectedClasseObj.nom,
        classeId: selectedClasseObj.id,
        matiere: matiere.nom,
        matiereId: matiere.id,
        jour: jour,
        heureDebut: "08:00",
        heureFin: "10:00",
        enseignant: "",
        enseignantId: "",
        niveauClasse: selectedClasseObj.niveauClasse,
        cycle: selectedClasseObj.cycle,
        niveauScolaire: selectedClasseObj.niveauScolaire
      });
    }

    setIsModalOpen(true);
  };

  const handleSaveSeance = async () => {
    if (!selectedSeance || !selectedClasseObj) return;

    try {
      const seanceData = {
        classeId: selectedSeance.classeId,
        matiereId: selectedSeance.matiereId,
        enseignantId: selectedSeance.enseignantId,
        jour: selectedSeance.jour as "LUNDI" | "MARDI" | "MERCREDI" | "JEUDI" | "VENDREDI" | "SAMEDI",
        heureDebut: selectedSeance.heureDebut,
        heureFin: selectedSeance.heureFin,
        anneeScolaire: new Date().getFullYear() + '-' + (new Date().getFullYear() + 1)
      };

      if (selectedSeance.id) {
        await updateSeance(selectedSeance.id, seanceData);
        alertSuccess("Séance modifiée avec succès");
      } else {
        await createSeance(seanceData);
        alertSuccess("Séance ajoutée avec succès");
      }

      setIsModalOpen(false);
    } catch (error: any) {
      alertServerError(error);
    }
  };

  const handleDeleteSeance = async () => {
    if (!selectedSeance?.id) return;
    setIsDeleting(true);
    try {
      await deleteSeance(selectedSeance.id);
      setIsDeleteModalOpen(false);
      setIsModalOpen(false);
      alertSuccess("Séance supprimée avec succès");
    } catch (error) {
      console.error("Erreur suppression séance:", error);
      alertServerError(error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (classesLoading || matieresLoading || seancesLoading || enseignantsLoading) {
    return (
      <div className="flex justify-center p-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      {/* En-tête avec animation */}
      <div className="flex items-center justify-between animate-fade-in-up">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Emplois du temps</h1>
          <p className="text-sm text-gray-500 mt-1">
            Cliquez sur une cellule pour ajouter ou modifier une séance
          </p>
        </div>
      </div>

      {/* Barre des classes avec animation */}
      {classesFiltrees.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 transition-all duration-300 hover:shadow-md animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-700">Classes</h2>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{classesFiltrees.length} classe(s)</span>
          </div>

          <div className="relative flex items-center">
            <button
              onClick={scrollLeft}
              className="absolute left-0 z-10 bg-white h-10 w-10 rounded-full shadow-md flex items-center justify-center border border-gray-200 hover:bg-gray-50 transition-all"
            >
              <ChevronLeft size={20} className="text-gray-500" />
            </button>

            <div
              ref={scrollContainerRef}
              className="flex-1 overflow-x-auto scrollbar-hide mx-12"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              <div className="flex space-x-3 min-w-max py-2">
                {classesFiltrees.map((classe) => (
                  <button
                    key={classe.id}
                    onClick={() => setSelectedClasse(classe.id)}
                    className={`
                      px-6 py-3 rounded-xl border-2 transition-all duration-200 whitespace-nowrap
                      ${selectedClasse === classe.id
                        ? 'border-primary bg-primary/5 text-primary font-semibold shadow-sm'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700 hover:bg-gray-50'
                      }
                    `}
                  >
                    <div className="text-center">
                      <div className="font-medium">{classe.nom}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={scrollRight}
              className="absolute right-0 z-10 bg-white h-10 w-10 rounded-full shadow-md flex items-center justify-center border border-gray-200 hover:bg-gray-50 transition-all"
            >
              <ChevronRight size={20} className="text-gray-500" />
            </button>
          </div>
        </div>
      )}

      {/* Message si aucune classe */}
      {classesFiltrees.length === 0 && (
        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200 rounded-xl p-6 text-center animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          <AlertCircle size={32} className="text-yellow-600 mx-auto mb-2" />
          <p className="text-yellow-700">
            Aucune classe trouvée. Veuillez sélectionner un niveau scolaire et un cycle.
          </p>
        </div>
      )}

      {/* Emploi du temps avec animation */}
      {selectedClasseObj && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md animate-fade-in-up" style={{ animationDelay: '300ms' }}>
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800">
              Emploi du temps - {selectedClasseObj.nom}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {selectedClasseObj.niveauClasse} • {selectedClasseObj.cycle} • {selectedClasseObj.niveauScolaire}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="sticky left-0 bg-gray-50 px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-r border-gray-100 min-w-[200px]">
                    Matières
                  </th>
                  {JOURS.map((jour) => (
                    <th key={jour} className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider border-r last:border-r-0 border-gray-100 min-w-[180px]">
                      <div className="flex items-center justify-center gap-1">
                        <Calendar size={14} className="text-gray-400" />
                        {JOURS_FR[jour as keyof typeof JOURS_FR]}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {matieresDeLaClasse.length > 0 ? (
                  matieresDeLaClasse.map((matiere, index) => (
                    <tr key={matiere.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}>
                      <td className="sticky left-0 bg-inherit px-4 py-3 font-semibold text-gray-800 border-r border-gray-100">
                        {matiere.nom}
                      </td>

                      {JOURS.map((jour) => {
                        const seance = getSeance(matiere.id, jour);
                        return (
                          <td
                            key={`${matiere.id}-${jour}`}
                            onClick={() => handleCellClick(matiere, jour)}
                            className="px-4 py-3 border-r last:border-r-0 border-gray-100 align-top cursor-pointer hover:bg-primary/5 transition-all duration-200"
                          >
                            {seance ? (
                              <div className="space-y-2">
                                <div className="flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-1 rounded-lg w-fit">
                                  <Clock size={12} />
                                  <span className="font-medium">{formatHeure(seance.heureDebut)} - {formatHeure(seance.heureFin)}</span>
                                </div>
                                <div className="flex items-center gap-1 text-xs text-gray-600">
                                  <User size={12} className="text-gray-400" />
                                  <span>{seance.enseignant}</span>
                                </div>
                              </div>
                            ) : (
                              <div className="h-full flex items-center justify-center py-4">
                                <Plus size={20} className="text-gray-300 hover:text-primary transition-colors" />
                              </div>
                            )}
                           </td>
                        );
                      })}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                      Aucune matière trouvée pour cette classe
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 flex flex-wrap items-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Clock size={14} className="text-primary" />
              <span>Horaires</span>
            </div>
            <div className="flex items-center gap-1">
              <User size={14} className="text-primary" />
              <span>Enseignant</span>
            </div>
            <div className="flex items-center gap-1 ml-auto">
              <span className="text-gray-400">Cliquez sur une cellule pour ajouter/modifier</span>
            </div>
          </div>
        </div>
      )}

      {/* Modal avec animation */}
      {isModalOpen && selectedSeance && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800">
                {selectedSeance.id ? 'Modifier la séance' : 'Nouvelle séance'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl p-4">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Classe:</span> {selectedSeance.classe}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  <span className="font-medium">Matière:</span> {selectedSeance.matiere}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  <span className="font-medium">Jour:</span> {JOURS_FR[selectedSeance.jour as keyof typeof JOURS_FR]}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Heure de début
                </label>
                <input
                  type="time"
                  value={selectedSeance.heureDebut}
                  onChange={(e) => setSelectedSeance({ ...selectedSeance, heureDebut: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Heure de fin
                </label>
                <input
                  type="time"
                  value={selectedSeance.heureFin}
                  onChange={(e) => setSelectedSeance({ ...selectedSeance, heureFin: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Enseignant
                </label>
                <select
                  value={selectedSeance.enseignantId}
                  onChange={(e) => {
                    const enseignant = enseignants.find(ens => ens.id === e.target.value);
                    setSelectedSeance({
                      ...selectedSeance,
                      enseignantId: e.target.value,
                      enseignant: enseignant ? `${enseignant.prenom} ${enseignant.nom}` : ""
                    });
                  }}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                >
                  <option value="">Sélectionner un enseignant</option>
                  {filteredEnseignants.map(ens => (
                    <option key={ens.id} value={ens.id}>
                      {ens.prenom} {ens.nom}
                    </option>
                  ))}
                </select>
                {filteredEnseignants.length === 0 && (
                  <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                    <AlertCircle size={12} />
                    Aucun enseignant n'enseigne cette matière dans cette classe
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between p-6 border-t border-gray-100 bg-gray-50 rounded-b-xl">
              {selectedSeance.id ? (
                <button
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-300 rounded-xl hover:bg-red-50 transition-all"
                >
                  <Trash2 size={16} />
                  Supprimer
                </button>
              ) : (
                <div></div>
              )}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSaveSeance}
                  disabled={!selectedSeance.enseignantId}
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-primary to-primary/80 rounded-xl hover:shadow-md transition-all disabled:opacity-50"
                >
                  {selectedSeance.id ? 'Modifier' : 'Ajouter'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal suppression */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteSeance}
        title="Supprimer la séance"
        message="Êtes-vous sûr de vouloir supprimer cette séance ?"
        confirmText={isDeleting ? "Suppression..." : "Supprimer"}
        cancelText="Annuler"
      />

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
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.5s ease-out forwards;
          opacity: 0;
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
          opacity: 0;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}