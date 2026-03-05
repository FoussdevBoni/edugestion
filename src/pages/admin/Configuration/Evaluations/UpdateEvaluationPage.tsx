// src/pages/admin/configuration/evaluations/UpdateEvaluationPage.tsx
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import EvaluationForm, { EvaluationFormData } from "../../../../components/admin/forms/EvaluationFom";
import { evaluations } from "../../../../data/evaluations";

export default function UpdateEvaluationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const evaluationData = location.state;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [evaluation, setEvaluation] = useState<EvaluationFormData | null>(null);

  useEffect(() => {
    const fetchEvaluation = async () => {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        if (evaluationData) {
          setEvaluation({
            id: evaluationData.id,
            nom: evaluationData.nom,
            periodeId: evaluationData.periodeId,
            periode: evaluationData.periode,
            niveauScolaireId: evaluationData.niveauScolaireId,
            niveauScolaire: evaluationData.niveauScolaire
          });
        } else {
          // Fallback: prendre la première évaluation pour l'exemple
          setEvaluation({
            id: evaluations[0].id,
            nom: evaluations[0].nom,
            periodeId: evaluations[0].periodeId || "",
            periode: evaluations[0].periode,
            niveauScolaireId: evaluations[0].niveauScolaireId || "",
            niveauScolaire: evaluations[0].niveauScolaire
          });
        }
      } catch (error) {
        console.error("Erreur lors du chargement:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvaluation();
  }, [evaluationData]);

  const handleSubmit = async (data: EvaluationFormData) => {
    setIsSubmitting(true);
    try {
      console.log("Mise à jour de l'évaluation:", data);
      await new Promise(resolve => setTimeout(resolve, 1000));
      navigate("/admin/configuration/evaluations");
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin/configuration/evaluations");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 size={40} className="animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-500">Chargement des informations...</p>
        </div>
      </div>
    );
  }

  if (!evaluation) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/admin/configuration/evaluations")}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Modifier l'évaluation</h1>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
          <AlertCircle size={48} className="text-red-400 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-red-700 mb-2">
            Évaluation introuvable
          </h2>
          <button
            onClick={() => navigate("/admin/configuration/evaluations")}
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
          onClick={() => navigate("/admin/configuration/evaluations")}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Modifier l'évaluation</h1>
          <p className="text-sm text-gray-500 mt-1">
            {evaluation.nom} - {evaluation.periode}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <EvaluationForm
          initialData={evaluation}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}