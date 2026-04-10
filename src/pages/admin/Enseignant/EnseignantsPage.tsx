import { useState, useMemo } from "react";
import { Plus, MoreVertical, UserPlus, FileText, Search, Users } from "lucide-react";
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
import { alertServerError, alertSuccess } from "../../../helpers/alertError";
import PageLayout from "../../../layouts/PageLayout";



export default function EnseignantsPage() {
  const navigate = useNavigate();
  
  const { 
    cycleSelectionne, niveauClasseSelectionne, classeSelectionne, niveauSelectionne
  } = useEcoleNiveau();

  const { enseignants, deleteEnseignant, loading } = useEnseignants();
  const { matieres } = useMatieres();

  const [selectedEnseignant, setSelectedEnseignant] = useState<Enseignant | null>(null);
  const [enseignantToDelete, setEnseignantToDelete] = useState<Enseignant | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMatiere, setSelectedMatiere] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const matieresDisponibles = useMemo(() => 
    [...new Set(matieres.map(m => m.nom))].sort(), 
    [matieres]
  );

  const enseignantsFiltresLocaux = useMemo(() => {
    return enseignants.filter(enseignant => {
      const matchesNiveauSco = !niveauSelectionne || 
        enseignant.enseignementsData?.some(ed => ed.niveauScolaire === niveauSelectionne);
      
      const matchesCycle = !cycleSelectionne || 
        enseignant.enseignementsData?.some(ed => ed.cycle === cycleSelectionne);
      
      const matchesSearch = !searchTerm || 
        enseignant.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        enseignant.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        enseignant.email?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesMatiere = !selectedMatiere || 
        enseignant.enseignementsData?.some(ed => ed.matiere === selectedMatiere);

      return matchesSearch && matchesMatiere && matchesNiveauSco && matchesCycle;
    });
  }, [enseignants, searchTerm, selectedMatiere, niveauSelectionne, cycleSelectionne]);

  const enseignantsFiltresTabs = useMemo(() => {
    return enseignantsFiltresLocaux.filter(enseignant => {
      const matchesNiveauClasse = !niveauClasseSelectionne || 
        enseignant.enseignementsData?.some(ed => ed.niveauClasse === niveauClasseSelectionne);
      
      const matchesClasse = !classeSelectionne || 
        enseignant.enseignementsData?.some(ed => ed.classe === classeSelectionne);

      return matchesNiveauClasse && matchesClasse;
    });
  }, [enseignantsFiltresLocaux, niveauClasseSelectionne, classeSelectionne]);



  const handleDelete = async () => {
    if (!enseignantToDelete?.id) return;
    setIsDeleting(true);
    try {
      await deleteEnseignant(enseignantToDelete.id);
      setEnseignantToDelete(null);
      alertSuccess("Enseignant supprimé avec succès");
    } catch (error) {
      alertServerError(error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center p-20">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
    </div>
  );

  return (
    <PageLayout
      title="Gestion des enseignants"
      description={`${enseignantsFiltresTabs.length} enseignant${enseignantsFiltresTabs.length > 1 ? 's' : ''} affiché${enseignantsFiltresTabs.length > 1 ? 's' : ''}`}
      actions={
        <button
          onClick={() => navigate("/admin/enseignants/new")}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-primary/80 text-white rounded-xl hover:shadow-md transition-all duration-300 hover:scale-[1.02] animate-fade-in-up"
        >
          <Plus size={18} /> Nouvel enseignant
        </button>
      }
    >
     
      {/* Recherche & Filtre Matière */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
        <div className="md:col-span-2 relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher par nom, prénom ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all duration-200"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <span className="text-xs">✕</span>
            </button>
          )}
        </div>

        <select
          value={selectedMatiere}
          onChange={(e) => setSelectedMatiere(e.target.value)}
          className="px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all duration-200 bg-white"
        >
          <option value="">Toutes les matières</option>
          {matieresDisponibles.map(matiere => (
            <option key={matiere} value={matiere}>{matiere}</option>
          ))}
        </select>
      </div>

      {/* Filtre générique */}
      <div className="animate-fade-in-up" style={{ animationDelay: '400ms' }}>
        <ClasseFilter 
          data={enseignantsFiltresLocaux}
          getCycle={(prof) => prof.enseignementsData?.map(ed => ed.cycle) || []}
          getNiveauClasse={(prof) => prof.enseignementsData?.map(ed => ed.niveauClasse) || []}
          getClasse={(prof) => prof.enseignementsData?.map(ed => ed.classe) || []}
          showZeroCounts={false}
        />
      </div>

      {/* Liste */}
      <div className="animate-fade-in-up" style={{ animationDelay: '500ms' }}>
        <EnseignantsList 
          enseignants={enseignantsFiltresTabs} 
          onAction={setSelectedEnseignant} 
        />
      </div>

      {/* Message si vide */}
      {enseignantsFiltresTabs.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-xl animate-fade-in-up" style={{ animationDelay: '600ms' }}>
          <Users size={48} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">Aucun enseignant ne correspond à vos critères.</p>
        </div>
      )}

      {/* Menu modal */}
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

      {/* Modal suppression */}
      <DeleteConfirmationModal
        isOpen={!!enseignantToDelete}
        onClose={() => setEnseignantToDelete(null)}
        onConfirm={handleDelete}
        title="Supprimer l'enseignant"
        message={`Voulez-vous vraiment supprimer ${enseignantToDelete?.prenom} ${enseignantToDelete?.nom} ? Cette action est irréversible.`}
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
        .animate-fade-in-up {
          animation: fadeInUp 0.5s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </PageLayout>
  );
}