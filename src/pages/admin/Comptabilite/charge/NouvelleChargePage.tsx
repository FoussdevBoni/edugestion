// src/pages/admin/comptabilite/charges/NouvelleChargePage.tsx
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import ChargeForm from "../../../../components/admin/forms/ChargeForm";
import { BaseCharge } from "../../../../utils/types/base";
import { chargeService } from "../../../../services/chargeService";
import { alertServerError } from "../../../../helpers/alertError";

export default function NouvelleChargePage() {
  const navigate = useNavigate();

  const handleSubmit = async (formData: any) => {
    try {
      const newCharge: BaseCharge = {
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

      await chargeService.create(newCharge);
      navigate(-1);
    } catch (error) {
      alertServerError(error);
    }
  };

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
          <h1 className="text-2xl font-bold text-gray-800">Nouvelle charge</h1>
          <p className="text-sm text-gray-500 mt-1">
            Enregistrer une dépense (salaire, facture, entretien...)
          </p>
        </div>
      </div>

      <ChargeForm
        onSubmit={handleSubmit}
        onCancel={() => navigate(-1)}
      />
    </div>
  );
}