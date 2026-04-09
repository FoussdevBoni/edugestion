// src/pages/admin/comptabilite/achats/AchatsPage.tsx
import { useState, useMemo } from "react";
import { Plus, Search, Filter, UserPlus, FileText, MoreVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Achat } from "../../../../utils/types/data";
import { alertError, alertServerError } from "../../../../helpers/alertError";
import AchatsList from "../../../../components/admin/lists/AchatsList";
import useAchats from "../../../../hooks/achats/useAchats";
import useMateriels from "../../../../hooks/materiels/useMateriels";
import PageLayout from "../../../../layouts/PageLayout";

export default function AchatsPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const { achats, deleteAchat, loading } = useAchats();
  const { materiels } = useMateriels();
  const [achatToDelete, setAchatToDelete] = useState<Achat | null>(null);
  const [selectedAchat , setSelectedAchat] = useState<Achat | null>(null);

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
    try {
      await deleteAchat(achatToDelete.id);
      setAchatToDelete(null);
    } catch (error) {
      alertServerError(error);
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
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
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
        message: `Voulez-vous vraiment supprimer l'achat de ${achatToDelete ? materielsDict[achatToDelete.materielId] : ''} ?`
      }}
    >
      {/* Résumé */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-gray-500">Total achats</p>
            <p className="text-2xl font-bold text-primary">{formatMoney(totalDepenses)}</p>
            <p className="text-xs text-gray-400 mt-1">{achats.length} transactions</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Dernier achat</p>
            <p className="text-lg font-medium">
              {dernierAchat ? materielsDict[dernierAchat.materielId] : '-'}
            </p>
            <p className="text-xs text-gray-400">
              {dernierAchat ? new Date(dernierAchat.date).toLocaleDateString('fr-FR') : '-'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Moyenne par achat</p>
            <p className="text-lg font-medium">{formatMoney(moyenneParAchat)}</p>
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher par matériel, date ou référence..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
          <Filter size={16} />
          Filtres
        </button>
      </div>

      {/* Liste des achats */}
      <AchatsList
        achats={filteredAchats}
        materiels={materielsDict}
        onAction={(achat) => setSelectedAchat(achat)}
      />

      {/* Message si aucun résultat */}
      {filteredAchats.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">Aucun achat trouvé</p>
        </div>
      )}
    </PageLayout>
  );
}