// src/pages/admin/comptabilite/ventes/VentesPage.tsx
import { useState, useMemo } from "react";
import { Plus, Search, Filter, UserPlus, FileText, MoreVertical, TrendingUp, Package, DollarSign, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Vente } from "../../../../utils/types/data";
import { alertError, alertServerError, alertSuccess } from "../../../../helpers/alertError";
import VentesList from "../../../../components/admin/lists/VentesList";
import useMateriels from "../../../../hooks/materiels/useMateriels";
import useEleves from "../../../../hooks/eleves/useEleves";
import PageLayout from "../../../../layouts/PageLayout";
import useVentes from "../../../../hooks/ventes/useVentes";

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

export default function VentesPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const { ventes, deleteVente, loading } = useVentes();
  const { materiels } = useMateriels();
  const { eleves } = useEleves();
  const [venteToDelete, setVenteToDelete] = useState<Vente | null>(null);
  const [selectedVente, setSelectedVente] = useState<Vente | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Construction du dictionnaire des matériels
  const materielsDict = useMemo(() => {
    return materiels.reduce((acc, m) => {
      acc[m.id] = m.nom;
      return acc;
    }, {} as Record<string, string>);
  }, [materiels]);

  // Construction du dictionnaire des élèves
  const elevesDict = useMemo(() => {
    return eleves.reduce((acc, e) => {
      acc[e.id] = `${e.prenom} ${e.nom}${e.matricule ? ` (${e.matricule})` : ''}`;
      return acc;
    }, {} as Record<string, string>);
  }, [eleves]);

  // Filtrage des ventes
  const filteredVentes = useMemo(() => {
    return ventes.filter(vente => {
      const materielNom = materielsDict[vente.materielId] || '';
      const eleveNom = vente.eleveId ? elevesDict[vente.eleveId] || '' : '';
      return materielNom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        eleveNom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vente.date.includes(searchTerm) ||
        vente.reference?.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [ventes, materielsDict, elevesDict, searchTerm]);

  // Calcul des totaux
  const totalVentes = useMemo(() => {
    return ventes.reduce((sum, v) => sum + (v.total || v.quantite * v.prixUnitaire), 0);
  }, [ventes]);

  const moyenneParVente = useMemo(() => {
    return ventes.length > 0 ? totalVentes / ventes.length : 0;
  }, [ventes.length, totalVentes]);

  const derniereVente = useMemo(() => {
    return ventes.length > 0 ? ventes[0] : null;
  }, [ventes]);

  const totalElevesAcheteurs = useMemo(() => {
    const elevesUniques = new Set(ventes.filter(v => v.eleveId).map(v => v.eleveId));
    return elevesUniques.size;
  }, [ventes]);

  const formatMoney = (montant: number): string => {
    return new Intl.NumberFormat('fr-FR').format(montant) + ' FCFA';
  };

  const handleDelete = async (): Promise<void> => {
    if (!venteToDelete?.id) {
      alertError("Une erreur s'est produite");
      return;
    }
    setIsDeleting(true);
    try {
      await deleteVente(venteToDelete.id);
      setVenteToDelete(null);
      alertSuccess("Vente supprimée avec succès");
    } catch (error) {
      alertServerError(error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading && ventes.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <PageLayout
      title="Ventes"
      description="Historique des ventes de matériel aux élèves"
      actions={
        <button
          onClick={() => navigate("/admin/comptabilite/ventes/new")}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-primary/80 text-white rounded-xl hover:shadow-md transition-all duration-300 hover:scale-[1.02] animate-fade-in-up"
          style={{ animationDelay: '0ms' }}
        >
          <Plus size={18} />
          Nouvelle vente
        </button>
      }
      menu={{
        isOpen: !!selectedVente,
        onClose: () => setSelectedVente(null),
        title: `Vente ${selectedVente?.reference || ""}`,
        icon: <UserPlus className="text-primary" size={20} />,
        items: [
          {
            label: "Voir détails",
            icon: FileText,
            onClick: () => { navigate("/admin/comptabilite/ventes/details", { state: selectedVente }); setSelectedVente(null); }
          },
          {
            label: "Modifier",
            icon: UserPlus,
            onClick: () => { navigate("/admin/comptabilite/ventes/update", { state: selectedVente }); setSelectedVente(null); }
          },
          {
            label: "Supprimer",
            icon: MoreVertical,
            onClick: () => { setVenteToDelete(selectedVente); setSelectedVente(null); }
          }
        ]
      }}
      deleteModal={{
        isOpen: !!venteToDelete,
        onClose: () => setVenteToDelete(null),
        onConfirm: handleDelete,
        title: "Supprimer la vente",
        message: `Voulez-vous vraiment supprimer la vente de ${venteToDelete ? materielsDict[venteToDelete.materielId] : ''} ? Cette action est irréversible.`,
      }}
    >
      {/* Cartes statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard 
          label="Total des ventes" 
          value={formatMoney(totalVentes)} 
          subValue={`${ventes.length} transactions`}
          icon={<DollarSign size={20} />} 
          color="blue" 
          delay={100}
        />
        <StatCard 
          label="Dernière vente" 
          value={derniereVente ? materielsDict[derniereVente.materielId] : '-'} 
          subValue={derniereVente ? new Date(derniereVente.date).toLocaleDateString('fr-FR') : '-'}
          icon={<Package size={20} />} 
          color="green" 
          delay={200}
        />
        <StatCard 
          label="Moyenne par vente" 
          value={formatMoney(moyenneParVente)} 
          icon={<TrendingUp size={20} />} 
          color="purple" 
          delay={300}
        />
        <StatCard 
          label="Élèves acheteurs" 
          value={totalElevesAcheteurs} 
          subValue="élèves uniques"
          icon={<Users size={20} />} 
          color="orange" 
          delay={400}
        />
      </div>

      {/* Filtres */}
      <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up" style={{ animationDelay: '500ms' }}>
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher par matériel, élève, date ou référence..."
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

      {/* Liste des ventes */}
      <div className="animate-fade-in-up" style={{ animationDelay: '600ms' }}>
        <VentesList
          ventes={filteredVentes}
          materiels={materielsDict}
          eleves={elevesDict}
          onAction={(vente) => setSelectedVente(vente)}
        />
      </div>

      {/* Message si aucun résultat */}
      {filteredVentes.length === 0 && !loading && (
        <div className="text-center py-12 bg-gray-50 rounded-xl animate-fade-in-up" style={{ animationDelay: '700ms' }}>
          <Package size={48} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">Aucune vente trouvée</p>
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