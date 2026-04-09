// src/pages/admin/comptabilite/paiements/NewPaiementPage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import PaiementForm, { PaiementFormData } from "../../../components/admin/forms/PaiementForm";
import { paiementService } from "../../../services/paiementService";
import { alertServerError } from "../../../helpers/alertError";
import { BasePaiement } from "../../../utils/types/base";

export default function NewPaiementPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData: PaiementFormData) => {
    setIsSubmitting(true);
    try {
      // Créer un paiement pour chaque élève sélectionné
      const promises = formData.inscriptions?.map(async (inscriptionId) => {
        const paiement: BasePaiement = {
          inscriptionId,
          montantPaye: formData.montantPaye,
          statut: formData.statut,
          montantRestant: formData.montantRestant, // À ajuster selon votre logique
          modePaiement: formData.modePaiement,
          datePayement: formData.datePayement,
          motif: formData.motif
        };
        
        return await paiementService.create(paiement);
      });

      await Promise.all(promises);
      navigate(-1);
    } catch (error) {
      alertServerError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Nouveaux paiements</h1>
          <p className="text-sm text-gray-500 mt-1">
            Enregistrer des paiements pour une classe
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <PaiementForm
          onSubmit={handleSubmit}
          onCancel={() => navigate(-1)}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}