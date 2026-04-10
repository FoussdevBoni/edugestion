// src/pages/admin/comptabilite/transactions/TransactionDetailsPage.tsx
import { useState } from "react";
import { 
  ArrowLeft, Trash2,
  CreditCard, User, Calendar, FileText,
  ArrowUpCircle, ArrowDownCircle, Package, TrendingDown,
  AlertCircle
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Transaction } from "../../../../utils/types/data";
import { alertError, alertServerError, alertSuccess } from "../../../../helpers/alertError";
import DeleteConfirmationModal from "../../../../components/ui/DeleteConfirmationModal";
import useTransactions from "../../../../hooks/transactions/useTransactions";



export default function TransactionDetailsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const transaction = location.state as Transaction;
  const { deleteTransaction } = useTransactions();
  
  const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!transactionToDelete?.id) {
      alertError("Une erreur s'est produite");
      return;
    }
    setIsDeleting(true);
    try {
      await deleteTransaction(transactionToDelete.id);
      setTransactionToDelete(null);
      alertSuccess("Transaction supprimée avec succès");
      setTimeout(() => {
        navigate("/admin/comptabilite/transactions");
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

  if (!transaction) {
    return (
      <div className="text-center py-12 animate-fade-in-up">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 max-w-md mx-auto">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={32} className="text-red-500" />
          </div>
          <p className="text-gray-500 text-center mb-4">Transaction non trouvée</p>
          <button
            onClick={() => navigate("/admin/comptabilite/transactions")}
            className="w-full px-4 py-2 bg-gradient-to-r from-primary to-primary/80 text-white rounded-xl hover:shadow-md transition-all duration-300"
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

  const isAchat = transaction.metaData?.type === 'achat';
  const isCharge = transaction.metaData?.type === 'charge';
  const isPaiement = transaction.metaData?.type === 'paiement';

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-8">
      {/* En-tête avec animation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fade-in-up">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/admin/comptabilite/transactions")}
            className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-300 group"
          >
            <ArrowLeft size={20} className="text-gray-600 group-hover:text-primary transition-colors" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Détails de la transaction</h1>
            <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
              <CreditCard size={14} />
              {transaction.motif}
            </p>
          </div>
        </div>

        <button
          onClick={() => setTransactionToDelete(transaction)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:shadow-md transition-all duration-300 hover:scale-[1.02]"
        >
          <Trash2 size={16} />
          Supprimer
        </button>
      </div>

      {/* Statut avec animation */}
      <div className={`rounded-xl p-6 transition-all duration-300 hover:shadow-md animate-fade-in-up ${
        transaction.type === 'entree' 
          ? 'bg-gradient-to-r from-green-50 to-green-100 border border-green-200' 
          : 'bg-gradient-to-r from-red-50 to-red-100 border border-red-200'
      }`} style={{ animationDelay: '100ms' }}>
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-full ${
            transaction.type === 'entree' ? 'bg-green-200' : 'bg-red-200'
          }`}>
            {transaction.type === 'entree' 
              ? <ArrowUpCircle className="text-green-700" size={28} />
              : <ArrowDownCircle className="text-red-700" size={28} />
            }
          </div>
          <div>
            <p className={`font-semibold ${
              transaction.type === 'entree' ? 'text-green-800' : 'text-red-800'
            }`}>
              {transaction.type === 'entree' ? 'ENTRÉE D\'ARGENT' : 'SORTIE D\'ARGENT'}
            </p>
            <p className={`text-3xl font-bold ${
              transaction.type === 'entree' ? 'text-green-700' : 'text-red-700'
            }`}>
              {transaction.type === 'entree' ? '+' : '-'} {formatMoney(transaction.montant)}
            </p>
          </div>
        </div>
      </div>

      {/* Informations détaillées avec animations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Colonne gauche - Détails principaux */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all duration-300 hover:shadow-md animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          <div className="flex items-center gap-2 mb-5">
            <div className="w-1 h-6 bg-primary rounded-full"></div>
            <h2 className="text-lg font-semibold text-gray-800">Informations détaillées</h2>
          </div>
          
          <div className="space-y-4">
            <div className="group p-3 rounded-xl hover:bg-gray-50 transition-colors duration-200">
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-sm">Motif</span>
                <span className="font-medium text-gray-800">{transaction.motif}</span>
              </div>
            </div>

            <div className="group p-3 rounded-xl hover:bg-gray-50 transition-colors duration-200">
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-sm">Description</span>
                <span className="text-gray-700 text-right max-w-md">{transaction.description || '-'}</span>
              </div>
            </div>

            <div className="group p-3 rounded-xl hover:bg-gray-50 transition-colors duration-200">
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-sm">Date</span>
                <span className="flex items-center gap-2 text-gray-700">
                  <Calendar size={16} className="text-gray-400" />
                  {formatDate(transaction.date)}
                </span>
              </div>
            </div>

            <div className="group p-3 rounded-xl hover:bg-gray-50 transition-colors duration-200">
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-sm">Mode de paiement</span>
                <span className="flex items-center gap-2 text-gray-700">
                  <CreditCard size={16} className="text-gray-400" />
                  {transaction.modePaiement}
                </span>
              </div>
            </div>

            <div className="group p-3 rounded-xl hover:bg-gray-50 transition-colors duration-200">
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-sm">Enregistrée par</span>
                <span className="flex items-center gap-2 text-gray-700">
                  <User size={16} className="text-gray-400" />
                  {transaction.createdBy}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100">
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>Créée le {formatDateTime(transaction.createdAt)}</span>
                {transaction.updatedAt !== transaction.createdAt && (
                  <span>Modifiée le {formatDateTime(transaction.updatedAt)}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Colonne droite - Éléments liés */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all duration-300 hover:shadow-md animate-fade-in-up" style={{ animationDelay: '300ms' }}>
          <div className="flex items-center gap-2 mb-5">
            <div className="w-1 h-6 bg-green-500 rounded-full"></div>
            <h2 className="text-lg font-semibold text-gray-800">Éléments liés</h2>
          </div>
          
          {isAchat && transaction.metaData?.achatId && (
            <div className="space-y-4">
              <p className="text-sm text-gray-500">Cette transaction est liée à un achat</p>
              
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-5 transition-all duration-300 hover:shadow-md">
                <div className="flex items-center gap-3 text-blue-800 mb-3">
                  <div className="p-2 bg-white rounded-lg">
                    <Package size={18} />
                  </div>
                  <span className="font-semibold">Achat</span>
                </div>

                <button
                  onClick={() => navigate(`/admin/comptabilite/achats/details`, { state: { id: transaction.metaData.achatId } })}
                  className="w-full mt-3 flex items-center justify-center gap-2 p-2.5 bg-white text-blue-700 rounded-xl hover:shadow-md transition-all duration-300"
                >
                  <FileText size={16} />
                  Voir l'achat
                </button>
              </div>
            </div>
          )}

          {isCharge && transaction.metaData?.chargeId && (
            <div className="space-y-4">
              <p className="text-sm text-gray-500">Cette transaction est liée à une charge</p>
              
              <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-5 transition-all duration-300 hover:shadow-md">
                <div className="flex items-center gap-3 text-orange-800 mb-3">
                  <div className="p-2 bg-white rounded-lg">
                    <TrendingDown size={18} />
                  </div>
                  <span className="font-semibold">Charge</span>
                </div>

                <button
                  onClick={() => navigate(`/admin/comptabilite/charges/details`, { state: { id: transaction.metaData.chargeId } })}
                  className="w-full mt-3 flex items-center justify-center gap-2 p-2.5 bg-white text-orange-700 rounded-xl hover:shadow-md transition-all duration-300"
                >
                  <FileText size={16} />
                  Voir la charge
                </button>
              </div>
            </div>
          )}

          {isPaiement && transaction.metaData?.paiementId && (
            <div className="space-y-4">
              <p className="text-sm text-gray-500">Cette transaction est liée à un paiement</p>
              
              <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-5 transition-all duration-300 hover:shadow-md">
                <div className="flex items-center gap-3 text-green-800 mb-3">
                  <div className="p-2 bg-white rounded-lg">
                    <CreditCard size={18} />
                  </div>
                  <span className="font-semibold">Paiement</span>
                </div>

                <button
                  onClick={() => navigate(`/admin/comptabilite/paiements/details`, { state: { id: transaction.metaData.paiementId } })}
                  className="w-full mt-3 flex items-center justify-center gap-2 p-2.5 bg-white text-green-700 rounded-xl hover:shadow-md transition-all duration-300"
                >
                  <FileText size={16} />
                  Voir le paiement
                </button>
              </div>
            </div>
          )}

          {!isAchat && !isCharge && !isPaiement && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <FileText size={24} className="text-gray-400" />
              </div>
              <p className="text-gray-500">Aucun élément lié</p>
            </div>
          )}
        </div>
      </div>

      {/* Métadonnées avec animation */}
      {transaction.metaData && Object.keys(transaction.metaData).length > 0 && (
        <div className="bg-gray-50 rounded-xl border border-gray-100 p-5 transition-all duration-300 hover:shadow-md animate-fade-in-up" style={{ animationDelay: '400ms' }}>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Métadonnées</h3>
          <pre className="text-xs bg-white p-3 rounded-lg border border-gray-200 overflow-auto">
            {JSON.stringify(transaction.metaData, null, 2)}
          </pre>
        </div>
      )}

      {/* Modal de confirmation suppression */}
      <DeleteConfirmationModal
        isOpen={!!transactionToDelete}
        onClose={() => setTransactionToDelete(null)}
        onConfirm={handleDelete}
        title="Supprimer la transaction"
        message={`Voulez-vous vraiment supprimer la transaction "${transaction.motif}" ? Cette action est irréversible.`}
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