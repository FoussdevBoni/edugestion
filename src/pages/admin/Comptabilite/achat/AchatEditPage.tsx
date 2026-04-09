// src/pages/admin/comptabilite/achats/UpdateAchatPage.tsx
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import AchatForm from "../../../../components/admin/forms/AchatForm";
import useAchats from "../../../../hooks/achats/useAchats";
import { alertServerError } from "../../../../helpers/alertError";

export default function UpdateAchatPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { updateAchat } = useAchats();

  const location = useLocation();
  const achat = location.state;
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
      navigate(-1);
    } catch (error) {
      alertServerError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Modifier l'achat</h1>
          <p className="text-sm text-gray-500">Modifier les informations de l'achat</p>
        </div>
      </div>

      <AchatForm
        initialData={initialData}
        onSubmit={handleSubmit}
        onCancel={() => navigate(-1)}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}