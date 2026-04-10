// src/pages/admin/comptabilite/charges/UpdateChargePage.tsx
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, AlertCircle, CheckCircle, Edit } from "lucide-react";
import ChargeForm from "../../../../components/admin/forms/ChargeForm";
import useCharges from "../../../../hooks/charges/useCharges";
import { alertServerError, alertSuccess } from "../../../../helpers/alertError";
import { BaseCharge } from "../../../../utils/types/base";

export default function UpdateChargePage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);
  const location = useLocation();
  const charge = location.state;
  const { updateCharge } = useCharges();

  const handleSubmit = async (formData: any) => {
    setIsSubmitting(true);
    try {
      const updatedCharge: BaseCharge = {
        libelle: formData.libelle,
        montant: Number(formData.montant),
        date: formData.date,
        categorie: formData.categorie,
        service: formData.service,
        beneficiaire: formData.beneficiaire,
        modePaiement: formData.modePaiement,
        reference: formData.reference,
        periode: formData.periode,
        notes: formData.notes
      };

      await updateCharge(charge.id, updatedCharge);
      setSaved(true);
      alertSuccess("Charge modifiée avec succès");
      setTimeout(() => {
        navigate(-1);
      }, 1500);
    } catch (error) {
      alertServerError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!charge) {
    return (
      <div className="text-center py-12">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 max-w-md mx-auto">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={32} className="text-red-500" />
          </div>
          <p className="text-gray-500 text-center mb-4">Charge non trouvée</p>
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
    <div className="max-w-4xl mx-auto space-y-6 pb-8">
      {/* En-tête */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-300 group"
        >
          <ArrowLeft size={20} className="text-gray-600 group-hover:text-primary transition-colors" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-800">Modifier la charge</h1>
          <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
            <Edit size={14} />
            {charge.libelle}
          </p>
        </div>
      </div>

      {/* Message de succès */}
      {saved && (
        <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl p-4 flex items-center gap-3">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <CheckCircle size={20} className="text-green-600" />
          <span className="text-green-700 font-medium">Charge modifiée avec succès ! Redirection...</span>
        </div>
      )}

      {/* Informations récapitulatives */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4">
        <div className="flex flex-wrap gap-4 justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-xl shadow-sm">
              <span className="text-lg">{charge.categorie === 'salaire' ? '👤' : charge.categorie === 'facture' ? '💡' : '📦'}</span>
            </div>
            <div>
              <p className="text-xs text-gray-500">Catégorie</p>
              <p className="font-medium text-gray-800">
                {charge.categorie === 'salaire' ? 'Salaire' : 
                 charge.categorie === 'facture' ? 'Facture' : 
                 charge.categorie === 'loyer' ? 'Loyer' :
                 charge.categorie === 'entretien' ? 'Entretien' :
                 charge.categorie === 'transport' ? 'Transport' :
                 charge.categorie === 'fourniture_bureau' ? 'Fourniture bureau' : 'Autre'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-xl shadow-sm">
              <span className="text-lg">💰</span>
            </div>
            <div>
              <p className="text-xs text-gray-500">Montant</p>
              <p className="font-medium text-gray-800">
                {new Intl.NumberFormat('fr-FR').format(charge.montant)} FCFA
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-xl shadow-sm">
              <span className="text-lg">📅</span>
            </div>
            <div>
              <p className="text-xs text-gray-500">Date</p>
              <p className="font-medium text-gray-800">
                {new Date(charge.date).toLocaleDateString('fr-FR')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Formulaire */}
      <ChargeForm
        initialData={{
          libelle: charge.libelle,
          montant: charge.montant.toString(),
          date: charge.date,
          categorie: charge.categorie,
          service: charge.service || "",
          beneficiaire: charge.beneficiaire || "",
          modePaiement: charge.modePaiement,
          reference: charge.reference || "",
          periode: charge.periode || "",
          notes: charge.notes || ""
        }}
        onSubmit={handleSubmit}
        onCancel={() => navigate(-1)}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}