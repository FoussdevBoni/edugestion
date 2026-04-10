// src/pages/admin/configuration/matieres/NewMatierePage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle, PlusCircle } from "lucide-react";
import MatiereForm, { MatiereFormData } from "../../../../components/admin/forms/MatiereForm";
import { matiereService } from "../../../../services/matiereService";
import { BaseMatiere } from "../../../../utils/types/base";
import { alertSuccess, alertError } from "../../../../helpers/alertError";

interface PagesProps {
  config?: boolean
}

export default function NewMatierePage({}: PagesProps) {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (dataArray: MatiereFormData[]) => {
    setIsSubmitting(true);
    try {
      const promises = dataArray.map(item => {
        const newMatiere: BaseMatiere = {
          nom: item.nom,
          coefficient: item.coefficient,
          niveauClasseId: item.niveauClasseId,
        };
        return matiereService.create(newMatiere);
      });

      await Promise.all(promises);
      setSaved(true);
      alertSuccess(`${dataArray.length} matière(s) créée(s) avec succès`);
      
      setTimeout(() => {
        navigate(-1);
      }, 1500);
    } catch (error) {
      console.error("Erreur création matières:", error);
      alertError("Erreur lors de la création des matières");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Message de succès */}
      {saved && (
        <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl p-4 flex items-center gap-3 animate-fade-in">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <CheckCircle size={20} className="text-green-600" />
          <span className="text-green-700 font-medium">Matière(s) créée(s) avec succès ! Redirection...</span>
        </div>
      )}

      {/* En-tête avec animation */}
      <div className="flex items-center gap-4 animate-fade-in-up">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-300 group"
          title="Retour à la liste"
        >
          <ArrowLeft size={20} className="text-gray-600 group-hover:text-primary transition-colors" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Nouvelle matière</h1>
          <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
            <PlusCircle size={14} />
            Créez une nouvelle matière pour un niveau de classe
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
              Les matières sont associées à un niveau de classe spécifique (CI, CP, 6ème, etc.).
              Chaque matière a un coefficient qui détermine son poids dans le calcul des moyennes.
            </p>
          </div>
        </div>
      </div>

      {/* Formulaire avec animation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md animate-fade-in-up" style={{ animationDelay: '200ms' }}>
        <MatiereForm
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