// src/pages/admin/configuration/matieres/NewMatierePage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { v4 as uuidv4 } from 'uuid';
import MatiereForm, { MatiereFormData } from "../../../../components/admin/forms/MatiereForm";

export default function NewMatierePage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: MatiereFormData) => {
    setIsSubmitting(true);
    try {
      // Simulation d'appel API
      const newMatiere = {
        id: uuidv4(),
        nom: data.nom,
        coefficient: data.coefficient,
        niveauClasseId: data.niveauClasseId,
        niveauClasse: data.niveauClasse,
        createdAt: new Date().toISOString()
      };
      
      console.log("Création d'une matière:", newMatiere);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Rediriger vers la liste
      navigate("/admin/configuration/matieres");
    } catch (error) {
      console.error("Erreur lors de la création:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin/configuration/matieres");
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/admin/configuration/matieres")}
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