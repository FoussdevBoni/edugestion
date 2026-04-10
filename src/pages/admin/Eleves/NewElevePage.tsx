// src/pages/admin/eleves/NewElevePage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle, UserPlus } from "lucide-react";
import { useEcoleNiveau } from "../../../hooks/filters/useEcoleNiveau";
import EleveForm, { EleveFormData } from "../../../components/admin/forms/EleveForm";
import { inscriptionService } from "../../../services/inscriptionService";
import { alertServerError, alertSuccess } from "../../../helpers/alertError";

export default function NewElevePage() {
  const navigate = useNavigate();
  const { niveauSelectionne, cycleSelectionne } = useEcoleNiveau();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (data: EleveFormData) => {
    setIsSubmitting(true);
    try {
      const nouvelEleve = {
        nom: data.nom,
        prenom: data.prenom,
        dateNaissance: data.dateNaissance,
        sexe: data.sexe,
        lieuDeNaissance: data.lieuDeNaissance || "",
        contact: data.contact || "",
        photo: data.photo || "",
        anneeScolaire: data.anneeScolaire,
        statutScolaire: data.statutScolaire,
        classeId: data.classeId
      };

      console.log("Création d'un nouvel élève:", nouvelEleve);
      await inscriptionService.inscrireNouvelEleve(nouvelEleve);
      
      setSaved(true);
      alertSuccess("Élève inscrit avec succès");
      
      setTimeout(() => {
        navigate("/admin/eleves");
      }, 1500);
    } catch (error) {
      console.error("Erreur lors de la création:", error);
      alertServerError(error, "Erreur lors de l'inscription de l'élève");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin/eleves");
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Message de succès */}
      {saved && (
        <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl p-4 flex items-center gap-3 animate-fade-in">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <CheckCircle size={20} className="text-green-600" />
          <span className="text-green-700 font-medium">Élève inscrit avec succès ! Redirection...</span>
        </div>
      )}

      {/* En-tête avec animation */}
      <div className="flex items-center gap-4 animate-fade-in-up">
        <button
          onClick={() => navigate("/admin/eleves")}
          className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-300 group"
          title="Retour à la liste"
        >
          <ArrowLeft size={20} className="text-gray-600 group-hover:text-primary transition-colors" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Nouvel élève</h1>
          <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
            <UserPlus size={14} />
            Remplissez le formulaire pour inscrire un nouvel élève
          </p>
        </div>
      </div>

      {/* Indicateur des filtres actifs */}
      {(niveauSelectionne || cycleSelectionne) && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-4 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Filtres actifs :</span>{" "}
            {niveauSelectionne && <span className="text-primary font-medium">{niveauSelectionne}</span>}
            {niveauSelectionne && cycleSelectionne && " - "}
            {cycleSelectionne && <span className="text-primary font-medium">{cycleSelectionne}</span>}
            <span className="ml-2 text-gray-500">
              (La classe sera pré-filtrée en conséquence)
            </span>
          </p>
        </div>
      )}

      {/* Formulaire avec animation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md animate-fade-in-up" style={{ animationDelay: '200ms' }}>
        <EleveForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
        />
      </div>

      {/* Message d'aide */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
        <div className="flex items-start gap-3">
          <div className="p-1 bg-white rounded-full shadow-sm">
            <span className="text-primary text-sm font-bold block px-2">i</span>
          </div>
          <div className="text-sm text-gray-600">
            <p className="font-medium text-gray-700 mb-1">Informations</p>
            <p>
              Les champs marqués d'un astérisque (<span className="text-red-500 font-medium">*</span>) sont obligatoires.
              Un matricule unique sera automatiquement généré pour l'élève.
            </p>
          </div>
        </div>
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