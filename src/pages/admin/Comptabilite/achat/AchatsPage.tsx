// src/pages/admin/comptabilite/achats/AchatsPage.tsx
import { useState, useMemo } from "react";
import { Plus, Search, Filter, UserPlus, FileText, MoreVertical, TrendingUp, Package, Calendar, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Achat } from "../../../../utils/types/data";
import { alertError, alertServerError, alertSuccess } from "../../../../helpers/alertError";
import AchatsList from "../../../../components/admin/lists/AchatsList";
import useAchats from "../../../../hooks/achats/useAchats";
import useMateriels from "../../../../hooks/materiels/useMateriels";
import PageLayout from "../../../../layouts/PageLayout";

const StatCard = ({ label, value, subValue, icon, color, delay = 0 }: any) => {
  const colors: any = {
    blue: "from-blue-50 to-blue-100 border-blue-200 text-blue-700",
    green: "from-green-50 to-green-100 border-green-200 text-green-700",
    purple: "from-purple-50 to-purple-100 border-purple-200 text-purple-700",
    orange: "from-orange-50 to-orange-100 border-orange-200 text-orange-700",
  };
  return (
    <div className={`bg-gradient-to-br ${colors[color]} rounded-xl border p-5 shadow-sm transition-all duration-300 hover:shadow-md hover:scale-[1.02] animate-fade-in-up`} style={{ animationDelay: `${delay}ms` }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider opacity-70">{label}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {subValue && <p className="text-xs opacity-70 mt-1">{subValue}</p>}
        </div>
        <div className="p-3 bg-white/50 rounded-xl">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default function AchatsPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const { achats, deleteAchat, loading } = useAchats();
  const { materiels } = useMateriels();
  const [achatToDelete, setAchatToDelete] = useState<Achat | null>(null);
  const [selectedAchat, setSelectedAchat] = useState<Achat | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Construction du dictionnaire des matériels
  const materielsDict = useMemo(() => {
    return materiels.reduce((acc, m) => {
      acc[m.id] = m.nom;
      return acc;
    }, {} as Record<string, string>);
  }, [materiels]);

  // Filtrage des achats
  const filteredAchats = useMemo(() => {
    return achats.filter(achat => {
      const materielNom = materielsDict[achat.materielId] || '';
      return materielNom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        achat.date.includes(searchTerm) ||
        achat.reference?.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [achats, materielsDict, searchTerm]);

  // Calcul des totaux
  const totalDepenses = useMemo(() => {
    return achats.reduce((sum, a) => sum + (a.total || a.quantite * a.prixUnitaire), 0);
  }, [achats]);

  const moyenneParAchat = useMemo(() => {
    return achats.length > 0 ? totalDepenses / achats.length : 0;
  }, [achats.length, totalDepenses]);

  const dernierAchat = useMemo(() => {
    return achats.length > 0 ? achats[0] : null;
  }, [achats]);

  const formatMoney = (montant: number): string => {
    return new Intl.NumberFormat('fr-FR').format(montant) + ' FCFA';
  };

  const handleDelete = async (): Promise<void> => {
    if (!achatToDelete?.id) {
      alertError("Une erreur s'est produite");
      return;
    }
    setIsDeleting(true);
    try {
      await deleteAchat(achatToDelete.id);
      setAchatToDelete(null);
      alertSuccess("Achat supprimé avec succès");
    } catch (error) {
      alertServerError(error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading && achats.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <PageLayout
      title="Achats"
      description="Historique des achats de matériel"
      actions={
        <button
          onClick={() => navigate("/admin/comptabilite/achats/new")}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-primary/80 text-white rounded-xl hover:shadow-md transition-all duration-300 hover:scale-[1.02] animate-fade-in-up"
          style={{ animationDelay: '0ms' }}
        >
          <Plus size={18} />
          Nouvel achat
        </button>
      }
      menu={{
        isOpen: !!selectedAchat,
        onClose: () => setSelectedAchat(null),
        title: `${selectedAchat?.reference || "Achat"}`,
        icon: <UserPlus className="text-primary" size={20} />,
        items: [
          {
            label: "Voir détails",
            icon: FileText,
            onClick: () => { navigate("/admin/comptabilite/achats/details", { state: selectedAchat }); setSelectedAchat(null); }
          },
          {
            label: "Modifier",
            icon: UserPlus,
            onClick: () => { navigate("/admin/comptabilite/achats/update", { state: selectedAchat }); setSelectedAchat(null); }
          },
          {
            label: "Supprimer",
            icon: MoreVertical,
            onClick: () => { setAchatToDelete(selectedAchat); setSelectedAchat(null); }
          }
        ]
      }}
      deleteModal={{
        isOpen: !!achatToDelete,
        onClose: () => setAchatToDelete(null),
        onConfirm: handleDelete,
        title: "Supprimer l'achat",
        message: `Voulez-vous vraiment supprimer l'achat de ${achatToDelete ? materielsDict[achatToDelete.materielId] : ''} ? Cette action est irréversible.`,
       
      }}
    >
      {/* Cartes statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <StatCard 
          label="Total des achats" 
          value={formatMoney(totalDepenses)} 
          subValue={`${achats.length} transactions`}
          icon={<DollarSign size={20} />} 
          color="blue" 
          delay={100}
        />
        <StatCard 
          label="Dernier achat" 
          value={dernierAchat ? materielsDict[dernierAchat.materielId] : '-'} 
          subValue={dernierAchat ? new Date(dernierAchat.date).toLocaleDateString('fr-FR') : '-'}
          icon={<Package size={20} />} 
          color="green" 
          delay={200}
        />
        <StatCard 
          label="Moyenne par achat" 
          value={formatMoney(moyenneParAchat)} 
          icon={<TrendingUp size={20} />} 
          color="purple" 
          delay={300}
        />
      </div>

      {/* Filtres */}
      <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher par matériel, date ou référence..."
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
        <button className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200 hover:scale-[1.02]">
          <Filter size={16} />
          Filtres
        </button>
      </div>

      {/* Liste des achats */}
      <div className="animate-fade-in-up" style={{ animationDelay: '500ms' }}>
        <AchatsList
          achats={filteredAchats}
          materiels={materielsDict}
          onAction={(achat) => setSelectedAchat(achat)}
        />
      </div>

      {/* Message si aucun résultat */}
      {filteredAchats.length === 0 && !loading && (
        <div className="text-center py-12 bg-gray-50 rounded-xl animate-fade-in-up" style={{ animationDelay: '600ms' }}>
          <Package size={48} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">Aucun achat trouvé</p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="mt-3 text-sm text-primary hover:underline"
            >
              Effacer la recherche
            </button>
          )}
        </div>
      )}

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