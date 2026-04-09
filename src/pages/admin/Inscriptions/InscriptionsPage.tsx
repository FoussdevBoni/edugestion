import { useState, useEffect, useMemo } from "react";
import { Plus, MoreVertical, FileText, Search, Calendar, Users } from "lucide-react";
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

export default function InscriptionsPage() {
  const navigate = useNavigate();
  
  // 1. Context & Data Hooks
  const { 
    niveauSelectionne, 
    cycleSelectionne, 
    niveauClasseSelectionne, 
    classeSelectionne 
  } = useEcoleNiveau();

  const { inscriptions, loading } = useInscriptions();

  // 2. Local UI State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInscription, setSelectedInscription] = useState<Inscription | null>(null);
  const [inscriptionToDelete, setInscriptionToDelete] = useState<Inscription | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAnnee, setSelectedAnnee] = useState("");

  // 3. Logique des Années Disponibles
  const anneesDisponibles = useMemo(() => {
    return [...new Set(inscriptions.map(ins => ins.anneeScolaire))].sort().reverse();
  }, [inscriptions]);

  // Initialisation auto sur l'année la plus récente
  useEffect(() => {
    if (anneesDisponibles.length > 0 && !selectedAnnee) {
      setSelectedAnnee(anneesDisponibles[0]);
    }
  }, [anneesDisponibles, selectedAnnee]);

  // 4. LOGIQUE DE FILTRAGE EN CASCADE
  
  // Étape A : On filtre d'abord par l'année sélectionnée uniquement
  // C'est cette donnée "propre" qu'on passe au ClasseFilter pour que les onglets soient cohérents
  const inscriptionsDeLAnnee = useMemo(() => {
    return inscriptions.filter(ins => !selectedAnnee || ins.anneeScolaire === selectedAnnee);
  }, [inscriptions, selectedAnnee]);

  // Étape B : Filtrage final (Année + Onglets + Recherche)
  const filteredInscriptions = useMemo(() => {
    return inscriptionsDeLAnnee.filter(ins => {
      // Filtres issus du Context (ClasseFilter)
      const matchesNiveauGlobal = !niveauSelectionne || ins.niveauScolaire === niveauSelectionne;
      const matchesCycleGlobal = !cycleSelectionne || ins.cycle === cycleSelectionne;
      const matchesNiveauClasse = !niveauClasseSelectionne || ins.niveauClasse === niveauClasseSelectionne;
      const matchesClasse = !classeSelectionne || ins.classe === classeSelectionne;
      
      // Recherche textuelle
      const matchesSearch = 
        ins.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ins.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (ins.matricule || "").toLowerCase().includes(searchTerm.toLowerCase());

      return matchesNiveauGlobal && matchesCycleGlobal && matchesNiveauClasse && matchesClasse && matchesSearch;
    });
  }, [inscriptionsDeLAnnee, niveauSelectionne, cycleSelectionne, niveauClasseSelectionne, classeSelectionne, searchTerm]);

  // 5. Handlers
  const handleDelete = () => {
    console.log("Suppression de l'inscription:", inscriptionToDelete);
    setInscriptionToDelete(null);
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
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Inscriptions</h1>
          <p className="text-sm text-gray-500 mt-1">
            {filteredInscriptions.length} inscription{filteredInscriptions.length > 1 ? 's' : ''} affichée{filteredInscriptions.length > 1 ? 's' : ''}
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus size={18} /> Nouvelles inscriptions
        </button>
      </div>

      {/* Barre de Filtres Principaux */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un élève..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50"
          />
        </div>

        <div className="relative">
          <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <select
            value={selectedAnnee}
            onChange={(e) => setSelectedAnnee(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 appearance-none bg-white"
          >
            {anneesDisponibles.map(annee => (
              <option key={annee} value={annee}>{annee}</option>
            ))}
          </select>
        </div>
      </div>

      {/* FILTRES PAR TABS (Niveau & Classe) */}
      {/* On passe ici 'inscriptionsDeLAnnee' pour que les onglets se mettent à jour selon l'année */}
      <ClasseFilter 
        data={inscriptionsDeLAnnee}
        getCycle={(ins) => ins.cycle}
        getNiveauClasse={(ins) => ins.niveauClasse}
        getClasse={(ins) => ins.classe}
      />

      {/* Liste finale filtrée */}
      <InscriptionsList 
        inscriptions={filteredInscriptions} 
        onAction={setSelectedInscription}
      />

      {/* ... Modals (le reste du code est identique) ... */}
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
        message={`Voulez-vous vraiment supprimer l'inscription de ${inscriptionToDelete?.prenom} ${inscriptionToDelete?.nom} ?`}
        confirmText="Supprimer"
        cancelText="Annuler"
      />
    </div>
  );
}