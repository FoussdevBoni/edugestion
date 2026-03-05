// src/pages/admin/configuration/evaluations/NewEvaluationPage.tsx
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { v4 as uuidv4 } from 'uuid';
import EvaluationForm, { EvaluationFormData } from "../../../../components/admin/forms/EvaluationFom";

export default function NewEvaluationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const periodePreselectionnee = location.state?.periodeId;
  const periodeNom = location.state?.periodeNom;
  const niveauScolaireId = location.state?.niveauScolaireId;
  const niveauScolaire = location.state?.niveauScolaire;
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pré-remplir si une période est passée en paramètre
  const initialData = periodePreselectionnee ? {
    periodeId: periodePreselectionnee,
    periode: periodeNom || "",
    niveauScolaireId: niveauScolaireId || "",
    niveauScolaire: niveauScolaire || "",
    nom: ""
  } : undefined;

  const handleSubmit = async (data: EvaluationFormData) => {
    setIsSubmitting(true);
    try {
      // Simulation d'appel API
      const newEvaluation = {
        id: uuidv4(),
        nom: data.nom,
        periodeId: data.periodeId,
        periode: data.periode,
        niveauScolaireId: data.niveauScolaireId,
        niveauScolaire: data.niveauScolaire,
        createdAt: new Date().toISOString()
      };
      
      console.log("Création d'une évaluation:", newEvaluation);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Rediriger vers la liste
      navigate("/admin/configuration/evaluations");
    } catch (error) {
      console.error("Erreur lors de la création:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin/configuration/evaluations");
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/admin/configuration/evaluations")}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Retour à la liste"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Nouvelle évaluation</h1>
          <p className="text-sm text-gray-500 mt-1">
            {periodeNom ? `Ajouter une évaluation à la période ${periodeNom}` : "Créez une nouvelle évaluation"}
          </p>
        </div>
      </div>

      {/* Formulaire */}
      <div className="bg-white rounded-lg shadow-sm">
        <EvaluationForm
          initialData={initialData}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
        />
      </div>

      {/* Aide */}
      <div className="text-sm text-gray-500 bg-gray-50 rounded-lg p-4">
        <p className="font-medium mb-1">📝 Information :</p>
        <p>
          Les évaluations sont liées à une période spécifique (Trimestre, Semestre).
          Chaque évaluation appartient automatiquement au niveau scolaire de sa période.
        </p>
      </div>
    </div>
  );
}