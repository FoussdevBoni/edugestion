// src/pages/admin/configuration/matieres/NewMatierePage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import MatiereForm, { MatiereFormData } from "../../../../components/admin/forms/MatiereForm";
import { matiereService } from "../../../../services/matiereService";
import { BaseMatiere } from "../../../../utils/types/base";


interface PagesProps {
  config?: boolean
}


export default function NewMatierePage({}: PagesProps) {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    navigate(-1);
  } catch (error) {
    console.error("Erreur création matières:", error);
  } finally {
    setIsSubmitting(false);
  }
};

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Retour à la liste"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Nouvelle matière</h1>
          <p className="text-sm text-gray-500 mt-1">
            Créez une nouvelle matière pour un niveau de classe
          </p>
        </div>
      </div>

      {/* Formulaire */}
      <div className="bg-white rounded-lg shadow-sm">
        <MatiereForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
        />
      </div>

      {/* Aide */}
      <div className="text-sm text-gray-500 bg-gray-50 rounded-lg p-4">
        <p className="font-medium mb-1">📝 Information :</p>
        <p>
          Les matières sont associées à un niveau de classe spécifique (CI, CP, 6ème, etc.).
          Chaque matière a un coefficient qui détermine son poids dans le calcul des moyennes.
        </p>
      </div>
    </div>
  );
}