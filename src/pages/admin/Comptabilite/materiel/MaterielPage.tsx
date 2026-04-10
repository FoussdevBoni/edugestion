// src/pages/admin/comptabilite/materiel/MaterielPage.tsx
import { useState, useMemo } from "react";
import {
  Plus, Search, Package, ShoppingCart,
  ClipboardList, CreditCard, AlertTriangle,
  TrendingUp, TrendingDown
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Materiel } from "../../../../utils/types/data";
import { alertError, alertServerError, alertSuccess } from "../../../../helpers/alertError";
import DeleteConfirmationModal from "../../../../components/ui/DeleteConfirmationModal";
import useMateriels from "../../../../hooks/materiels/useMateriels";
import MaterielList from "../../../../components/admin/lists/MaterielsList";

const STOCK_BAS_SEUIL = 30;

const StatCard = ({ label, value, icon, color, delay = 0, subValue }: any) => {
  const colors: any = {
    blue: "from-blue-50 to-blue-100 border-blue-200 text-blue-700",
    green: "from-green-50 to-green-100 border-green-200 text-green-700",
    orange: "from-orange-50 to-orange-100 border-orange-200 text-orange-700",
    red: "from-red-50 to-red-100 border-red-200 text-red-700",
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

export default function MaterielPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const { materiels, deleteMateriel, loading } = useMateriels();
  const [materielToDelete, setMaterielToDelete] = useState<Materiel | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!materielToDelete?.id) {
      alertError("Une erreur s'est produite");
      return;
    }
    setIsDeleting(true);
    try {
      await deleteMateriel(materielToDelete.id);
      setMaterielToDelete(null);
      alertSuccess("Matériel supprimé avec succès");
    } catch (error) {
      alertServerError(error);
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredMateriels = useMemo(() => {
    return materiels.filter(m =>
      m.nom.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [materiels, searchTerm]);

  const stats = useMemo(() => ({
    total: materiels.length,
    stockOk: materiels.filter(m => m.quantite >= STOCK_BAS_SEUIL).length,
    stockBas: materiels.filter(m => m.quantite > 0 && m.quantite < STOCK_BAS_SEUIL).length,
    rupture: materiels.filter(m => m.quantite === 0).length
  }), [materiels]);

  if (loading && materiels.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      {/* En-tête avec animation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fade-in-up">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gestion du matériel</h1>
          <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
            <Package size={14} />
            {materiels.length} types de matériel en stock
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => navigate("/admin/comptabilite/achats")}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:shadow-md transition-all duration-300 hover:scale-[1.02]"
          >
            <ShoppingCart size={18} />
            Achats
          </button>
          <button
            onClick={() => navigate("/admin/comptabilite/transactions")}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:shadow-md transition-all duration-300 hover:scale-[1.02]"
          >
            <CreditCard size={18} />
            Transactions
          </button>
          <button
            onClick={() => navigate("/admin/comptabilite/inventaires")}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:shadow-md transition-all duration-300 hover:scale-[1.02]"
          >
            <ClipboardList size={18} />
            Inventaires
          </button>
          <button
            onClick={() => navigate("/admin/comptabilite/materiel/new")}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-primary/80 text-white rounded-xl hover:shadow-md transition-all duration-300 hover:scale-[1.02]"
          >
            <Plus size={18} />
            Nouveau matériel
          </button>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          label="Total articles" 
          value={stats.total} 
          icon={<Package size={20} />} 
          color="blue" 
          delay={100}
        />
        <StatCard 
          label="Stock OK" 
          value={stats.stockOk} 
          icon={<TrendingUp size={20} />} 
          color="green" 
          delay={200}
        />
        <StatCard 
          label="Stock bas" 
          value={stats.stockBas} 
          icon={<AlertTriangle size={20} />} 
          color="orange" 
          delay={300}
        />
        <StatCard 
          label="Rupture" 
          value={stats.rupture} 
          icon={<TrendingDown size={20} />} 
          color="red" 
          delay={400}
        />
      </div>

      {/* Barre de recherche avec animation */}
      <div className="flex items-center gap-4 animate-fade-in-up" style={{ animationDelay: '500ms' }}>
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un matériel..."
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
      </div>

      {/* Liste du matériel avec animation */}
      <div className="animate-fade-in-up" style={{ animationDelay: '600ms' }}>
        <MaterielList
          materiels={filteredMateriels}
          onDelete={(materiel) => setMaterielToDelete(materiel)}
        />
      </div>

      {/* Message si aucun résultat avec animation */}
      {filteredMateriels.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-xl animate-fade-in-up" style={{ animationDelay: '700ms' }}>
          <Package size={48} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">Aucun matériel trouvé</p>
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

      {/* Modal de confirmation suppression */}
      <DeleteConfirmationModal
        isOpen={!!materielToDelete}
        onClose={() => setMaterielToDelete(null)}
        onConfirm={handleDelete}
        title="Supprimer le matériel"
        message={`Voulez-vous vraiment supprimer "${materielToDelete?.nom}" ? Cette action est irréversible.`}
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
    </div>
  );
}