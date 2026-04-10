// src/pages/admin/comptabilite/achats/UpdateAchatPage.tsx
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit, Package, Calendar, CreditCard, AlertCircle } from "lucide-react";
import AchatForm from "../../../../components/admin/forms/AchatForm";
import useAchats from "../../../../hooks/achats/useAchats";
import { alertServerError, alertSuccess } from "../../../../helpers/alertError";

export default function UpdateAchatPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);
  const { updateAchat } = useAchats();

  const location = useLocation();
  const achat = location.state;

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

  const id = achat.id;

  // Transformer les données pour le formulaire (une seule ligne)
  const initialData = {
    lignes: [{
      materielId: achat.materielId,
      quantite: achat.quantite.toString(),
      prixUnitaire: achat.prixUnitaire.toString()
    }],
    date: achat.date,
    modePaiement: achat.modePaiement,
    referenceExterne: achat.referenceExterne || '',
    notes: achat.notes || ''
  };

  const handleSubmit = async (formData: any) => {
    setIsSubmitting(true);
    try {
      const ligne = formData.lignes[0];
      await updateAchat(id, {
        materielId: ligne.materielId,
        quantite: Number(ligne.quantite),
        prixUnitaire: Number(ligne.prixUnitaire),
        referenceExterne: formData.referenceExterne,
        date: formData.date,
        modePaiement: formData.modePaiement,
        notes: formData.notes
      });
      setSaved(true);
      alertSuccess("Achat modifié avec succès");
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
    <div className="max-w-4xl mx-auto space-y-6 pb-8">
      {/* En-tête avec animation */}
      <div className="flex items-center gap-4 animate-fade-in-up">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-300 group"
        >
          <ArrowLeft size={20} className="text-gray-600 group-hover:text-primary transition-colors" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-800">Modifier l'achat</h1>
          <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
            <Edit size={14} />
            Modifier les informations de l'achat
          </p>
        </div>
      </div>

      {/* Message de succès */}
      {saved && (
        <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl p-4 flex items-center gap-3 animate-fade-in">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-green-700 font-medium">Achat modifié avec succès ! Redirection...</span>
        </div>
      )}

      {/* Informations de l'achat à modifier */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
        <div className="flex flex-wrap gap-4 justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-xl shadow-sm">
              <Package size={18} className="text-primary" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Matériel</p>
              <p className="font-medium text-gray-800">{achat.materielNom || achat.materielId}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-xl shadow-sm">
              <Calendar size={18} className="text-primary" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Date d'achat</p>
              <p className="font-medium text-gray-800">{new Date(achat.date).toLocaleDateString('fr-FR')}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-xl shadow-sm">
              <CreditCard size={18} className="text-primary" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Mode de paiement</p>
              <p className="font-medium text-gray-800">{achat.modePaiement}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Formulaire */}
      <div className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
        <AchatForm
          initialData={initialData}
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