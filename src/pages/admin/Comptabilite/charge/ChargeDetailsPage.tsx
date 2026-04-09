// src/pages/admin/comptabilite/charges/ChargeDetailsPage.tsx
import { 
  ArrowLeft, Edit, Trash2,
  Calendar, User, CreditCard, Tag,
  TrendingDown
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Charge } from "../../../../utils/types/data";
import { alertError, alertServerError } from "../../../../helpers/alertError";
import { useState } from "react";
import DeleteConfirmationModal from "../../../../components/ui/DeleteConfirmationModal";
import useCharges from "../../../../hooks/charges/useCharges";

const CATEGORIE_LABELS: Record<string, { label: string; color: string; icon: string }> = {
  salaire: { label: "Salaire", color: "bg-blue-100 text-blue-700", icon: "👤" },
  facture: { label: "Facture", color: "bg-red-100 text-red-700", icon: "💡" },
  loyer: { label: "Loyer", color: "bg-purple-100 text-purple-700", icon: "🏠" },
  entretien: { label: "Entretien", color: "bg-orange-100 text-orange-700", icon: "🔧" },
  transport: { label: "Transport", color: "bg-yellow-100 text-yellow-700", icon: "🚚" },
  fourniture_bureau: { label: "Fourniture bureau", color: "bg-green-100 text-green-700", icon: "📎" },
  autre: { label: "Autre", color: "bg-gray-100 text-gray-700", icon: "📦" },
};

const MODE_PAIEMENT_LABELS: Record<string, string> = {
  especes: "Espèces",
  mobile_money: "Mobile money",
  virement: "Virement bancaire",
  cheque: "Chèque"
};

export default function ChargeDetailsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const charge: Charge = location.state;
  const { deleteCharge } = useCharges();
  
  const [chargeToDelete, setChargeToDelete] = useState<Charge | null>(null);

  const handleDelete = async () => {
    if (!chargeToDelete?.id) {
      alertError("Une erreur s'est produite");
      return;
    }
    try {
      await deleteCharge(chargeToDelete.id);
      navigate("/admin/comptabilite/charges");
    } catch (error) {
      alertServerError(error);
    }
  };

  const formatMoney = (montant: number) => {
    return new Intl.NumberFormat('fr-FR').format(montant) + ' FCFA';
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!charge) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Charge non trouvée</p>
        <button
          onClick={() => navigate("/admin/comptabilite/charges")}
          className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
        >
          Retour
        </button>
      </div>
    );
  }

  const categorieInfo = CATEGORIE_LABELS[charge.categorie] || CATEGORIE_LABELS.autre;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/admin/comptabilite/charges")}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Détails de la charge</h1>
            <p className="text-sm text-gray-500 mt-1">{charge.libelle}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(`/admin/comptabilite/charges/update`, { state: charge })}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Edit size={16} />
            Modifier
          </button>
          <button
            onClick={() => setChargeToDelete(charge)}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            <Trash2 size={16} />
            Supprimer
          </button>
        </div>
      </div>

      {/* En-tête avec catégorie */}
      <div className={`${categorieInfo.color} p-6 rounded-lg border`}>
        <div className="flex items-center gap-3">
          <span className="text-3xl">{categorieInfo.icon}</span>
          <div>
            <p className="text-sm opacity-80">Catégorie</p>
            <p className="text-xl font-bold">{categorieInfo.label}</p>
          </div>
        </div>
      </div>

      {/* Informations principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Colonne gauche - 2/3 */}
        <div className="md:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Informations détaillées</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-4 border-b">
              <span className="text-gray-500">Libellé</span>
              <span className="font-medium text-lg">{charge.libelle}</span>
            </div>

            <div className="flex items-center justify-between pb-4 border-b">
              <span className="text-gray-500">Montant</span>
              <span className="font-mono font-bold text-primary text-2xl">
                {formatMoney(charge.montant)}
              </span>
            </div>

            <div className="flex items-center justify-between pb-4 border-b">
              <span className="text-gray-500">Date</span>
              <span className="flex items-center gap-2">
                <Calendar size={16} className="text-gray-400" />
                {formatDate(charge.date)}
              </span>
            </div>

            {charge.service && (
              <div className="flex items-center justify-between pb-4 border-b">
                <span className="text-gray-500">Service</span>
                <span>{charge.service}</span>
              </div>
            )}

            {charge.periode && (
              <div className="flex items-center justify-between pb-4 border-b">
                <span className="text-gray-500">Période</span>
                <span>{charge.periode}</span>
              </div>
            )}

            {charge.beneficiaire && (
              <div className="flex items-center justify-between pb-4 border-b">
                <span className="text-gray-500">Bénéficiaire</span>
                <span className="flex items-center gap-2">
                  <User size={16} className="text-gray-400" />
                  {charge.beneficiaire}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between pb-4 border-b">
              <span className="text-gray-500">Mode de paiement</span>
              <span className="flex items-center gap-2">
                <CreditCard size={16} className="text-gray-400" />
                {MODE_PAIEMENT_LABELS[charge.modePaiement] || charge.modePaiement}
              </span>
            </div>

            {charge.reference && (
              <div className="flex items-center justify-between pb-4 border-b">
                <span className="text-gray-500">Référence</span>
                <span className="flex items-center gap-2 font-mono text-sm">
                  <Tag size={16} className="text-gray-400" />
                  {charge.reference}
                </span>
              </div>
            )}

            {charge.notes && (
              <div className="pb-4 border-b">
                <p className="text-gray-500 mb-2">Notes</p>
                <p className="text-gray-700 bg-gray-50 p-3 rounded">{charge.notes}</p>
              </div>
            )}

            <div className="flex items-center justify-between text-sm text-gray-400">
              <span>Créée le {formatDateTime(charge.createdAt)}</span>
              {charge.updatedAt !== charge.createdAt && (
                <span>Modifiée le {formatDateTime(charge.updatedAt)}</span>
              )}
            </div>
          </div>
        </div>

        {/* Colonne droite - 1/3 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Actions</h2>
          
          <div className="space-y-3">
            {charge.transactionId && (
              <button 
                onClick={() => navigate(`/admin/comptabilite/transactions/details` , {state: charge.transaction})}
                className="w-full flex items-center gap-3 p-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100"
              >
                <TrendingDown size={18} />
                <span className="font-medium">Voir la transaction</span>
              </button>
            )}
          </div>

          {/* Résumé rapide */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Résumé</h3>
            <dl className="space-y-2">
              <div className="flex justify-between text-sm">
                <dt className="text-gray-500">Catégorie</dt>
                <dd className="font-medium">{categorieInfo.label}</dd>
              </div>
              <div className="flex justify-between text-sm">
                <dt className="text-gray-500">Statut</dt>
                <dd className="text-green-600">Payé</dd>
              </div>
              {charge.transactionId && (
                <div className="flex justify-between text-sm">
                  <dt className="text-gray-500">Transaction</dt>
                  <dd className="font-mono text-xs">{charge.transactionId.slice(0, 8)}</dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      </div>

      <DeleteConfirmationModal
        isOpen={!!chargeToDelete}
        onClose={() => setChargeToDelete(null)}
        onConfirm={handleDelete}
        title="Supprimer la charge"
        message={`Voulez-vous vraiment supprimer "${charge.libelle}" ?`}
        confirmText="Supprimer"
        cancelText="Annuler"
      />
    </div>
  );
}