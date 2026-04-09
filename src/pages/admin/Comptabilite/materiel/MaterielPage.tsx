// src/pages/admin/comptabilite/materiel/MaterielPage.tsx
import { useState, useMemo } from "react";
import {
  Plus, Search, Package, ShoppingCart,
  ClipboardList, CreditCard, AlertTriangle
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Materiel } from "../../../../utils/types/data";
import { alertError, alertServerError } from "../../../../helpers/alertError";
import DeleteConfirmationModal from "../../../../components/ui/DeleteConfirmationModal";
import useMateriels from "../../../../hooks/materiels/useMateriels";
import MaterielList from "../../../../components/admin/lists/MaterielsList";

// Alerte stock bas
const STOCK_BAS_SEUIL = 30;

export default function MaterielPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const { materiels, deleteMateriel, loading } = useMateriels();
  const [materielToDelete, setMaterielToDelete] = useState<Materiel | null>(null);

  const handleDelete = async () => {
    if (!materielToDelete?.id) {
      alertError("Une erreur s'est produite");
      return;
    }
    try {
      await deleteMateriel(materielToDelete.id);
      setMaterielToDelete(null);
    } catch (error) {
      alertServerError(error);
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
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gestion du matériel</h1>
          <p className="text-sm text-gray-500 mt-1">
            {materiels.length} types de matériel en stock
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/admin/comptabilite/achats")}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <ShoppingCart size={18} />
            Achats
          </button>
          <button
            onClick={() => navigate("/admin/comptabilite/transactions")}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <CreditCard size={18} />
            Transactions
          </button>
          <button
            onClick={() => navigate("/admin/comptabilite/inventaires")}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            <ClipboardList size={18} />
            Inventaires
          </button>
          <button
            onClick={() => navigate("/admin/comptabilite/materiel/new")}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            <Plus size={18} />
            Nouveau matériel
          </button>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Package className="text-blue-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total articles</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <Package className="text-green-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Stock OK</p>
              <p className="text-2xl font-bold">{stats.stockOk}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-100 rounded-lg">
              <AlertTriangle className="text-orange-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Stock bas</p>
              <p className="text-2xl font-bold">{stats.stockBas}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-100 rounded-lg">
              <AlertTriangle className="text-red-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Rupture</p>
              <p className="text-2xl font-bold">{stats.rupture}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Barre de recherche */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un matériel..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </div>

      {/* Liste du matériel */}
      <MaterielList
        materiels={filteredMateriels}
        onDelete={(materiel) => setMaterielToDelete(materiel)}
      />

      {/* Message si aucun résultat */}
      {filteredMateriels.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">Aucun matériel trouvé</p>
        </div>
      )}

      <DeleteConfirmationModal
        isOpen={!!materielToDelete}
        onClose={() => setMaterielToDelete(null)}
        onConfirm={handleDelete}
        title="Supprimer le matériel"
        message={`Voulez-vous vraiment supprimer ${materielToDelete?.nom} ?`}
        confirmText="Supprimer"
        cancelText="Annuler"
      />
    </div>
  );
}