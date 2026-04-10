import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle, PlusCircle, Calendar } from "lucide-react";
import PeriodeForm, { PeriodeFormData } from "../../../../components/admin/forms/PeriodeForm";
import { periodeService } from "../../../../services/periodeService";
import { alertError, alertSuccess } from "../../../../helpers/alertError";

export default function NewPeriodePage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (dataArray: PeriodeFormData[]) => {
    setIsSubmitting(true);
    try {
      const promises = dataArray.map(item => periodeService.create({
        nom: item.nom,
        niveauScolaireId: item.niveauScolaireId,
        ordre: item.ordre || 1,
        coefficient: item.coefficient
      }));
      
      await Promise.all(promises);
      setSaved(true);
      alertSuccess(`${dataArray.length} période(s) créée(s) avec succès`);
      
      setTimeout(() => {
        navigate("/admin/configuration/periodes");
      }, 1500);
    } catch (error) {
      alertError();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => navigate("/admin/configuration/periodes");

  return (
    <div className="space-y-6 pb-8">
      {/* Message de succès */}
      {saved && (
        <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl p-4 flex items-center gap-3 animate-fade-in">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <CheckCircle size={20} className="text-green-600" />
          <span className="text-green-700 font-medium">Période(s) créée(s) avec succès ! Redirection...</span>
        </div>
      )}

      {/* En-tête avec animation */}
      <div className="flex items-center gap-4 animate-fade-in-up">
        <button 
          onClick={handleCancel} 
          className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-300 group"
        >
          <ArrowLeft size={20} className="text-gray-600 group-hover:text-primary transition-colors" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Nouvelle période</h1>
          <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
            <PlusCircle size={14} />
            Créez une ou plusieurs périodes pour les évaluations
          </p>
        </div>
      </div>

      {/* Informations utiles */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
        <div className="flex items-start gap-3">
          <div className="p-1 bg-white rounded-full shadow-sm">
            <Calendar size={16} className="text-primary" />
          </div>
          <div className="text-sm text-gray-600">
            <p className="font-medium text-gray-700 mb-1">Informations</p>
            <p>
              Les périodes représentent les divisions de l'année scolaire (Trimestres, Semestres).
              Chaque période a un coefficient qui détermine son poids dans le calcul des moyennes annuelles.
            </p>
          </div>
        </div>
      </div>

      {/* Formulaire avec animation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md animate-fade-in-up" style={{ animationDelay: '200ms' }}>
        <PeriodeForm 
          onSubmit={handleSubmit} 
          onCancel={handleCancel} 
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