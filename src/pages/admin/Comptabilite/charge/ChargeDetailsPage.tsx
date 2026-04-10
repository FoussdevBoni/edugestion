// src/pages/admin/comptabilite/charges/ChargeDetailsPage.tsx
import { 
  ArrowLeft, Edit, Trash2,
  Calendar, User, CreditCard, Tag,
  TrendingDown, AlertCircle, CheckCircle
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Charge } from "../../../../utils/types/data";
import { alertError, alertServerError, alertSuccess } from "../../../../helpers/alertError";
import { useState } from "react";
import DeleteConfirmationModal from "../../../../components/ui/DeleteConfirmationModal";
import useCharges from "../../../../hooks/charges/useCharges";

const CATEGORIE_LABELS: Record<string, { label: string; color: string; icon: string }> = {
  salaire: { label: "Salaire", color: "from-blue-50 to-blue-100 border-blue-200 text-blue-700", icon: "👤" },
  facture: { label: "Facture", color: "from-red-50 to-red-100 border-red-200 text-red-700", icon: "💡" },
  loyer: { label: "Loyer", color: "from-purple-50 to-purple-100 border-purple-200 text-purple-700", icon: "🏠" },
  entretien: { label: "Entretien", color: "from-orange-50 to-orange-100 border-orange-200 text-orange-700", icon: "🔧" },
  transport: { label: "Transport", color: "from-yellow-50 to-yellow-100 border-yellow-200 text-yellow-700", icon: "🚚" },
  fourniture_bureau: { label: "Fourniture bureau", color: "from-green-50 to-green-100 border-green-200 text-green-700", icon: "📎" },
  autre: { label: "Autre", color: "from-gray-50 to-gray-100 border-gray-200 text-gray-700", icon: "📦" },
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
  const [isDeleting, setIsDeleting] = useState(false);

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
      setTimeout(() => {
        navigate("/admin/comptabilite/charges");
      }, 1500);
    } catch (error) {
      alertServerError(error);
    } finally {
      setIsDeleting(false);
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
      <div className="text-center py-12 animate-fade-in-up">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 max-w-md mx-auto">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={32} className="text-red-500" />
          </div>
          <p className="text-gray-500 text-center mb-4">Charge non trouvée</p>
          <button
            onClick={() => navigate("/admin/comptabilite/charges")}
            className="w-full px-4 py-2 bg-gradient-to-r from-primary to-primary/80 text-white rounded-xl hover:shadow-md transition-all duration-300"
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

  const categorieInfo = CATEGORIE_LABELS[charge.categorie] || CATEGORIE_LABELS.autre;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-8">
      {/* En-tête avec animation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fade-in-up">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/admin/comptabilite/charges")}
            className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-300 group"
          >
            <ArrowLeft size={20} className="text-gray-600 group-hover:text-primary transition-colors" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Détails de la charge</h1>
            <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
              <span className={categorieInfo.icon} /> {charge.libelle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(`/admin/comptabilite/charges/update`, { state: charge })}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:shadow-md transition-all duration-300 hover:scale-[1.02]"
          >
            <Edit size={16} />
            Modifier
          </button>
          <button
            onClick={() => setChargeToDelete(charge)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:shadow-md transition-all duration-300 hover:scale-[1.02]"
          >
            <Trash2 size={16} />
            Supprimer
          </button>
        </div>
      </div>

      {/* Badge de statut */}
      <div className="animate-fade-in-up" style={{ animationDelay: '100ms' }}>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-sm">
          <CheckCircle size={14} />
          Payé
        </div>
      </div>

      {/* En-tête avec catégorie */}
      <div className={`bg-gradient-to-br ${categorieInfo.color} rounded-xl border p-6 transition-all duration-300 hover:shadow-md animate-fade-in-up`} style={{ animationDelay: '200ms' }}>
        <div className="flex items-center gap-3">
          <span className="text-4xl">{categorieInfo.icon}</span>
          <div>
            <p className="text-sm opacity-70">Catégorie</p>
            <p className="text-xl font-bold">{categorieInfo.label}</p>
          </div>
        </div>
      </div>

      {/* Informations principales */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Colonne gauche - 2/3 */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all duration-300 hover:shadow-md animate-fade-in-up" style={{ animationDelay: '300ms' }}>
          <div className="flex items-center gap-2 mb-5">
            <div className="w-1 h-6 bg-primary rounded-full"></div>
            <h2 className="text-lg font-semibold text-gray-800">Informations détaillées</h2>
          </div>
          
          <div className="space-y-4">
            <div className="group p-3 rounded-xl hover:bg-gray-50 transition-colors duration-200">
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-sm">Libellé</span>
                <span className="font-semibold text-gray-800 text-lg">{charge.libelle}</span>
              </div>
            </div>

            <div className="bg-gradient-to-r from-primary/5 to-transparent p-4 rounded-xl">
              <div className="flex items-center justify-between">
                <span className="text-gray-700 font-semibold">Montant</span>
                <span className="font-mono font-bold text-primary text-2xl">
                  {formatMoney(charge.montant)}
                </span>
              </div>
            </div>

            <div className="group p-3 rounded-xl hover:bg-gray-50 transition-colors duration-200">
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-sm">Date</span>
                <span className="flex items-center gap-2 text-gray-700">
                  <Calendar size={16} className="text-gray-400" />
                  {formatDate(charge.date)}
                </span>
              </div>
            </div>

            {charge.service && (
              <div className="group p-3 rounded-xl hover:bg-gray-50 transition-colors duration-200">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 text-sm">Service</span>
                  <span className="text-gray-700">{charge.service}</span>
                </div>
              </div>
            )}

            {charge.periode && (
              <div className="group p-3 rounded-xl hover:bg-gray-50 transition-colors duration-200">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 text-sm">Période</span>
                  <span className="text-gray-700">{charge.periode}</span>
                </div>
              </div>
            )}

            {charge.beneficiaire && (
              <div className="group p-3 rounded-xl hover:bg-gray-50 transition-colors duration-200">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 text-sm">Bénéficiaire</span>
                  <span className="flex items-center gap-2 text-gray-700">
                    <User size={16} className="text-gray-400" />
                    {charge.beneficiaire}
                  </span>
                </div>
              </div>
            )}

            <div className="group p-3 rounded-xl hover:bg-gray-50 transition-colors duration-200">
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-sm">Mode de paiement</span>
                <span className="flex items-center gap-2 text-gray-700">
                  <CreditCard size={16} className="text-gray-400" />
                  {MODE_PAIEMENT_LABELS[charge.modePaiement] || charge.modePaiement}
                </span>
              </div>
            </div>

            {charge.reference && (
              <div className="group p-3 rounded-xl hover:bg-gray-50 transition-colors duration-200">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 text-sm">Référence</span>
                  <span className="flex items-center gap-2 font-mono text-sm text-gray-700">
                    <Tag size={16} className="text-gray-400" />
                    {charge.reference}
                  </span>
                </div>
              </div>
            )}

            {charge.notes && (
              <div className="p-3 bg-gray-50 rounded-xl">
                <p className="text-gray-500 text-sm mb-2">Notes</p>
                <p className="text-gray-700">{charge.notes}</p>
              </div>
            )}

            <div className="flex items-center justify-between text-xs text-gray-400 pt-2">
              <span>Créée le {formatDateTime(charge.createdAt)}</span>
              {charge.updatedAt !== charge.createdAt && (
                <span>Modifiée le {formatDateTime(charge.updatedAt)}</span>
              )}
            </div>
          </div>
        </div>

        {/* Colonne droite - 1/3 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all duration-300 hover:shadow-md animate-fade-in-up" style={{ animationDelay: '400ms' }}>
          <div className="flex items-center gap-2 mb-5">
            <div className="w-1 h-6 bg-green-500 rounded-full"></div>
            <h2 className="text-lg font-semibold text-gray-800">Actions</h2>
          </div>
          
          <div className="space-y-3">
            {charge.transactionId && (
              <button 
                onClick={() => navigate(`/admin/comptabilite/transactions/details`, { state: charge.transaction })}
                className="w-full flex items-center gap-3 p-3 bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 rounded-xl hover:shadow-md transition-all duration-300 hover:scale-[1.02]"
              >
                <TrendingDown size={18} />
                <span className="font-medium">Voir la transaction</span>
              </button>
            )}
          </div>

          {/* Résumé rapide */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Résumé</h3>
            <dl className="space-y-2">
              <div className="flex justify-between text-sm p-2 rounded-lg hover:bg-gray-50 transition-colors">
                <dt className="text-gray-500">Catégorie</dt>
                <dd className="font-medium text-gray-700">{categorieInfo.label}</dd>
              </div>
              <div className="flex justify-between text-sm p-2 rounded-lg hover:bg-gray-50 transition-colors">
                <dt className="text-gray-500">Statut</dt>
                <dd className="text-green-600 font-medium">Payé</dd>
              </div>
              {charge.transactionId && (
                <div className="flex justify-between text-sm p-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <dt className="text-gray-500">Transaction</dt>
                  <dd className="font-mono text-xs text-gray-600">{charge.transactionId.slice(0, 8)}...</dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      </div>

      {/* Modal de confirmation suppression */}
      <DeleteConfirmationModal
        isOpen={!!chargeToDelete}
        onClose={() => setChargeToDelete(null)}
        onConfirm={handleDelete}
        title="Supprimer la charge"
        message={`Voulez-vous vraiment supprimer la charge "${charge.libelle}" ? Cette action est irréversible.`}
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