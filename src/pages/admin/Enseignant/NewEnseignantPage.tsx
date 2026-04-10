import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle, UserPlus } from "lucide-react";
import EnseignantForm, { EnseignantFormData } from "../../../components/admin/forms/EnseignantForm";
import { enseignantService } from "../../../services/enseignantService";
import { BaseEnseignant } from "../../../utils/types/base";
import { alertServerError, alertSuccess } from "../../../helpers/alertError";

export default function NewEnseignantPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (data: EnseignantFormData) => {
    setIsSubmitting(true);
    try {
      const newEnseignant: BaseEnseignant = {
        nom: data.nom,
        prenom: data.prenom,
        email: data.email || "",
        tel: data.tel || "",
        enseignements: data.enseignements
      };
      await enseignantService.create(newEnseignant);
      
      setSaved(true);
      alertSuccess("Enseignant ajouté avec succès");
      
      setTimeout(() => {
        navigate("/admin/enseignants");
      }, 1500);
    } catch (error) {
      console.error("Erreur lors de la création:", error);
      alertServerError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin/enseignants");
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Message de succès */}
      {saved && (
        <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl p-4 flex items-center gap-3 animate-fade-in">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <CheckCircle size={20} className="text-green-600" />
          <span className="text-green-700 font-medium">Enseignant ajouté avec succès ! Redirection...</span>
        </div>
      )}

      {/* En-tête avec animation */}
      <div className="flex items-center gap-4 animate-fade-in-up">
        <button
          onClick={() => navigate("/admin/enseignants")}
          className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-300 group"
          title="Retour à la liste"
        >
          <ArrowLeft size={20} className="text-gray-600 group-hover:text-primary transition-colors" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Nouvel enseignant</h1>
          <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
            <UserPlus size={14} />
            Remplissez le formulaire pour ajouter un nouvel enseignant
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
              Les champs marqués d'un astérisque (<span className="text-red-500 font-medium">*</span>) sont obligatoires.
              Vous pouvez sélectionner plusieurs matières et plusieurs classes.
            </p>
          </div>
        </div>
      </div>

      {/* Formulaire avec animation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md animate-fade-in-up" style={{ animationDelay: '200ms' }}>
        <EnseignantForm
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