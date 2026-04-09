// src/pages/admin/paiements/UpdatePaiementPage.tsx
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import PaiementForm, { PaiementFormData } from "../../../components/admin/forms/PaiementForm";
import { alertServerError } from "../../../helpers/alertError";
import usePaiements from "../../../hooks/paiements/usePaiements";

export default function UpdatePaiementPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const paiement = location.state;

  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {  updatePaiement } = usePaiements();



  const handleSubmit = async (data: PaiementFormData) => {
    setIsSubmitting(true);
    try {
      await updatePaiement(paiement.id, {
        montantPaye: data.montantPaye,
        statut: data.statut,
        modePaiement: data.modePaiement,
        datePayement: data.datePayement,
        montantRestant: data.montantRestant, // À ajuster selon votre logique
        motif: data.motif
      });
      navigate("/admin/paiements");
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
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 size={40} className="animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-500">Chargement des informations...</p>
        </div>
      </div>
    );
  }

  if (!paiement) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/admin/paiements")}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Modifier le paiement</h1>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
          <AlertCircle size={48} className="text-red-400 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-red-700 mb-2">
            Paiement introuvable
          </h2>
          <button
            onClick={() => navigate("/admin/paiements")}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            Retour à la liste
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/admin/paiements")}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Modifier le paiement</h1>
          <p className="text-sm text-gray-500 mt-1">
            Référence #{paiement.id?.slice(-6)}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
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
    </div>
  );
}