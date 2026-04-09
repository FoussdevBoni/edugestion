// src/pages/admin/comptabilite/charges/ChargesPage.tsx
import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Charge } from "../../../../utils/types/data";
import DeleteConfirmationModal from "../../../../components/ui/DeleteConfirmationModal";
import { alertError, alertServerError } from "../../../../helpers/alertError";
import ChargesList from "../../../../components/admin/lists/ChargesList";
import useCharges from "../../../../hooks/charges/useCharges";

// Données fictives


export default function ChargesPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [categorieFilter, setCategorieFilter] = useState<string>("all");
  const { charges, deleteCharge } = useCharges();
  const [chargeToDelete, setChargeToDelete] = useState<Charge | null>(null);

  const formatMoney = (montant: number) => {
    return new Intl.NumberFormat('fr-FR').format(montant);
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

  const handleDelete = () => {
    if (!chargeToDelete?.id) {
      alertError("Une erreur s'est produite");
      return;
    }
    try {
      // Logique de suppression ici
      deleteCharge(chargeToDelete?.id)
      setChargeToDelete(null);
    } catch (error) {
      alertServerError(error);
    }
  };

  const handleDeleteClick = (charge: Charge) => {
    setChargeToDelete(charge);
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gestion des charges</h1>
          <p className="text-sm text-gray-500 mt-1">
            Salaires, factures, entretien et autres dépenses
          </p>
        </div>

        <button
          onClick={() => navigate("/admin/comptabilite/charges/new")}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
        >
          <Plus size={18} />
          Nouvelle charge
        </button>
      </div>

      {/* Résumé */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-500">Total charges</p>
            <p className="text-2xl font-bold text-primary">{formatMoney(totalCharges)}</p>
            <p className="text-xs text-gray-400 mt-1">{filteredCharges.length} transactions</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Salaire</p>
            <p className="text-lg font-medium">
              {formatMoney(charges.filter(c => c.categorie === 'salaire').reduce((sum, c) => sum + c.montant, 0))}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Factures</p>
            <p className="text-lg font-medium">
              {formatMoney(charges.filter(c => c.categorie === 'facture').reduce((sum, c) => sum + c.montant, 0))}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Autres</p>
            <p className="text-lg font-medium">
              {formatMoney(charges.filter(c => !['salaire', 'facture'].includes(c.categorie)).reduce((sum, c) => sum + c.montant, 0))}
            </p>
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher une charge..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        <select
          value={categorieFilter}
          onChange={(e) => setCategorieFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
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

      {/* Liste des charges */}
      <ChargesList
        charges={filteredCharges}
        onDelete={handleDeleteClick}
      />

      <DeleteConfirmationModal
        isOpen={!!chargeToDelete}
        onClose={() => setChargeToDelete(null)}
        onConfirm={handleDelete}
        title="Supprimer la charge de l'historique"
        message={`Voulez-vous vraiment supprimer cette charge ?`}
        confirmText="Supprimer"
        cancelText="Annuler"
      />
    </div>
  );
}