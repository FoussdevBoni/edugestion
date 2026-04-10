import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Loader2, AlertCircle, CheckCircle, Edit } from "lucide-react";
import EvaluationForm, { EvaluationFormData } from "../../../../components/admin/forms/EvaluationForm";
import { evaluationService } from "../../../../services/evaluationService";
import { alertError, alertSuccess } from "../../../../helpers/alertError";

export default function UpdateEvaluationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const evaluationData = location.state;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [evaluation, setEvaluation] = useState<EvaluationFormData | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (evaluationData) {
      setEvaluation(evaluationData);
      setIsLoading(false);
    } else {
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
      });
      
      setSaved(true);
      alertSuccess("Évaluation modifiée avec succès");
      
      setTimeout(() => {
        navigate("/admin/configuration/evaluations");
      }, 1500);
    } catch (error) {
      alertError("Erreur lors de la mise à jour de l'évaluation");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] animate-fade-in-up">
        <Loader2 size={40} className="animate-spin text-primary mb-4" />
        <p className="text-gray-500 font-medium">Chargement de l'évaluation...</p>
      </div>
    );
  }

  if (!evaluation) {
    return (
      <div className="max-w-2xl mx-auto mt-10 animate-fade-in-up">
        <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-2xl p-10 text-center">
          <div className="w-16 h-16 bg-red-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={32} className="text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-red-800 mb-2">Évaluation introuvable</h2>
          <p className="text-red-600 mb-6">Les informations de cette évaluation ne sont plus disponibles.</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-white border border-red-200 text-red-600 rounded-xl font-medium hover:bg-red-50 transition-all duration-300"
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Message de succès */}
      {saved && (
        <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl p-4 flex items-center gap-3 animate-fade-in">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <CheckCircle size={20} className="text-green-600" />
          <span className="text-green-700 font-medium">Évaluation modifiée avec succès ! Redirection...</span>
        </div>
      )}

      {/* En-tête avec animation */}
      <div className="flex items-center gap-4 animate-fade-in-up">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-300 group"
          disabled={isSubmitting}
        >
          <ArrowLeft size={20} className="text-gray-600 group-hover:text-primary transition-colors" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Modifier l'évaluation</h1>
          <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
            <Edit size={14} />
            {evaluation.nom}
          </p>
        </div>
      </div>

      {/* Formulaire avec animation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md animate-fade-in-up" style={{ animationDelay: '100ms' }}>
        <EvaluationForm 
          initialData={evaluation} 
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