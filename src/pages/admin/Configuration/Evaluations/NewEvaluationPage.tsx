import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, CheckCircle, PlusCircle } from "lucide-react";
import EvaluationForm, { EvaluationFormData } from "../../../../components/admin/forms/EvaluationForm";
import { evaluationService } from "../../../../services/evaluationService";
import { alertError, alertSuccess } from "../../../../helpers/alertError";

export default function NewEvaluationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);

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
        abreviation: item.abreviation || item.nom.substring(0, 3).toUpperCase(),
        type: item.type
      }));
      
      await Promise.all(promises);
      setSaved(true);
      alertSuccess(`${dataArray.length} évaluation(s) créée(s) avec succès`);
      
      setTimeout(() => {
        navigate(-1);
      }, 1500);
    } catch (error) {
      alertError("Erreur lors de la création des évaluations");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Message de succès */}
      {saved && (
        <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl p-4 flex items-center gap-3 animate-fade-in">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <CheckCircle size={20} className="text-green-600" />
          <span className="text-green-700 font-medium">Évaluation(s) créée(s) avec succès ! Redirection...</span>
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
          <h1 className="text-2xl font-bold text-gray-800">Nouvelle évaluation</h1>
          <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
            <PlusCircle size={14} />
            Créez une ou plusieurs évaluations
          </p>
        </div>
      </div>

      {/* Informations utiles */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
        <div className="flex items-start gap-3">
          <div className="p-1 bg-white rounded-full shadow-sm">
            <span className="text-primary text-sm font-bold block px-2">i</span>
          </div>
          <div className="text-sm text-gray-600">
            <p className="font-medium text-gray-700 mb-1">Informations</p>
            <p>
              Une évaluation représente un type de contrôle (Devoir, Composition, Interrogation, etc.).
              Vous pouvez créer plusieurs évaluations à la fois en remplissant le formulaire.
            </p>
          </div>
        </div>
      </div>

      {/* Formulaire avec animation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md animate-fade-in-up" style={{ animationDelay: '200ms' }}>
        <EvaluationForm 
          initialData={initialData} 
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