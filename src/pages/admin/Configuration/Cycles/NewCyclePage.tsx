// src/pages/admin/configuration/cycles/NewCyclePage.tsx
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, CheckCircle, PlusCircle } from "lucide-react";
import CycleForm, { CycleFormData } from "../../../../components/admin/forms/CycleForm";
import { BaseCycle } from "../../../../utils/types/base";
import { cycleService } from "../../../../services/cycleService";
import { alertSuccess, alertError } from "../../../../helpers/alertError";

export default function NewCyclePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const niveauPreselectionne = location.state?.niveauId;
  const niveauNom = location.state?.niveauNom;
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);

  const initialData = niveauPreselectionne ? {
    niveauScolaireId: niveauPreselectionne,
    niveauScolaire: niveauNom || "",
    nom: "",
    ordre: niveauPreselectionne?.ordre || 1
  } : undefined;

  const handleSubmit = async (data: CycleFormData) => {
    setIsSubmitting(true);
    try {
      const newCycle: BaseCycle = {
        nom: data.nom,
        niveauScolaireId: data.niveauScolaireId,
        ordre: data.ordre
      };
      
      await cycleService.create(newCycle);
      setSaved(true);
      alertSuccess("Cycle créé avec succès");
      
      setTimeout(() => {
        navigate("/admin/configuration/cycles");
      }, 1500);
    } catch (error) {
      console.error("Erreur lors de la création:", error);
      alertError();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin/configuration/cycles");
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Message de succès */}
      {saved && (
        <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl p-4 flex items-center gap-3 animate-fade-in">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <CheckCircle size={20} className="text-green-600" />
          <span className="text-green-700 font-medium">Cycle créé avec succès ! Redirection...</span>
        </div>
      )}

      {/* En-tête avec animation */}
      <div className="flex items-center gap-4 animate-fade-in-up">
        <button
          onClick={() => navigate("/admin/configuration/cycles")}
          className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-300 group"
          title="Retour à la liste"
        >
          <ArrowLeft size={20} className="text-gray-600 group-hover:text-primary transition-colors" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Nouveau cycle</h1>
          <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
            <PlusCircle size={14} />
            {niveauNom ? `Ajouter un cycle au niveau ${niveauNom}` : "Créez un nouveau cycle pour l'établissement"}
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
              Les cycles sont des subdivisions des niveaux scolaires (ex: Maternelle, 1er cycle, 2ème cycle).
              Vous pourrez ensuite ajouter des niveaux de classe à l'intérieur de chaque cycle.
            </p>
          </div>
        </div>
      </div>

      {/* Formulaire avec animation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md animate-fade-in-up" style={{ animationDelay: '200ms' }}>
        <CycleForm
          initialData={initialData}
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