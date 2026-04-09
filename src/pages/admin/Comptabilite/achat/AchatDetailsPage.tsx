// src/pages/admin/materiel/AchatDetailsPage.tsx
import { useState } from "react";
import {
  ArrowLeft, Edit, Trash2,
  Package, CreditCard, Calendar, User, FileText
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import DeleteConfirmationModal from "../../../../components/ui/DeleteConfirmationModal";
import { Achat } from "../../../../utils/types/data";
import { alertError, alertServerError } from "../../../../helpers/alertError";



const MATERIEL = {
  id: "2",
  nom: "Cahier 100 pages",
  quantite: 128
};

const TRANSACTION = {
  id: "t1",
  type: "sortie",
  montant: 50000,
  motif: "Achat matériel",
  modePaiement: "Mobile money",
  reference: "TR20260315-001"
};

export default function AchatDetailsPage() {
  const navigate = useNavigate();
  const [materiel] = useState(MATERIEL);
  const [transaction] = useState(TRANSACTION);
  const [achatToDelete, setAchatToDelete] = useState<Achat | null>(null);

  const location = useLocation()
  const achat = location.state

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

  const handleDelete = () => {
    if (!achatToDelete?.id) {
      alertError("Une erreur s'est produite")
      return
    }
    try {

      setAchatToDelete(null)
    } catch (error) {
      alertServerError(error)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Détails de l'achat</h1>
            <p className="text-sm text-gray-500 mt-1">Référence: {achat.id}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(`/admin/comptabilite/achats/update`, { state: achat })}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Edit size={16} />
            Modifier
          </button>
          <button
            onClick={() => {
              setAchatToDelete(achat)
            }}
            className="flex items-center gap-2 px-4 py-2 bg-red-600
           text-white rounded-lg hover:bg-red-700">
            <Trash2 size={16} />
            Supprimer
          </button>

        </div>
      </div>

      {/* Informations principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Colonne gauche - Détails achat */}
        <div className="md:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Informations d'achat</h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between pb-4 border-b">
              <span className="text-gray-500">Matériel</span>
              <div className="flex items-center gap-2">
                <Package size={16} className="text-primary" />
                <button
                  onClick={() => navigate(`/admin/comptabilite/materiel/details`, { state: materiel })}
                  className="text-primary hover:underline font-medium"
                >
                  {materiel.nom}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pb-4 border-b">
              <span className="text-gray-500">Quantité</span>
              <span className="font-mono font-medium text-lg">{achat.quantite} unités</span>
            </div>

            <div className="flex items-center justify-between pb-4 border-b">
              <span className="text-gray-500">Prix unitaire</span>
              <span className="font-mono font-medium">{formatMoney(achat.prixUnitaire)}</span>
            </div>

            <div className="flex items-center justify-between pb-4 border-b">
              <span className="text-gray-500">Total</span>
              <span className="font-mono font-bold text-primary text-xl">
                {formatMoney(achat.total || achat.quantite * achat.prixUnitaire)}
              </span>
            </div>

            <div className="flex items-center justify-between pb-4 border-b">
              <span className="text-gray-500">Date d'achat</span>
              <span className="flex items-center gap-2">
                <Calendar size={16} className="text-gray-400" />
                {formatDate(achat.date)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-500">Enregistré par</span>
              <span className="flex items-center gap-2">
                <User size={16} className="text-gray-400" />
                {achat.createdBy}
              </span>
            </div>
          </div>
        </div>

        {/* Colonne droite - Transaction liée */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Transaction liée</h2>

          {transaction ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Référence</span>
                <button
                  onClick={() => navigate(`/admin/comptabilite/transactions/details`, { state: transaction })}
                  className="text-primary hover:underline font-mono text-sm"
                >
                  {transaction.reference}
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-500">Type</span>
                <span className={`px-2 py-1 rounded-full text-xs ${transaction.type === 'sortie' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                  }`}>
                  {transaction.type === 'sortie' ? 'Sortie' : 'Entrée'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-500">Montant</span>
                <span className="font-mono font-medium">{formatMoney(transaction.montant)}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-500">Motif</span>
                <span>{transaction.motif}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-500">Paiement</span>
                <span className="flex items-center gap-1">
                  <CreditCard size={14} className="text-gray-400" />
                  {transaction.modePaiement}
                </span>
              </div>

              <button
                onClick={() => navigate(`/admin/comptabilite/transactions/details`, { state: transaction })}
                className="w-full mt-4 flex items-center justify-center gap-2 p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                <FileText size={16} />
                Voir la transaction
              </button>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>Aucune transaction liée</p>
              <button onClick={() => {
                navigate(`/admin/comptabilite/transactions/new`)
              }} className="mt-4 text-sm text-primary hover:underline">
                Créer une transaction
              </button>
            </div>
          )}
        </div>
      </div>


      <DeleteConfirmationModal
        isOpen={!!achatToDelete}
        onClose={() => setAchatToDelete(null)}
        onConfirm={handleDelete}
        title="Supprimer l'achat de l'historique"
        message={`Voulez-vous vraiment supprimer cet achat ?`}
        confirmText="Supprimer"
        cancelText="Annuler"
      />
    </div>
  );
}