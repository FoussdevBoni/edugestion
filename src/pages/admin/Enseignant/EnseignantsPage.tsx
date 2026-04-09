import { useState, useMemo } from "react";
import { Plus, MoreVertical, UserPlus, FileText, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Components
import EnseignantsList from "../../../components/admin/lists/EnseignantsList";
import MenuModal from "../../../components/ui/MenuModal";
import DeleteConfirmationModal from "../../../components/ui/DeleteConfirmationModal";
import ClasseFilter from "../../../components/wrappers/ClassesFilter";

// Hooks & Types
import { Enseignant } from "../../../utils/types/data";
import { useEcoleNiveau } from "../../../hooks/filters/useEcoleNiveau";
import useEnseignants from "../../../hooks/enseignants/useEnseignants";
import useMatieres from "../../../hooks/matieres/useMatieres";
import {  alertServerError } from "../../../helpers/alertError";

export default function EnseignantsPage() {
  const navigate = useNavigate();
  
  // 1. Context & Data
  const { 
    cycleSelectionne, niveauClasseSelectionne, classeSelectionne, niveauSelectionne
  } = useEcoleNiveau();

  const { enseignants, deleteEnseignant, loading } = useEnseignants();
  const { matieres } = useMatieres();

  // 2. State local
  const [selectedEnseignant, setSelectedEnseignant] = useState<Enseignant | null>(null);
  const [enseignantToDelete, setEnseignantToDelete] = useState<Enseignant | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMatiere, setSelectedMatiere] = useState("");

  // Matières disponibles
  const matieresDisponibles = useMemo(() => 
    [...new Set(matieres.map(m => m.nom))].sort(), 
    [matieres]
  );

  // 3. Premier filtre : Recherche + Matière + NiveauScolaire + Cycle (filtres de l'en-tête)
  const enseignantsFiltresLocaux = useMemo(() => {
    return enseignants.filter(enseignant => {
      // Filtre supérieur de l'entête
      const matchesNiveauSco = !niveauSelectionne || 
        enseignant.enseignementsData?.some(ed => ed.niveauScolaire === niveauSelectionne);
      
      const matchesCycle = !cycleSelectionne || 
        enseignant.enseignementsData?.some(ed => ed.cycle === cycleSelectionne);
      
      // Filtre recherche
      const matchesSearch = !searchTerm || 
        enseignant.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        enseignant.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        enseignant.email?.toLowerCase().includes(searchTerm.toLowerCase());

      // Filtre matière
      const matchesMatiere = !selectedMatiere || 
        enseignant.enseignementsData?.some(ed => ed.matiere === selectedMatiere);

      return matchesSearch && matchesMatiere && matchesNiveauSco && matchesCycle;
    });
  }, [enseignants, searchTerm, selectedMatiere, niveauSelectionne, cycleSelectionne]);

  // 4. Deuxième filtre : NiveauClasse + Classe (filtres des tabs)
  const enseignantsFiltresTabs = useMemo(() => {
    return enseignantsFiltresLocaux.filter(enseignant => {
      const matchesNiveauClasse = !niveauClasseSelectionne || 
        enseignant.enseignementsData?.some(ed => ed.niveauClasse === niveauClasseSelectionne);
      
      const matchesClasse = !classeSelectionne || 
        enseignant.enseignementsData?.some(ed => ed.classe === classeSelectionne);

      return matchesNiveauClasse && matchesClasse;
    });
  }, [enseignantsFiltresLocaux, niveauClasseSelectionne, classeSelectionne]);

  // 5. Handlers
  const handleDelete = async () => {
    if (!enseignantToDelete?.id) return;
    try {
      await deleteEnseignant(enseignantToDelete.id);
      setEnseignantToDelete(null);
    } catch (error) {
      alertServerError(error);
    }
  };



  if (loading) return <div className="flex justify-center p-20">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
    </div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gestion des enseignants</h1>
          <p className="text-sm text-gray-500 mt-1">
            {enseignantsFiltresTabs.length} enseignant{enseignantsFiltresTabs.length > 1 ? 's' : ''} affiché{enseignantsFiltresTabs.length > 1 ? 's' : ''}
          </p>
        </div>

        <button
          onClick={() => navigate("/admin/enseignants/new")}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
        >
          <Plus size={18} /> Nouvel enseignant
        </button>
      </div>

      {/* Recherche & Filtre Matière */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher par nom, prénom ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50"
          />
        </div>

        <select
          value={selectedMatiere}
          onChange={(e) => setSelectedMatiere(e.target.value)}
          className="px-4 py-2 border rounded-lg bg-white"
        >
          <option value="">Toutes les matières</option>
          {matieresDisponibles.map(matiere => (
            <option key={matiere} value={matiere}>{matiere}</option>
          ))}
        </select>
      </div>

      {/* FILTRE GÉNÉRIQUE - Reçoit les données déjà filtrées par recherche + matière + niveau scolaire + cycle */}
      <ClasseFilter 
        data={enseignantsFiltresLocaux}
        getCycle={(prof) => prof.enseignementsData?.map(ed => ed.cycle) || []}
        getNiveauClasse={(prof) => prof.enseignementsData?.map(ed => ed.niveauClasse) || []}
        getClasse={(prof) => prof.enseignementsData?.map(ed => ed.classe) || []}
        showZeroCounts={false}
      />

      {/* Liste */}
      <EnseignantsList 
        enseignants={enseignantsFiltresTabs} 
        onAction={setSelectedEnseignant} 
      />

      {/* Message si vide */}
      {enseignantsFiltresTabs.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg text-gray-500">
          Aucun enseignant ne correspond à vos critères.
        </div>
      )}

      {selectedEnseignant && (
        <MenuModal
          title={`${selectedEnseignant.prenom} ${selectedEnseignant.nom}`}
          isOpen={!!selectedEnseignant}
          onClose={() => setSelectedEnseignant(null)}
          icon={<UserPlus className="text-primary" size={20} />}
          menu={[
            {
              label: "Voir détails",
              icon: FileText,
              onClick: () => { 
                navigate("/admin/enseignants/details", { state: selectedEnseignant }); 
                setSelectedEnseignant(null); 
              }
            },
            {
              label: "Modifier",
              icon: UserPlus,
              onClick: () => { 
                navigate("/admin/enseignants/update", { state: selectedEnseignant }); 
                setSelectedEnseignant(null); 
              }
            },
            {
              label: "Supprimer",
              icon: MoreVertical,
              onClick: () => { 
                setEnseignantToDelete(selectedEnseignant); 
                setSelectedEnseignant(null); 
              }
            }
          ]}
        />
      )}

      <DeleteConfirmationModal
        isOpen={!!enseignantToDelete}
        onClose={() => setEnseignantToDelete(null)}
        onConfirm={handleDelete}
        title="Supprimer l'enseignant"
        message={`Voulez-vous vraiment supprimer ${enseignantToDelete?.prenom} ${enseignantToDelete?.nom} ?`}
        confirmText="Supprimer"
        cancelText="Annuler"
      />
    </div>
  );
}