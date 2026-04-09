import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import EvaluationForm, { EvaluationFormData } from "../../../../components/admin/forms/EvaluationForm";
import { evaluationService } from "../../../../services/evaluationService";
import { alertError } from "../../../../helpers/alertError";

export default function NewEvaluationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialData = location.state?.periodeId ? {
    periodeId: location.state.periodeId,
    periode: location.state.periodeNom || "",
    niveauScolaireId: location.state.niveauScolaireId || "",
    niveauScolaire: location.state.niveauScolaire || "",
    nom: "",
    abreviation: "",
    type: "devoir" as const,
    coefficient: 0.5,
  } : undefined;

  const handleSubmit = async (dataArray: EvaluationFormData[]) => {
    setIsSubmitting(true);
    try {
      const promises = dataArray.map(item => evaluationService.create({
        nom: item.nom,
        periodeId: item.periodeId,
        niveauScolaireId: item.niveauScolaireId,
        coefficient: item.coefficient,
        abreviation: item.abreviation || item.nom.substring(0, 3).toUpperCase(),
        type: item.type
      }));
      
      await Promise.all(promises);
      
      // ✅ Pas besoin d'alertSuccess, on navigue simplement
      navigate(-1);
      
    } catch (error) {
      alertError("Erreur lors de la création des évaluations");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          disabled={isSubmitting}
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Nouvelle évaluation</h1>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <EvaluationForm 
          initialData={initialData} 
          onSubmit={handleSubmit} 
          onCancel={() => navigate(-1)} 
          isSubmitting={isSubmitting} 
        />
      </div>
    </div>
  );
}