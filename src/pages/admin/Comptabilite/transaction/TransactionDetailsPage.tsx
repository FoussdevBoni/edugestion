// src/pages/admin/comptabilite/transactions/TransactionDetailsPage.tsx
import { useState } from "react";
import { 
  ArrowLeft, Trash2,
  CreditCard, User, Calendar, FileText,
  ArrowUpCircle, ArrowDownCircle, Package, TrendingDown
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Transaction } from "../../../../utils/types/data";
import { alertError, alertServerError } from "../../../../helpers/alertError";
import DeleteConfirmationModal from "../../../../components/ui/DeleteConfirmationModal";
import useTransactions from "../../../../hooks/transactions/useTransactions";

export default function TransactionDetailsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const transaction = location.state as Transaction;
  const { deleteTransaction } = useTransactions();
  
  const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null);

  const handleDelete = async () => {
    if (!transactionToDelete?.id) {
      alertError("Une erreur s'est produite");
      return;
    }
    try {
      await deleteTransaction(transactionToDelete.id);
      navigate("/admin/comptabilite/transactions");
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

  if (!transaction) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Transaction non trouvée</p>
        <button
          onClick={() => navigate("/admin/comptabilite/transactions")}
          className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
        >
          Retour
        </button>
      </div>
    );
  }

  const isAchat = transaction.metaData?.type === 'achat';
  const isCharge = transaction.metaData?.type === 'charge';
  const isPaiement = transaction.metaData?.type === 'paiement';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/admin/comptabilite/transactions")}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Détails de la transaction</h1>
            <p className="text-sm text-gray-500 mt-1">{transaction.motif}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setTransactionToDelete(transaction)}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            <Trash2 size={16} />
            Supprimer
          </button>
        </div>
      </div>

      {/* Statut */}
      <div className={`rounded-lg p-4 ${
        transaction.type === 'entree' 
          ? 'bg-green-50 border border-green-200' 
          : 'bg-red-50 border border-red-200'
      }`}>
        <div className="flex items-center gap-3">
          {transaction.type === 'entree' 
            ? <ArrowUpCircle className="text-green-600" size={24} />
            : <ArrowDownCircle className="text-red-600" size={24} />
          }
          <div>
            <p className={`font-medium ${
              transaction.type === 'entree' ? 'text-green-800' : 'text-red-800'
            }`}>
              {transaction.type === 'entree' ? 'ENTRÉE D\'ARGENT' : 'SORTIE D\'ARGENT'}
            </p>
            <p className="text-2xl font-bold text-gray-800">
              {transaction.type === 'entree' ? '+' : '-'} {formatMoney(transaction.montant)}
            </p>
          </div>
        </div>
      </div>

      {/* Informations détaillées */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Colonne gauche - Détails principaux */}
        <div className="md:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Informations détaillées</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-4 border-b">
              <span className="text-gray-500">Motif</span>
              <span className="font-medium">{transaction.motif}</span>
            </div>

            <div className="flex items-center justify-between pb-4 border-b">
              <span className="text-gray-500">Description</span>
              <span className="text-gray-700 text-right max-w-md">{transaction.description}</span>
            </div>

            <div className="flex items-center justify-between pb-4 border-b">
              <span className="text-gray-500">Date</span>
              <span className="flex items-center gap-2">
                <Calendar size={16} className="text-gray-400" />
                {formatDate(transaction.date)}
              </span>
            </div>

            <div className="flex items-center justify-between pb-4 border-b">
              <span className="text-gray-500">Mode de paiement</span>
              <span className="flex items-center gap-2">
                <CreditCard size={16} className="text-gray-400" />
                {transaction.modePaiement}
              </span>
            </div>

            <div className="flex items-center justify-between pb-4 border-b">
              <span className="text-gray-500">Enregistrée par</span>
              <span className="flex items-center gap-2">
                <User size={16} className="text-gray-400" />
                {transaction.createdBy}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-500">Créée le</span>
              <span className="text-sm text-gray-600">{formatDateTime(transaction.createdAt)}</span>
            </div>

            {transaction.updatedAt !== transaction.createdAt && (
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Modifiée le</span>
                <span className="text-sm text-gray-600">{formatDateTime(transaction.updatedAt)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Colonne droite - Éléments liés */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Éléments liés</h2>
          
          {isAchat && transaction.metaData?.achatId && (
            <div className="space-y-4">
              <p className="text-sm text-gray-500">Cette transaction est liée à un achat</p>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-blue-800 mb-2">
                  <Package size={16} />
                  <span className="font-medium">Achat</span>
                </div>

                <button
                  onClick={() => navigate(`/admin/comptabilite/achats/${transaction.metaData.achatId}`)}
                  className="w-full mt-4 flex items-center justify-center gap-2 p-2 bg-white text-blue-700 rounded-lg hover:bg-blue-50 border border-blue-200"
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
              
              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-orange-800 mb-2">
                  <TrendingDown size={16} />
                  <span className="font-medium">Charge</span>
                </div>

                <button
                  onClick={() => navigate(`/admin/comptabilite/charges/${transaction.metaData.chargeId}`)}
                  className="w-full mt-4 flex items-center justify-center gap-2 p-2 bg-white text-orange-700 rounded-lg hover:bg-orange-50 border border-orange-200"
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
              
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-green-800 mb-2">
                  <CreditCard size={16} />
                  <span className="font-medium">Paiement</span>
                </div>

                <button
                  onClick={() => navigate(`/admin/comptabilite/paiements/${transaction.metaData.paiementId}`)}
                  className="w-full mt-4 flex items-center justify-center gap-2 p-2 bg-white text-green-700 rounded-lg hover:bg-green-50 border border-green-200"
                >
                  <FileText size={16} />
                  Voir le paiement
                </button>
              </div>
            </div>
          )}

          {!isAchat && !isCharge && !isPaiement && (
            <div className="text-center py-8 text-gray-500">
              <p>Aucun élément lié</p>
            </div>
          )}
        </div>
      </div>

      {/* Métadonnées */}
      {transaction.metaData && Object.keys(transaction.metaData).length > 0 && (
        <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Métadonnées</h3>
          <pre className="text-xs bg-white p-3 rounded border border-gray-200 overflow-auto">
            {JSON.stringify(transaction.metaData, null, 2)}
          </pre>
        </div>
      )}

      <DeleteConfirmationModal
        isOpen={!!transactionToDelete}
        onClose={() => setTransactionToDelete(null)}
        onConfirm={handleDelete}
        title="Supprimer la transaction"
        message={`Voulez-vous vraiment supprimer cette transaction ?`}
        confirmText="Supprimer"
        cancelText="Annuler"
      />
    </div>
  );
}