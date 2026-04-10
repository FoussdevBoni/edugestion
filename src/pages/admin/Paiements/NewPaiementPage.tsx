import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle, CreditCard } from "lucide-react";
import PaiementForm, { PaiementFormData } from "../../../components/admin/forms/PaiementForm";
import { paiementService } from "../../../services/paiementService";
import { alertServerError, alertSuccess } from "../../../helpers/alertError";
import { BasePaiement } from "../../../utils/types/base";

export default function NewPaiementPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (formData: PaiementFormData) => {
    setIsSubmitting(true);
    try {
      const promises = formData.inscriptions?.map(async (inscriptionId) => {
        const paiement: BasePaiement = {
          inscriptionId,
          montantPaye: formData.montantPaye,
          statut: formData.statut,
          montantRestant: formData.montantRestant,
          modePaiement: formData.modePaiement,
          datePayement: formData.datePayement,
          motif: formData.motif
        };
        return await paiementService.create(paiement);
      });

      await Promise.all(promises);
      setSaved(true);
      alertSuccess("Paiement(s) enregistré(s) avec succès");
      
      setTimeout(() => {
        navigate(-1);
      }, 1500);
    } catch (error) {
      alertServerError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-8">
      {/* Message de succès */}
      {saved && (
        <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl p-4 flex items-center gap-3 animate-fade-in">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <CheckCircle size={20} className="text-green-600" />
          <span className="text-green-700 font-medium">Paiement(s) enregistré(s) avec succès ! Redirection...</span>
        </div>
      )}

      {/* En-tête avec animation */}
      <div className="flex items-center gap-4 animate-fade-in-up">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-300 group"
        >
          <ArrowLeft size={20} className="text-gray-600 group-hover:text-primary transition-colors" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Nouveaux paiements</h1>
          <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
            <CreditCard size={14} />
            Enregistrer des paiements pour une classe
          </p>
        </div>
      </div>

      {/* Informations utiles */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
        <div className="flex items-start gap-3">
          <div className="p-1 bg-white rounded-full shadow-sm">
            <span className="text-primary text-sm font-bold block px-2">i</span>
          </div>
          <div className="text-sm text-gray-600">
            <p className="font-medium text-gray-700 mb-1">Informations</p>
            <p>
              Vous pouvez enregistrer des paiements pour plusieurs élèves à la fois.
              Sélectionnez la classe, puis les élèves concernés.
            </p>
          </div>
        </div>
      </div>

      {/* Formulaire avec animation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md animate-fade-in-up" style={{ animationDelay: '200ms' }}>
        <PaiementForm
          onSubmit={handleSubmit}
          onCancel={() => navigate(-1)}
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