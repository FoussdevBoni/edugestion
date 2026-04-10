import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Loader2, CheckCircle, Edit, CreditCard, Calendar } from "lucide-react";
import PaiementForm, { PaiementFormData } from "../../../components/admin/forms/PaiementForm";
import { alertServerError, alertSuccess } from "../../../helpers/alertError";
import usePaiements from "../../../hooks/paiements/usePaiements";

export default function UpdatePaiementPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const paiement = location.state;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);
  const { updatePaiement } = usePaiements();

  const handleSubmit = async (data: PaiementFormData) => {
    setIsSubmitting(true);
    try {
      await updatePaiement(paiement.id, {
        montantPaye: data.montantPaye,
        statut: data.statut,
        modePaiement: data.modePaiement,
        datePayement: data.datePayement,
        montantRestant: data.montantRestant,
        motif: data.motif
      });
      setSaved(true);
      alertSuccess("Paiement modifié avec succès");
      setTimeout(() => {
        navigate("/admin/paiements");
      }, 1500);
    } catch (error) {
      alertServerError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin/paiements");
  };

  if (!paiement) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] animate-fade-in-up">
        <Loader2 size={40} className="animate-spin text-primary mb-4" />
        <p className="text-gray-500 font-medium">Chargement des informations...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Message de succès */}
      {saved && (
        <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl p-4 flex items-center gap-3 animate-fade-in">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <CheckCircle size={20} className="text-green-600" />
          <span className="text-green-700 font-medium">Paiement modifié avec succès ! Redirection...</span>
        </div>
      )}

      {/* En-tête avec animation */}
      <div className="flex items-center gap-4 animate-fade-in-up">
        <button
          onClick={() => navigate("/admin/paiements")}
          className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-300 group"
        >
          <ArrowLeft size={20} className="text-gray-600 group-hover:text-primary transition-colors" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Modifier le paiement</h1>
          <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
            <Edit size={14} />
            Référence #{paiement.id?.slice(-6)}
          </p>
        </div>
      </div>

      {/* Informations récapitulatives */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
        <div className="flex flex-wrap gap-4 justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-xl shadow-sm">
              <CreditCard size={18} className="text-primary" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Statut</p>
              <p className={`font-medium px-2 py-0.5 rounded-full text-xs inline-block ${
                paiement.statut === 'paye' ? 'bg-green-100 text-green-700' :
                paiement.statut === 'partiellement' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                {paiement.statut === 'paye' ? 'Payé' :
                 paiement.statut === 'partiellement' ? 'Partiel' : 'Impayé'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-xl shadow-sm">
              <CreditCard size={18} className="text-primary" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Montant</p>
              <p className="font-medium text-gray-800">{new Intl.NumberFormat('fr-FR').format(paiement.montantPaye)} FCFA</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-xl shadow-sm">
              <Calendar size={18} className="text-primary" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Date</p>
              <p className="font-medium text-gray-800">{new Date(paiement.datePayement).toLocaleDateString('fr-FR')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Formulaire avec animation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md animate-fade-in-up" style={{ animationDelay: '200ms' }}>
        <PaiementForm
          initialData={{
            inscriptionId: paiement.inscriptionId,
            montantPaye: paiement.montantPaye,
            statut: paiement.statut,
            modePaiement: paiement.modePaiement,
            datePayement: paiement.datePayement,
            motif: paiement.motif || "Scolarité",
            inscriptions: []
          }}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
        />
      </div>

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
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.5s ease-out forwards;
          opacity: 0;
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}