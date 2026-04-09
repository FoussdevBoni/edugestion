import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import EvaluationForm, { EvaluationFormData } from "../../../../components/admin/forms/EvaluationForm";
import { evaluationService } from "../../../../services/evaluationService";
import { alertError } from "../../../../helpers/alertError";

export default function UpdateEvaluationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const evaluationData = location.state;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [evaluation, setEvaluation] = useState<EvaluationFormData | null>(null);

  useEffect(() => {
    if (evaluationData) {
      setEvaluation(evaluationData);
      setIsLoading(false);
    } else {
      // Logique de secours si besoin
      setIsLoading(false);
    }
  }, [evaluationData]);

  const handleSubmit = async (dataArray: EvaluationFormData[]) => {
    const data = dataArray[0];
    if (!data?.id) return;

    setIsSubmitting(true);
    try {
      await evaluationService.update(data.id, {
        nom: data.nom,
        abreviation: data.abreviation,
        periodeId: data.periodeId,
        niveauScolaireId: data.niveauScolaireId,
        type: data.type,
        coefficient: data.coefficient
      });
      
      // ✅ Navigation directe sans message de succès
      navigate("/admin/configuration/evaluations");
    } catch (error) {
      alertError("Erreur lors de la mise à jour de l'évaluation");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-20">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  if (!evaluation) {
    return (
      <div className="text-center p-20 text-red-500">
        <AlertCircle className="mx-auto mb-2" size={40} />
        <p>Évaluation introuvable</p>
      </div>
    );
  }

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
        <h1 className="text-2xl font-bold text-gray-800">Modifier l'évaluation</h1>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <EvaluationForm 
          initialData={evaluation} 
          onSubmit={handleSubmit} 
          onCancel={() => navigate(-1)} 
          isSubmitting={isSubmitting} 
        />
      </div>
    </div>
  );
}