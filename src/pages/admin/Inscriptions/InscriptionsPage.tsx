import { useState, useEffect, useMemo } from "react";
import { Plus, MoreVertical, FileText, Search, Calendar, Users, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Components
import InscriptionsList from "../../../components/admin/lists/InscriptionsList";
import MenuModal, { Menu } from "../../../components/ui/MenuModal";
import DeleteConfirmationModal from "../../../components/ui/DeleteConfirmationModal";
import ClasseFilter from "../../../components/wrappers/ClassesFilter";

// Hooks & Helpers
import { useEcoleNiveau } from "../../../hooks/filters/useEcoleNiveau";
import { Inscription } from "../../../utils/types/data";
import useInscriptions from "../../../hooks/inscriptions/useInscriptions";
import { alertSuccess } from "../../../helpers/alertError";
import PageLayout from "../../../layouts/PageLayout";


export default function InscriptionsPage() {
  const navigate = useNavigate();
  
  const { 
    niveauSelectionne, 
    cycleSelectionne, 
    niveauClasseSelectionne, 
    classeSelectionne 
  } = useEcoleNiveau();

  const { inscriptions, loading, deleteInscription } = useInscriptions();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInscription, setSelectedInscription] = useState<Inscription | null>(null);
  const [inscriptionToDelete, setInscriptionToDelete] = useState<Inscription | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAnnee, setSelectedAnnee] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const anneesDisponibles = useMemo(() => {
    return [...new Set(inscriptions.map(ins => ins.anneeScolaire))].sort().reverse();
  }, [inscriptions]);

  useEffect(() => {
    if (anneesDisponibles.length > 0 && !selectedAnnee) {
      setSelectedAnnee(anneesDisponibles[0]);
    }
  }, [anneesDisponibles, selectedAnnee]);

  const inscriptionsDeLAnnee = useMemo(() => {
    return inscriptions.filter(ins => !selectedAnnee || ins.anneeScolaire === selectedAnnee);
  }, [inscriptions, selectedAnnee]);

  const filteredInscriptions = useMemo(() => {
    return inscriptionsDeLAnnee.filter(ins => {
      const matchesNiveauGlobal = !niveauSelectionne || ins.niveauScolaire === niveauSelectionne;
      const matchesCycleGlobal = !cycleSelectionne || ins.cycle === cycleSelectionne;
      const matchesNiveauClasse = !niveauClasseSelectionne || ins.niveauClasse === niveauClasseSelectionne;
      const matchesClasse = !classeSelectionne || ins.classe === classeSelectionne;
      
      const matchesSearch = 
        ins.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ins.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (ins.matricule || "").toLowerCase().includes(searchTerm.toLowerCase());

      return matchesNiveauGlobal && matchesCycleGlobal && matchesNiveauClasse && matchesClasse && matchesSearch;
    });
  }, [inscriptionsDeLAnnee, niveauSelectionne, cycleSelectionne, niveauClasseSelectionne, classeSelectionne, searchTerm]);



  const handleDelete = async () => {
    if (!inscriptionToDelete?.id) return;
    setIsDeleting(true);
    try {
      await deleteInscription(inscriptionToDelete.id);
      setInscriptionToDelete(null);
      alertSuccess("Inscription supprimée avec succès");
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  const menuItems: Menu[] = [
    {
      label: "Nouvel élève",
      icon: Plus,
      onClick: () => { navigate("/admin/eleves/new"); setIsModalOpen(false); }
    },
    {
      label: "Réinscrire les élèves",
      icon: Users,
      onClick: () => { navigate("/admin/inscriptions/new"); setIsModalOpen(false); }
    }
  ];

  if (loading) return (
    <div className="flex justify-center p-20">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
    </div>
  );

  return (
    <PageLayout
      title="Inscriptions"
      description={`${filteredInscriptions.length} inscription${filteredInscriptions.length > 1 ? 's' : ''} affichée${filteredInscriptions.length > 1 ? 's' : ''}`}
      actions={
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-primary/80 text-white rounded-xl hover:shadow-md transition-all duration-300 hover:scale-[1.02] animate-fade-in-up"
        >
          <Plus size={18} /> Nouvelles inscriptions
        </button>
      }
    >
    

      {/* Barre de Filtres Principaux */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un élève..."
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

        <div className="relative">
          <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <select
            value={selectedAnnee}
            onChange={(e) => setSelectedAnnee(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all duration-200 appearance-none bg-white"
          >
            {anneesDisponibles.map(annee => (
              <option key={annee} value={annee}>{annee}</option>
            ))}
          </select>
        </div>
      </div>

      {/* FILTRES PAR TABS */}
      <div className="animate-fade-in-up" style={{ animationDelay: '500ms' }}>
        <ClasseFilter 
          data={inscriptionsDeLAnnee}
          getCycle={(ins) => ins.cycle}
          getNiveauClasse={(ins) => ins.niveauClasse}
          getClasse={(ins) => ins.classe}
        />
      </div>

      {/* Liste finale filtrée */}
      <div className="animate-fade-in-up" style={{ animationDelay: '600ms' }}>
        <InscriptionsList 
          inscriptions={filteredInscriptions} 
          onAction={setSelectedInscription}
        />
      </div>

      {/* Message si vide */}
      {filteredInscriptions.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-xl animate-fade-in-up" style={{ animationDelay: '700ms' }}>
          <Users size={48} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">Aucune inscription trouvée</p>
        </div>
      )}

      {/* Modals */}
      <MenuModal
        menu={menuItems}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Gestion des inscriptions"
        icon={<Plus className="text-primary" size={20} />}
      />

      {selectedInscription && (
        <MenuModal
          title={`${selectedInscription.prenom} ${selectedInscription.nom}`}
          isOpen={!!selectedInscription}
          onClose={() => setSelectedInscription(null)}
          icon={<FileText className="text-primary" size={20} />}
          menu={[
            {
              label: "Voir détails",
              icon: FileText,
              onClick: () => { navigate("/admin/inscriptions/details", { state: selectedInscription }); setSelectedInscription(null); }
            },
            {
              label: "Modifier",
              icon: Plus,
              onClick: () => { navigate("/admin/inscriptions/update", { state: selectedInscription }); setSelectedInscription(null); }
            },
            {
              label: "Supprimer",
              icon: MoreVertical,
              onClick: () => { setInscriptionToDelete(selectedInscription); setSelectedInscription(null); }
            }
          ]}
        />
      )}

      <DeleteConfirmationModal
        isOpen={!!inscriptionToDelete}
        onClose={() => setInscriptionToDelete(null)}
        onConfirm={handleDelete}
        title="Supprimer l'inscription"
        message={`Voulez-vous vraiment supprimer l'inscription de ${inscriptionToDelete?.prenom} ${inscriptionToDelete?.nom} ? Cette action est irréversible.`}
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