// src/pages/admin/comptabilite/charges/UpdateChargePage.tsx
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import ChargeForm from "../../../../components/admin/forms/ChargeForm";
import useCharges from "../../../../hooks/charges/useCharges";
import { alertServerError } from "../../../../helpers/alertError";
import { BaseCharge } from "../../../../utils/types/base";

export default function UpdateChargePage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
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
      navigate(-1);
    } catch (error) {
      alertServerError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!charge) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Charge non trouvée</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
        >
          Retour
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Modifier la charge</h1>
          <p className="text-sm text-gray-500 mt-1">{charge.libelle}</p>
        </div>
      </div>

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