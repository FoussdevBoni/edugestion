// src/pages/admin/configuration/niveaux/NewNiveauScolairePage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import NiveauScolaireForm, { NiveauScolaireFormData } from "../../../../components/admin/forms/NiveauScolaireForm";
import { v4 as uuidv4 } from 'uuid';

export default function NewNiveauScolairePage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: NiveauScolaireFormData) => {
    setIsSubmitting(true);
    try {
      // Simulation d'appel API
      const newNiveau = {
        id: uuidv4(),
        nom: data.nom,
        createdAt: new Date().toISOString()
      };
      
      console.log("Création d'un niveau scolaire:", newNiveau);
      
      // Ici, tu ferais l'appel API réel
      // await api.post('/niveaux-scolaires', data);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Rediriger vers la liste
      navigate("/admin/configuration/niveaux");
    } catch (error) {
      console.error("Erreur lors de la création:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin/configuration/niveaux");
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
          <h1 className="text-2xl font-bold text-gray-800">Nouveau niveau scolaire</h1>
          <p className="text-sm text-gray-500 mt-1">
            Créez un nouveau niveau scolaire pour l'établissement
          </p>
        </div>
      </div>

      {/* Formulaire */}
      <div className="bg-white rounded-lg shadow-sm">
        <NiveauScolaireForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
        />
      </div>

      {/* Aide */}
      <div className="text-sm text-gray-500 bg-gray-50 rounded-lg p-4">
        <p className="font-medium mb-1">📝 Information :</p>
        <p>
          Les niveaux scolaires sont les grandes catégories (Maternel, Primaire, Secondaire).
          Vous pourrez ensuite ajouter des cycles à l'intérieur de chaque niveau.
        </p>
      </div>
    </div>
  );
}