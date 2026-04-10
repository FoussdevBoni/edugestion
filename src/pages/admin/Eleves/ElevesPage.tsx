// src/pages/admin/eleves/ElevesPage.tsx
import { useState, useMemo } from "react";
import {
  Plus, Download, MoreVertical, UserPlus, FileText, Search,
  Users, School, Camera, TrendingUp
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
import { alertServerError, alertSuccess } from "../../../helpers/alertError";
import { Inscription } from "../../../utils/types/data";
import useCarte from "../../../hooks/eleves/useCarte";
import useClasses from "../../../hooks/classes/useClasses";
import { compterParClasse } from "../../../utils/helpers/compterParClasse";
import PageLayout from "../../../layouts/PageLayout";

const StatCard = ({ label, value, icon, color, delay = 0 }: any) => {
  const colors: any = {
    blue: "from-blue-50 to-blue-100 border-blue-200 text-blue-700",
    green: "from-green-50 to-green-100 border-green-200 text-green-700",
    purple: "from-purple-50 to-purple-100 border-purple-200 text-purple-700",
  };
  return (
    <div className={`bg-gradient-to-br ${colors[color]} rounded-xl border p-5 shadow-sm transition-all duration-300 hover:shadow-md hover:scale-[1.02] animate-fade-in-up`} style={{ animationDelay: `${delay}ms` }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider opacity-70">{label}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        <div className="p-3 bg-white/50 rounded-xl">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default function ElevesPage() {
  const navigate = useNavigate();

  const {
    niveauSelectionne, cycleSelectionne, niveauClasseSelectionne, classeSelectionne
  } = useEcoleNiveau();

  const { eleves, loading, deleteInscription, deleteManyInscriptions } = useEleves();
  const { classes } = useClasses();
  
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const [selectedEleve, setSelectedEleve] = useState<Inscription | null>(null);
  const [eleveToDelete, setEleveToDelete] = useState<Inscription | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [itemsToDelete, setItemsToDelete] = useState<string[] | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredEleves = eleves.filter(eleve => {
    const matchesGlobal = (!niveauSelectionne || eleve.niveauScolaire === niveauSelectionne) &&
      (!cycleSelectionne || eleve.cycle === cycleSelectionne);
    const matchesLocal = (!niveauClasseSelectionne || eleve.niveauClasse === niveauClasseSelectionne) &&
      (!classeSelectionne || eleve.classe === classeSelectionne);
    const matchesSearch = searchTerm === "" ||
      eleve.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      eleve.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (eleve.matricule || "").toLowerCase().includes(searchTerm.toLowerCase());

    return matchesGlobal && matchesLocal && matchesSearch;
  });

  const effectifsParClasse = compterParClasse(eleves, classes);

  const stats = useMemo(() => ({
    total: filteredEleves.length,
    garcons: filteredEleves.filter(e => e.sexe === 'M').length,
    filles: filteredEleves.filter(e => e.sexe === 'F').length
  }), [filteredEleves]);

  const handleDelete = async () => {
    if (!eleveToDelete?.id) return;
    setIsDeleting(true);
    try {
      await deleteInscription(eleveToDelete.id);
      setEleveToDelete(null);
      alertSuccess("Élève supprimé avec succès");
    } catch (err) {
      alertServerError(err, "Erreur suppression");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteMany = async () => {
    if (!itemsToDelete || itemsToDelete.length === 0) return;
    try {
      await deleteManyInscriptions(itemsToDelete);
      setItemsToDelete(null);
      alertSuccess(`${itemsToDelete.length} élève(s) supprimé(s) avec succès`);
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <PageLayout
      title="Gestion des élèves"
      description={`${filteredEleves.length} élèves affichés`}
      actions={
        <div className="flex items-center gap-3 animate-fade-in-up">
          <button
            onClick={() => navigate("/admin/eleves/upload-photos")}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-primary/80 text-white rounded-xl hover:shadow-md transition-all duration-300 hover:scale-[1.02]"
          >
            <Camera size={18} /> Ajouter les photos
          </button>
          <button
            onClick={() => setIsAddMenuOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-primary/80 text-white rounded-xl hover:shadow-md transition-all duration-300 hover:scale-[1.02]"
          >
            <Plus size={18} /> Nouvel élève
          </button>
        </div>
      }
      menu={{
        isOpen: isAddMenuOpen,
        onClose: () => setIsAddMenuOpen(false),
        title: "Gestion des élèves",
        icon: <Plus className="text-primary" size={20} />,
        items: menuItems
      }}
    >
      {/* Cartes statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Total élèves" value={stats.total} icon={<Users size={20} />} color="blue" delay={100} />
        <StatCard label="Garçons" value={stats.garcons} icon={<TrendingUp size={20} />} color="green" delay={200} />
        <StatCard label="Filles" value={stats.filles} icon={<Users size={20} />} color="purple" delay={300} />
      </div>

      {/* Stats rapides - Effectifs par classe */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 transition-all duration-300 hover:shadow-md animate-fade-in-up" style={{ animationDelay: '400ms' }}>
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2 text-gray-700">
          <School size={16} className="text-primary" /> Effectifs par classe
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.entries(effectifsParClasse).sort().map(([classe, count]) => (
            <div key={classe} className="bg-gray-50 p-3 rounded-xl flex justify-between items-center text-sm transition-all duration-200 hover:bg-gray-100">
              <span className="font-medium text-gray-700">{classe}</span>
              <span className="bg-primary/10 text-primary px-2 py-1 rounded-full font-bold text-xs">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recherche */}
      <div className="relative animate-fade-in-up" style={{ animationDelay: '500ms' }}>
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Rechercher par nom, prénom ou matricule..."
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

      {/* Filtre par onglets */}
      <div className="animate-fade-in-up" style={{ animationDelay: '600ms' }}>
        <ClasseFilter
          data={eleves}
          getCycle={(e) => e.cycle}
          getNiveauClasse={(e) => e.niveauClasse}
          getClasse={(e) => e.classe}
        />
      </div>

      {/* Liste */}
      <div className="animate-fade-in-up" style={{ animationDelay: '700ms' }}>
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
              className: "bg-gradient-to-r from-red-600 to-red-700 text-white hover:shadow-md transition-all"
            }
          ]}
        />
      </div>

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
        message={`Voulez-vous vraiment supprimer ${eleveToDelete?.prenom} ${eleveToDelete?.nom} ? Cette action est irréversible.`}
        confirmText={isDeleting ? "Suppression..." : "Supprimer"}
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