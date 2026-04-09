// src/pages/admin/emplois-du-temps/SeancesPage.tsx
import { useState, useEffect, useRef } from "react";
import {
  ChevronLeft, ChevronRight, Calendar, Clock,
  User, Plus, X,
  Trash2,
} from "lucide-react";
import { useEcoleNiveau } from "../../../hooks/filters/useEcoleNiveau";
import DeleteConfirmationModal from "../../../components/ui/DeleteConfirmationModal";
import useClasses from "../../../hooks/classes/useClasses";
import useMatieres from "../../../hooks/matieres/useMatieres";
import useSeances from "../../../hooks/seances/useSeances";
import useEnseignants from "../../../hooks/enseignants/useEnseignants";

// Types
import { Classe, Matiere } from "../../../utils/types/data";
import { alertServerError } from "../../../helpers/alertError";

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
  
  // Enseignants filtrés par classe et matière
  const [filteredEnseignants, setFilteredEnseignants] = useState<any[]>([]);

  // États pour le modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSeance, setSelectedSeance] = useState<SeanceModalData | null>(null);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Filtrer les classes selon les filtres globaux
  const classesFiltrees = classes.filter(classe => {
    const matchesNiveau = niveauSelectionne ? classe.niveauScolaire === niveauSelectionne : true;
    const matchesCycle = cycleSelectionne ? classe.cycle === cycleSelectionne : true;
    return matchesNiveau && matchesCycle;
  }).sort((a, b) => a.nom.localeCompare(b.nom));

  // Sélectionner la première classe par défaut
  useEffect(() => {
    if (classesFiltrees.length > 0 && !selectedClasse) {
      setSelectedClasse(classesFiltrees[0].id);
      setSelectedClasseObj(classesFiltrees[0]);
    }
  }, [classesFiltrees]);

  // Mettre à jour l'objet classe sélectionné
  useEffect(() => {
    if (selectedClasse) {
      const classe = classes.find(c => c.id === selectedClasse);
      setSelectedClasseObj(classe || null);
    }
  }, [selectedClasse, classes]);

  // Filtrer les séances pour la classe sélectionnée
  useEffect(() => {
    if (selectedClasseObj) {
      const seancesDeLaClasse = seances.filter(s =>
        s.classeId === selectedClasseObj.id
      );
      setFilteredSeances(seancesDeLaClasse);
    }
  }, [selectedClasseObj, seances]);

  // Récupérer les matières du niveau de classe
  useEffect(() => {
    if (selectedClasseObj) {
      const matieresDuNiveau = matieres.filter(m =>
        m.niveauClasseId === selectedClasseObj.niveauClasseId
      );
      setMatieresDeLaClasse(matieresDuNiveau);
    }
  }, [selectedClasseObj, matieres]);

  // Filtrer les enseignants par classe et matière sélectionnées
  useEffect(() => {
    if (selectedSeance?.classeId && selectedSeance?.matiereId) {
      // Enseignants qui enseignent cette matière dans cette classe
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

  // Scroll
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

  // Obtenir la séance pour une matière et un jour donnés
  const getSeance = (matiereId: string, jour: string) => {
    return filteredSeances.find(s =>
      s.matiereId === matiereId && s.jour === jour
    );
  };

  // Formater l'heure
  const formatHeure = (heure: string) => {
    return heure.substring(0, 5);
  };

  // Gérer le clic sur une cellule
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

  // Sauvegarder la séance
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
      } else {
        await createSeance(seanceData);
      }

      setIsModalOpen(false);
    } catch (error: any) {
      alertServerError(error)
    }
  };

  // Supprimer la séance
  const handleDeleteSeance = async () => {
    if (!selectedSeance?.id) return;

    try {
      await deleteSeance(selectedSeance.id);
      setIsDeleteModalOpen(false);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Erreur suppression séance:", error);
      alert("Erreur lors de la suppression");
    }
  };

  // Loading state
  if (classesLoading || matieresLoading || seancesLoading || enseignantsLoading) {
    return <div className="flex justify-center p-8">Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Emplois du temps</h1>
          <p className="text-sm text-gray-500 mt-1">
            Cliquez sur une cellule pour ajouter ou modifier une séance
          </p>
        </div>
      </div>

      {/* Barre des classes */}
      {classesFiltrees.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-medium text-gray-700">Classes</h2>
            <span className="text-xs text-gray-500">{classesFiltrees.length} classe(s)</span>
          </div>

          <div className="relative flex items-center">
            <button
              onClick={scrollLeft}
              className="absolute left-0 z-10 bg-white h-10 w-10 rounded-full shadow-md flex items-center justify-center border border-gray-200"
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
                      px-6 py-3 rounded-lg border-2 transition-all whitespace-nowrap
                      ${selectedClasse === classe.id
                        ? 'border-primary bg-primary/5 text-primary font-medium'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700 hover:bg-gray-50'
                      }
                    `}
                  >
                    <div className="text-center">
                      <div className="font-medium">{classe.nom}</div>
                      <div className="text-xs text-gray-500 mt-1">{classe.niveauClasse}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={scrollRight}
              className="absolute right-0 z-10 bg-white h-10 w-10 rounded-full shadow-md flex items-center justify-center border border-gray-200"
            >
              <ChevronRight size={20} className="text-gray-500" />
            </button>
          </div>
        </div>
      )}

      {/* Message si aucune classe */}
      {classesFiltrees.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <p className="text-yellow-700">
            Aucune classe trouvée. Veuillez sélectionner un niveau scolaire et un cycle.
          </p>
        </div>
      )}

      {/* Emploi du temps */}
      {selectedClasseObj && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-primary/5 px-6 py-4 border-b border-gray-200">
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
                <tr className="bg-gray-50">
                  <th className="sticky left-0 bg-gray-50 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 min-w-[200px]">
                    Matières
                  </th>
                  {JOURS.map((jour) => (
                    <th key={jour} className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r last:border-r-0 border-gray-200 min-w-[180px]">
                      <div className="flex items-center justify-center gap-1">
                        <Calendar size={14} className="text-gray-400" />
                        {JOURS_FR[jour as keyof typeof JOURS_FR]}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {matieresDeLaClasse.length > 0 ? (
                  matieresDeLaClasse.map((matiere, index) => (
                    <tr key={matiere.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                      <td className="sticky left-0 bg-inherit px-4 py-3 font-medium text-gray-800 border-r border-gray-200">
                        <div className="flex items-center gap-2">
                          <span>{matiere.nom}</span>
                        </div>
                       </td>

                      {JOURS.map((jour) => {
                        const seance = getSeance(matiere.id, jour);
                        return (
                          <td
                            key={`${matiere.id}-${jour}`}
                            onClick={() => handleCellClick(matiere, jour)}
                            className="px-4 py-3 border-r last:border-r-0 border-gray-200 align-top cursor-pointer hover:bg-primary/5 transition-colors"
                          >
                            {seance ? (
                              <div className="space-y-2">
                                <div className="flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-1 rounded-md w-fit">
                                  <Clock size={12} />
                                  <span>{formatHeure(seance.heureDebut)} - {formatHeure(seance.heureFin)}</span>
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

          <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex items-center gap-4 text-xs text-gray-500">
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

      {/* Modal */}
      {isModalOpen && selectedSeance && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">
                {selectedSeance.id ? 'Modifier la séance' : 'Nouvelle séance'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-lg"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-primary/5 rounded-lg p-3">
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">Sélectionner un enseignant</option>
                  {filteredEnseignants.map(ens => (
                    <option key={ens.id} value={ens.id}>
                      {ens.prenom} {ens.nom}
                    </option>
                  ))}
                </select>
                {filteredEnseignants.length === 0 && (
                  <p className="text-xs text-amber-600 mt-1">
                    ⚠️ Aucun enseignant n'enseigne cette matière dans cette classe
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
              {selectedSeance.id ? (
                <button
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-300 rounded-lg hover:bg-red-50"
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
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSaveSeance}
                  disabled={!selectedSeance.enseignantId}
                  className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
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
        confirmText="Supprimer"
        cancelText="Annuler"
      />

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}