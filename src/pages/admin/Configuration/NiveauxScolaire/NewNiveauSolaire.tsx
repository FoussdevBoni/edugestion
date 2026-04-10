// src/pages/admin/configuration/niveaux/NewNiveauScolairePage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle, PlusCircle, Layers } from "lucide-react";
import NiveauScolaireForm, { NiveauScolaireFormData } from "../../../../components/admin/forms/NiveauScolaireForm";
import { niveauScolaireService } from "../../../../services/niveauScolaireService";
import { BaseNiveauScolaire } from "../../../../utils/types/base";
import { cycleService } from "../../../../services/cycleService";
import { alertSuccess, alertError } from "../../../../helpers/alertError";

export default function NewNiveauScolairePage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (data: NiveauScolaireFormData) => {
    setIsSubmitting(true);
    try {
      const newNiveau: BaseNiveauScolaire = {
        nom: data.nom,
        ordre: data.ordre
      };

      const response = await niveauScolaireService.create(newNiveau);
      
      const cyclesToCreate = data.cycles.map(cycle => ({
        nom: cycle.nom,
        niveauScolaireId: response.id,
        ordre: response.ordre
      }));
      
      if (data.aDesCycles) {
        await cycleService.createMany(cyclesToCreate);
      } else if (cyclesToCreate.length > 0) {
        await cycleService.create(cyclesToCreate[0]);
      }

      setSaved(true);
      alertSuccess("Niveau scolaire créé avec succès");
      
      setTimeout(() => {
        navigate("/admin/configuration/niveaux-scolaire");
      }, 1500);
    } catch (error) {
      console.error("Erreur lors de la création:", error);
      alertError();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin/configuration/niveaux");
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Message de succès */}
      {saved && (
        <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl p-4 flex items-center gap-3 animate-fade-in">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <CheckCircle size={20} className="text-green-600" />
          <span className="text-green-700 font-medium">Niveau scolaire créé avec succès ! Redirection...</span>
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
          <h1 className="text-2xl font-bold text-gray-800">Nouveau niveau scolaire</h1>
          <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
            <PlusCircle size={14} />
            Créez un nouveau niveau scolaire pour l'établissement
          </p>
        </div>
      </div>

      {/* Informations utiles */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
        <div className="flex items-start gap-3">
          <div className="p-1 bg-white rounded-full shadow-sm">
            <Layers size={16} className="text-primary" />
          </div>
          <div className="text-sm text-gray-600">
            <p className="font-medium text-gray-700 mb-1">Informations</p>
            <p>
              Les niveaux scolaires sont les grandes catégories (Maternel, Primaire, Secondaire).
              Vous pourrez ensuite ajouter des cycles à l'intérieur de chaque niveau.
            </p>
          </div>
        </div>
      </div>

      {/* Formulaire avec animation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md animate-fade-in-up" style={{ animationDelay: '200ms' }}>
        <NiveauScolaireForm
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