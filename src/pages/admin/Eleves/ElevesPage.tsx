// src/pages/admin/eleves/ElevesPage.tsx
import { useState } from "react";
import {
  Plus, Download, MoreVertical, UserPlus, FileText, Search,
  Users, School, Camera
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// Components
import ElevesList from "../../../components/admin/lists/ElevesList";
import MenuModal, { Menu } from "../../../components/ui/MenuModal";
import DeleteConfirmationModal from "../../../components/ui/DeleteConfirmationModal";
import ClasseFilter from "../../../components/wrappers/ClassesFilter";

// Hooks & Helpers
import { useEcoleNiveau } from "../../../hooks/filters/useEcoleNiveau";
import useEleves from "../../../hooks/eleves/useEleves";
import { alertServerError } from "../../../helpers/alertError";
import { Inscription } from "../../../utils/types/data";
import useCarte from "../../../hooks/eleves/useCarte";
import useClasses from "../../../hooks/classes/useClasses";
import { compterParClasse } from "../../../utils/helpers/compterParClasse";
import PageLayout from "../../../layouts/PageLayout";

export default function ElevesPage() {
  const navigate = useNavigate();

  // 1. Context & Data Hooks
  const {
    niveauSelectionne, cycleSelectionne, niveauClasseSelectionne, classeSelectionne
  } = useEcoleNiveau();

  const { eleves, loading, deleteInscription, deleteManyInscriptions } = useEleves();
  const { classes } = useClasses();
  
  // 2. Local UI State
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const [selectedEleve, setSelectedEleve] = useState<Inscription | null>(null);
  const [eleveToDelete, setEleveToDelete] = useState<Inscription | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [itemsToDelete, setItemsToDelete] = useState<string[] | null>(null);

  // 3. Filtrage dynamique
  const filteredEleves = eleves.filter(eleve => {
    const matchesGlobal = (!niveauSelectionne || eleve.niveauScolaire === niveauSelectionne) &&
      (!cycleSelectionne || eleve.cycle === cycleSelectionne);
    const matchesLocal = (!niveauClasseSelectionne || eleve.niveauClasse === niveauClasseSelectionne) &&
      (!classeSelectionne || eleve.classe === classeSelectionne);
    const matchesSearch =
      eleve.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      eleve.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (eleve.matricule || "").toLowerCase().includes(searchTerm.toLowerCase());

    return matchesGlobal && matchesLocal && matchesSearch;
  });

  const effectifsParClasse = compterParClasse(eleves, classes);

  // 4. Handlers
  const handleDelete = async () => {
    if (!eleveToDelete?.id) return;
    try {
      await deleteInscription(eleveToDelete.id);
      setEleveToDelete(null);
    } catch (err) {
      alertServerError(err, "Erreur suppression");
    }
  };

  const handleDeleteMany = async () => {
    if (!itemsToDelete || itemsToDelete.length === 0) return;
    try {
      await deleteManyInscriptions(itemsToDelete);
      setItemsToDelete(null);
    } catch (err) {
      alertServerError(err, "Erreur suppression multiple");
    }
  };

  const { handleDownload } = useCarte({ eleve: selectedEleve });

  const menuItems: Menu[] = [
    {
      label: "Ajouter un élève",
      icon: UserPlus,
      onClick: () => { navigate("/admin/eleves/new"); setIsAddMenuOpen(false); }
    },
    {
      label: "Importer liste",
      icon: Download,
      onClick: () => { navigate("/admin/eleves/import"); setIsAddMenuOpen(false); }
    },
    {
      label: "Transférer les élèves",
      icon: Users,
      onClick: () => { navigate("/admin/eleves/transfert"); setIsAddMenuOpen(false); }
    }
  ];

  if (loading) {
    return (
      <div className="flex justify-center p-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <PageLayout
      title="Gestion des élèves"
      description={`${filteredEleves.length} élèves affichés`}
      actions={
        <>
          <button
            onClick={() => navigate("/admin/eleves/upload-photos")}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            <Camera size={18} /> Ajouter les photos
          </button>
          <button
            onClick={() => setIsAddMenuOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            <Plus size={18} /> Nouvel élève
          </button>
        </>
      }
      menu={{
        isOpen: isAddMenuOpen,
        onClose: () => setIsAddMenuOpen(false),
        title: "Gestion des élèves",
        icon: <Plus className="text-primary" size={20} />,
        items: menuItems
      }}
    >
      {/* Stats rapides */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
          <School size={16} className="text-primary" /> Effectifs par classe
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.entries(effectifsParClasse).sort().map(([classe, count]) => (
            <div key={classe} className="bg-gray-50 p-2 rounded flex justify-between items-center text-sm">
              <span className="font-medium">{classe}</span>
              <span className="bg-primary/10 text-primary px-2 rounded-full font-bold">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recherche */}
      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Rechercher..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/50"
        />
      </div>

      {/* Filtre par onglets */}
      <ClasseFilter
        data={eleves}
        getCycle={(e) => e.cycle}
        getNiveauClasse={(e) => e.niveauClasse}
        getClasse={(e) => e.classe}
      />

      {/* Liste */}
      <ElevesList 
        eleves={filteredEleves} 
        selectable={true} 
        onAction={(e) => setSelectedEleve(e)}
        selectActions={[
          {
            label: "Supprimer",
            onClick: (selectedItems) => {
              const ids = selectedItems.map(i => i.id);
              setItemsToDelete(ids);
            },
            className: "bg-red-600 text-white hover:bg-red-700"
          }
        ]}
      />

      {/* Menu modal pour élève sélectionné */}
      {selectedEleve && (
        <MenuModal
          title={`${selectedEleve.prenom} ${selectedEleve.nom}`}
          isOpen={!!selectedEleve}
          onClose={() => setSelectedEleve(null)}
          icon={<UserPlus className="text-primary" size={20} />}
          menu={[
            {
              label: "Voir détails",
              icon: FileText,
              onClick: () => { navigate("/admin/eleves/details", { state: selectedEleve }); setSelectedEleve(null); }
            },
            {
              label: "Modifier",
              icon: UserPlus,
              onClick: () => { navigate("/admin/eleves/update", { state: selectedEleve }); setSelectedEleve(null); }
            },
            {
              label: "Télécharger la carte",
              icon: Download,
              onClick: async () => { handleDownload(); }
            },
            {
              label: "Supprimer",
              icon: MoreVertical,
              onClick: () => { setEleveToDelete(selectedEleve); setSelectedEleve(null); }
            }
          ]}
        />
      )}

      {/* Modal confirmation suppression simple */}
      <DeleteConfirmationModal
        isOpen={!!eleveToDelete}
        onClose={() => setEleveToDelete(null)}
        onConfirm={handleDelete}
        title="Supprimer l'élève"
        message={`Voulez-vous vraiment supprimer ${eleveToDelete?.prenom} ${eleveToDelete?.nom} ?`}
        confirmText="Supprimer"
        cancelText="Annuler"
      />

      {/* Modal confirmation suppression multiple */}
      <DeleteConfirmationModal 
        isOpen={!!itemsToDelete && itemsToDelete.length > 0} 
        onClose={() => setItemsToDelete(null)} 
        onConfirm={handleDeleteMany} 
        title="Supprimer les élèves"
        message={`Voulez-vous vraiment supprimer ${itemsToDelete?.length} élève(s) ? Cette action est irréversible.`}
      />
    </PageLayout>
  );
}