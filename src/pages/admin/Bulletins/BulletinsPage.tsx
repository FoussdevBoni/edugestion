// src/pages/admin/bulletins/BulletinsPage.tsx
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Download, Plus, Eye, RefreshCw, AlertTriangle, CheckCircle, Edit, FileText } from "lucide-react";

// Components
import BulletinsList from "../../../components/admin/lists/BulletinsList";
import ClasseFilter from "../../../components/wrappers/ClassesFilter";

// Hooks & Types
import { Bulletin } from "../../../utils/types/data";
import useBulletins from "../../../hooks/bulletins/useBulletins";
import usePeriodes from "../../../hooks/periodes/usePeriodes";
import { useEcoleNiveau } from "../../../hooks/filters/useEcoleNiveau";
import { alertServerError, alertSuccess } from "../../../helpers/alertError";
import PageLayout from "../../../layouts/PageLayout";
import DeleteConfirmationModal from "../../../components/ui/DeleteConfirmationModal";
import { bulletinService } from "../../../services/bulletinService";

const StatCard = ({ label, value, color, icon, delay = 0 }: any) => {
  const colors: any = {
    blue: "from-blue-50 to-blue-100 border-blue-200 text-blue-700",
    green: "from-green-50 to-green-100 border-green-200 text-green-700",
    orange: "from-orange-50 to-orange-100 border-orange-200 text-orange-700",
    yellow: "from-yellow-50 to-yellow-100 border-yellow-200 text-yellow-700",
  };
  return (
    <div className={`bg-gradient-to-br ${colors[color]} rounded-xl border p-5 shadow-sm transition-all duration-300 hover:shadow-md hover:scale-[1.02] animate-fade-in-up`} style={{ animationDelay: `${delay}ms` }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider opacity-70">{label}</p>
          <p className="text-3xl font-bold mt-1">{value}</p>
        </div>
        <div className="p-3 bg-white/50 rounded-xl">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default function BulletinsPage() {
  const navigate = useNavigate();

  const {
    niveauSelectionne, cycleSelectionne, niveauClasseSelectionne, classeSelectionne
  } = useEcoleNiveau();

  const { bulletins, handleDownload, loading, getStats, deleteBulletin,
    deleteManyBulletins, saveBulletin } = useBulletins({});
  const { periodes } = usePeriodes();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPeriode, setSelectedPeriode] = useState("");
  const [selectedBulletin, setSelectedBulletin] = useState<Bulletin | null>(null);
  const [bulletinToDelete, setBulletinToDelete] = useState<Bulletin | null>(null);
  const stats = useMemo(() => getStats(), [bulletins, getStats]);
  const [itemsToDelete, setItemsToDelete] = useState<string[] | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const filteredBulletins = useMemo(() => {
    return bulletins.filter(b => {
      const el = b.eleve;
      if (!el) return false;

      const matchesGlobal = (!niveauSelectionne || el.niveauScolaire === niveauSelectionne) &&
        (!cycleSelectionne || el.cycle === cycleSelectionne);

      const matchesLocalTabs = (!niveauClasseSelectionne || el.niveauClasse === niveauClasseSelectionne) &&
        (!classeSelectionne || el.classe === classeSelectionne);

      const matchesSearch = searchTerm === "" ||
        (el.nom?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (el.prenom?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (el.matricule?.toLowerCase() || "").includes(searchTerm.toLowerCase());

      const matchesPeriode = !selectedPeriode || b.periodeId === selectedPeriode;

      return matchesGlobal && matchesLocalTabs && matchesSearch && matchesPeriode;
    });
  }, [bulletins, niveauSelectionne, cycleSelectionne, niveauClasseSelectionne, classeSelectionne, searchTerm, selectedPeriode]);

  const handleDelete = async () => {
    if (!bulletinToDelete) return;
    try {
      await deleteBulletin(bulletinToDelete.id);
      setBulletinToDelete(null);
      alertSuccess("Bulletin supprimé avec succès");
    } catch (error) {
      alertServerError(error);
    }
  };

  const handleDeleteMany = async () => {
    if (!itemsToDelete || itemsToDelete.length === 0) return;
    try {
      await deleteManyBulletins(itemsToDelete);
      setItemsToDelete(null);
      alertSuccess(`${itemsToDelete.length} bulletin(s) supprimé(s) avec succès`);
    } catch (error) {
      alertServerError(error);
    }
  };

  const handleUpdateConduite = async (bulletinId: string, conduite: number) => {
    if (isUpdating) return;
    setIsUpdating(true);
    try {
      const bulletin = await bulletinService.getById(bulletinId);
      if (!bulletin) throw new Error("Bulletin non trouvé");

      await saveBulletin(bulletin.inscriptionId!, bulletin.periodeId!, {
        vieScolaire: {
          ...bulletin.vieScolaire || {},
          absences: bulletin.vieScolaire?.absences || 0,
          retards: bulletin.vieScolaire?.retards || 0,
          conduite: conduite
        }
      });
      alertSuccess("Note de conduite mise à jour");
    } catch (error) {
      console.error("Erreur:", error);
      alertServerError(error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading && bulletins.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <PageLayout
      title="Bulletins"
      description={`${filteredBulletins.length} bulletin${filteredBulletins.length > 1 ? 's' : ''} affiché${filteredBulletins.length > 1 ? 's' : ''}`}
      actions={
        <div className="flex items-center gap-3 animate-fade-in-up" style={{ animationDelay: '0ms' }}>
          <button
            onClick={() => navigate("/admin/bulletins/conduite")}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-primary/80 text-white rounded-xl hover:shadow-md transition-all duration-300 hover:scale-[1.02]"
          >
            <FileText size={18} />
            Note de conduite
          </button>

          <button
            onClick={() => navigate("/admin/bulletins/calculate")}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:shadow-md transition-all duration-300 hover:scale-[1.02]"
          >
            <RefreshCw size={18} />
            Générer calculs
          </button>
        </div>
      }
      menu={{
        isOpen: !!selectedBulletin,
        onClose: () => setSelectedBulletin(null),
        title: selectedBulletin ? `${selectedBulletin.eleve?.prenom || ""} ${selectedBulletin.eleve?.nom || ""}` : "",
        icon: <Eye className="text-primary" size={20} />,
        items: [
          { label: "Voir le bulletin", icon: Eye, onClick: () => navigate("/admin/bulletins/details", { state: selectedBulletin }) },
          { label: "Modifier", icon: Edit, onClick: () => navigate("/admin/bulletins/update", { state: selectedBulletin }) },
          {
            label: "Télécharger PDF", icon: Download,
            onClick: () => { if (selectedBulletin) handleDownload(selectedBulletin); }
          },
          { label: "Supprimer", icon: AlertTriangle, onClick: () => setBulletinToDelete(selectedBulletin) }
        ]
      }}
      deleteModal={{
        isOpen: !!bulletinToDelete,
        onClose: () => setBulletinToDelete(null),
        onConfirm: handleDelete,
        title: "Supprimer le bulletin",
        message: `Action irréversible pour ${bulletinToDelete?.eleve?.prenom || ""} ${bulletinToDelete?.eleve?.nom || ""}.`
      }}
    >
      {/* Statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard label="Total" value={stats.total} color="blue" icon={<FileText size={20} />} delay={100} />
        <StatCard label="Complets" value={stats.complets} color="green" icon={<CheckCircle size={20} />} delay={200} />
        <StatCard label="Incomplets" value={stats.incomplets} color="orange" icon={<AlertTriangle size={20} />} delay={300} />
        <StatCard label="À finaliser" value={stats.aFinaliser} color="yellow" icon={<Edit size={20} />} delay={400} />
      </div>

      {/* Barre de recherche et Période */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in-up" style={{ animationDelay: '500ms' }}>
        <div className="md:col-span-2 relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher par nom, prénom, matricule..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all duration-200"
          />
        </div>

        <select
          value={selectedPeriode}
          onChange={(e) => setSelectedPeriode(e.target.value)}
          className="px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white transition-all duration-200"
        >
          <option value="">Toutes les périodes</option>
          {periodes.map(p => (
            <option key={p.id} value={p.id}>{p.nom}</option>
          ))}
        </select>
      </div>

      {/* FILTRE PAR TABS */}
      <div className="animate-fade-in-up" style={{ animationDelay: '600ms' }}>
        <ClasseFilter
          data={bulletins}
          getCycle={(b) => b.eleve?.cycle || ""}
          getNiveauClasse={(b) => b.eleve?.niveauClasse || ""}
          getClasse={(b) => b.eleve?.classe || ""}
        />
      </div>

      {/* Liste des bulletins */}
      <div className="animate-fade-in-up" style={{ animationDelay: '700ms' }}>
        <BulletinsList
          bulletins={filteredBulletins}
          onAction={setSelectedBulletin}
          onUpdateConduite={handleUpdateConduite}
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

      {/* Modal confirmation suppression multiple */}
      <DeleteConfirmationModal
        isOpen={!!itemsToDelete && itemsToDelete.length > 0}
        onClose={() => setItemsToDelete(null)}
        onConfirm={handleDeleteMany}
        title="Supprimer les bulletins"
        message={`Voulez-vous vraiment supprimer ${itemsToDelete?.length} bulletin(s) ? Cette action est irréversible.`}
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