// src/pages/admin/comptabilite/charges/ChargesPage.tsx
import { useState } from "react";
import { Plus, Search, TrendingDown, DollarSign, Receipt, Building } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Charge } from "../../../../utils/types/data";
import DeleteConfirmationModal from "../../../../components/ui/DeleteConfirmationModal";
import { alertError, alertServerError, alertSuccess } from "../../../../helpers/alertError";
import ChargesList from "../../../../components/admin/lists/ChargesList";
import useCharges from "../../../../hooks/charges/useCharges";

export default function ChargesPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [categorieFilter, setCategorieFilter] = useState<string>("all");
  const { charges, deleteCharge } = useCharges();
  const [chargeToDelete, setChargeToDelete] = useState<Charge | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const formatMoney = (montant: number) => {
    return new Intl.NumberFormat('fr-FR').format(montant) + ' FCFA';
  };

  const filteredCharges = charges.filter(charge => {
    const matchesSearch =
      charge.libelle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      charge.beneficiaire?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      charge.reference?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategorie = categorieFilter === "all" || charge.categorie === categorieFilter;

    return matchesSearch && matchesCategorie;
  });

  const totalCharges = filteredCharges.reduce((sum, c) => sum + c.montant, 0);

  const handleDelete = async () => {
    if (!chargeToDelete?.id) {
      alertError("Une erreur s'est produite");
      return;
    }
    setIsDeleting(true);
    try {
      await deleteCharge(chargeToDelete.id);
      setChargeToDelete(null);
      alertSuccess("Charge supprimée avec succès");
    } catch (error) {
      alertServerError(error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteClick = (charge: Charge) => {
    setChargeToDelete(charge);
  };

  return (
    <div className="space-y-6">
      {/* En-tête avec animation */}
      <div className="flex items-center justify-between animate-fade-in-up">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gestion des charges</h1>
          <p className="text-sm text-gray-500 mt-1">
            Salaires, factures, entretien et autres dépenses
          </p>
        </div>

        <button
          onClick={() => navigate("/admin/comptabilite/charges/new")}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-primary/80 text-white rounded-xl hover:shadow-md transition-all duration-300 hover:scale-[1.02]"
        >
          <Plus size={18} />
          Nouvelle charge
        </button>
      </div>

      {/* Résumé avec cartes stylisées et animations */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 p-5 transition-all duration-300 hover:shadow-md hover:scale-[1.02] animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-blue-700 uppercase tracking-wider">Total charges</p>
              <p className="text-2xl font-bold text-blue-800 mt-1">{formatMoney(totalCharges)}</p>
              <p className="text-xs text-blue-600 mt-1">{filteredCharges.length} transactions</p>
            </div>
            <div className="p-3 bg-white/50 rounded-xl">
              <DollarSign size={20} className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200 p-5 transition-all duration-300 hover:shadow-md hover:scale-[1.02] animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-green-700 uppercase tracking-wider">Salaires</p>
              <p className="text-2xl font-bold text-green-800 mt-1">
                {formatMoney(charges.filter(c => c.categorie === 'salaire').reduce((sum, c) => sum + c.montant, 0))}
              </p>
            </div>
            <div className="p-3 bg-white/50 rounded-xl">
              <TrendingDown size={20} className="text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200 p-5 transition-all duration-300 hover:shadow-md hover:scale-[1.02] animate-fade-in-up" style={{ animationDelay: '300ms' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-purple-700 uppercase tracking-wider">Factures</p>
              <p className="text-2xl font-bold text-purple-800 mt-1">
                {formatMoney(charges.filter(c => c.categorie === 'facture').reduce((sum, c) => sum + c.montant, 0))}
              </p>
            </div>
            <div className="p-3 bg-white/50 rounded-xl">
              <Receipt size={20} className="text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200 p-5 transition-all duration-300 hover:shadow-md hover:scale-[1.02] animate-fade-in-up" style={{ animationDelay: '400ms' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-orange-700 uppercase tracking-wider">Autres dépenses</p>
              <p className="text-2xl font-bold text-orange-800 mt-1">
                {formatMoney(charges.filter(c => !['salaire', 'facture'].includes(c.categorie)).reduce((sum, c) => sum + c.montant, 0))}
              </p>
            </div>
            <div className="p-3 bg-white/50 rounded-xl">
              <Building size={20} className="text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filtres avec animation */}
      <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up" style={{ animationDelay: '500ms' }}>
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher une charge..."
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

        <select
          value={categorieFilter}
          onChange={(e) => setCategorieFilter(e.target.value)}
          className="px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all duration-200 bg-white"
        >
          <option value="all">Toutes catégories</option>
          <option value="salaire">Salaires</option>
          <option value="facture">Factures</option>
          <option value="loyer">Loyers</option>
          <option value="entretien">Entretien</option>
          <option value="transport">Transport</option>
          <option value="fourniture_bureau">Fournitures bureau</option>
          <option value="autre">Autre</option>
        </select>
      </div>

      {/* Liste des charges avec animation */}
      <div className="animate-fade-in-up" style={{ animationDelay: '600ms' }}>
        <ChargesList
          charges={filteredCharges}
          onDelete={handleDeleteClick}
        />
      </div>

      {/* Message si aucun résultat avec animation */}
      {filteredCharges.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-xl animate-fade-in-up" style={{ animationDelay: '700ms' }}>
          <DollarSign size={48} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">Aucune charge trouvée</p>
          {(searchTerm || categorieFilter !== "all") && (
            <button
              onClick={() => {
                setSearchTerm("");
                setCategorieFilter("all");
              }}
              className="mt-3 text-sm text-primary hover:underline"
            >
              Réinitialiser les filtres
            </button>
          )}
        </div>
      )}

      <DeleteConfirmationModal
        isOpen={!!chargeToDelete}
        onClose={() => setChargeToDelete(null)}
        onConfirm={handleDelete}
        title="Supprimer la charge"
        message={`Voulez-vous vraiment supprimer la charge "${chargeToDelete?.libelle}" ? Cette action est irréversible.`}
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