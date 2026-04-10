// src/pages/admin/materiel/AchatDetailsPage.tsx
import { useState } from "react";
import {
  ArrowLeft, Edit, Trash2,
  Package, CreditCard, Calendar, User, FileText,
  CheckCircle, AlertCircle, Building, Receipt
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import DeleteConfirmationModal from "../../../../components/ui/DeleteConfirmationModal";
import { Achat } from "../../../../utils/types/data";
import { alertError, alertServerError, alertSuccess } from "../../../../helpers/alertError";

export default function AchatDetailsPage() {
  const navigate = useNavigate();
  const [achatToDelete, setAchatToDelete] = useState<Achat | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const location = useLocation();
  const achat = location.state;

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

  const handleDelete = async () => {
    if (!achatToDelete?.id) {
      alertError("Une erreur s'est produite");
      return;
    }
    setIsDeleting(true);
    try {
      // Appel API pour supprimer
      // await deleteAchat(achatToDelete.id);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAchatToDelete(null);
      alertSuccess("Achat supprimé avec succès");
      setTimeout(() => navigate(-1), 1500);
    } catch (error) {
      alertServerError(error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!achat) {
    return (
      <div className="text-center py-12 animate-fade-in-up">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 max-w-md mx-auto">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={32} className="text-red-500" />
          </div>
          <p className="text-gray-500 text-center mb-4">Achat non trouvé</p>
          <button
            onClick={() => navigate(-1)}
            className="w-full px-4 py-2 bg-gradient-to-r from-primary to-primary/80 text-white rounded-xl hover:shadow-md transition-all duration-300"
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-8">
      {/* En-tête avec animation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fade-in-up">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-300 group"
          >
            <ArrowLeft size={20} className="text-gray-600 group-hover:text-primary transition-colors" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Détails de l'achat</h1>
            <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
              <Receipt size={14} />
              Référence: {achat.id?.slice(0, 8)}...
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(`/admin/comptabilite/achats/update`, { state: achat })}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:shadow-md transition-all duration-300 hover:scale-[1.02]"
          >
            <Edit size={16} />
            Modifier
          </button>
          <button
            onClick={() => setAchatToDelete(achat)}
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
          Achat validé
        </div>
      </div>

      {/* Grille principale */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Colonne gauche - Détails achat */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all duration-300 hover:shadow-md animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          <div className="flex items-center gap-2 mb-5">
            <div className="w-1 h-6 bg-primary rounded-full"></div>
            <h2 className="text-lg font-semibold text-gray-800">Informations d'achat</h2>
          </div>

          <div className="space-y-4">
            <div className="group p-3 rounded-xl hover:bg-gray-50 transition-colors duration-200">
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-sm">Matériel</span>
                <div className="flex items-center gap-2">
                  <Package size={16} className="text-primary" />
                  <span className="font-medium text-gray-800">{achat.materielNom || achat.materielId}</span>
                </div>
              </div>
            </div>

            <div className="group p-3 rounded-xl hover:bg-gray-50 transition-colors duration-200">
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-sm">Quantité</span>
                <span className="font-mono font-semibold text-gray-800">{achat.quantite} unités</span>
              </div>
            </div>

            <div className="group p-3 rounded-xl hover:bg-gray-50 transition-colors duration-200">
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-sm">Prix unitaire</span>
                <span className="font-mono font-medium text-gray-800">{formatMoney(achat.prixUnitaire)}</span>
              </div>
            </div>

            <div className="bg-gradient-to-r from-primary/5 to-transparent p-4 rounded-xl">
              <div className="flex items-center justify-between">
                <span className="text-gray-700 font-semibold">Total</span>
                <span className="font-mono font-bold text-primary text-2xl">
                  {formatMoney(achat.total || achat.quantite * achat.prixUnitaire)}
                </span>
              </div>
            </div>

            <div className="group p-3 rounded-xl hover:bg-gray-50 transition-colors duration-200">
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-sm">Date d'achat</span>
                <span className="flex items-center gap-2 text-gray-700">
                  <Calendar size={16} className="text-gray-400" />
                  {formatDate(achat.date)}
                </span>
              </div>
            </div>

            <div className="group p-3 rounded-xl hover:bg-gray-50 transition-colors duration-200">
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-sm">Enregistré par</span>
                <span className="flex items-center gap-2 text-gray-700">
                  <User size={16} className="text-gray-400" />
                  {achat.createdBy || "Administrateur"}
                </span>
              </div>
            </div>

            {achat.reference && (
              <div className="group p-3 rounded-xl hover:bg-gray-50 transition-colors duration-200">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 text-sm">Référence fournisseur</span>
                  <span className="font-mono text-sm text-gray-600">{achat.reference}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Colonne droite - Transaction liée */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all duration-300 hover:shadow-md animate-fade-in-up" style={{ animationDelay: '300ms' }}>
          <div className="flex items-center gap-2 mb-5">
            <div className="w-1 h-6 bg-green-500 rounded-full"></div>
            <h2 className="text-lg font-semibold text-gray-800">Transaction liée</h2>
          </div>

          {achat.transaction ? (
            <div className="space-y-4">
              <div className="p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 text-sm">Référence</span>
                  <button
                    onClick={() => navigate(`/admin/comptabilite/transactions/details`, { state: achat.transaction })}
                    className="text-primary hover:underline font-mono text-sm font-medium"
                  >
                    {achat.transaction.reference}
                  </button>
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 text-sm">Type</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${achat.transaction.type === 'sortie' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                    }`}>
                    {achat.transaction.type === 'sortie' ? 'Sortie' : 'Entrée'}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 text-sm">Montant</span>
                  <span className="font-mono font-semibold text-gray-800">{formatMoney(achat.transaction.montant)}</span>
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 text-sm">Motif</span>
                  <span className="text-gray-700">{achat.transaction.motif}</span>
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 text-sm">Mode de paiement</span>
                  <span className="flex items-center gap-1 text-gray-700">
                    <CreditCard size={14} className="text-gray-400" />
                    {achat.transaction.modePaiement}
                  </span>
                </div>
              </div>

              <button
                onClick={() => navigate(`/admin/comptabilite/transactions/details`, { state: achat.transaction })}
                className="w-full mt-4 flex items-center justify-center gap-2 p-2.5 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-xl hover:shadow-md transition-all duration-300 hover:scale-[1.02]"
              >
                <FileText size={16} />
                Voir le détail de la transaction
              </button>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Receipt size={24} className="text-gray-400" />
              </div>
              <p className="text-gray-500 text-sm mb-3">Aucune transaction liée</p>
              <button
                onClick={() => navigate(`/admin/comptabilite/transactions/new`, { state: { achatId: achat.id } })}
                className="text-sm text-primary hover:underline font-medium"
              >
                Créer une transaction
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Section informations supplémentaires */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
        <div className="flex items-start gap-3">
          <div className="p-1 bg-primary/10 rounded-full">
            <Building size={14} className="text-primary" />
          </div>
          <div className="text-sm text-gray-600">
            <p className="font-medium text-gray-700 mb-1">Informations</p>
            <p>Cet achat a été enregistré dans le système de gestion de stock. 
               La quantité a été automatiquement ajoutée au stock du matériel concerné.</p>
          </div>
        </div>
      </div>

      {/* Modal de confirmation suppression */}
      <DeleteConfirmationModal
        isOpen={!!achatToDelete}
        onClose={() => setAchatToDelete(null)}
        onConfirm={handleDelete}
        title="Supprimer l'achat"
        message={`Voulez-vous vraiment supprimer l'achat du ${achatToDelete ? formatDate(achatToDelete.date) : ''} ? Cette action est irréversible et supprimera également la transaction associée.`}
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