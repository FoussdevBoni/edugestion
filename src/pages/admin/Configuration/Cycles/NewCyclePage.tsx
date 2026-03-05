// src/pages/admin/configuration/cycles/NewCyclePage.tsx
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import CycleForm, { CycleFormData } from "../../../../components/admin/forms/CycleForm";
import { v4 as uuidv4 } from 'uuid';

export default function NewCyclePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const niveauPreselectionne = location.state?.niveauId;
  const niveauNom = location.state?.niveauNom;
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pré-remplir si un niveau est passé en paramètre
  const initialData = niveauPreselectionne ? {
    niveauScolaireId: niveauPreselectionne,
    niveauScolaire: niveauNom || "",
    nom: ""
  } : undefined;

  const handleSubmit = async (data: CycleFormData) => {
    setIsSubmitting(true);
    try {
      // Simulation d'appel API
      const newCycle = {
        id: uuidv4(),
        nom: data.nom,
        niveauScolaireId: data.niveauScolaireId,
        niveauScolaire: data.niveauScolaire,
        createdAt: new Date().toISOString()
      };
      
      console.log("Création d'un cycle:", newCycle);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Rediriger vers la liste des cycles
      navigate("/admin/configuration/cycles");
    } catch (error) {
      console.error("Erreur lors de la création:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin/configuration/cycles");
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/admin/configuration/cycles")}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Retour à la liste"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Nouveau cycle</h1>
          <p className="text-sm text-gray-500 mt-1">
            {niveauNom ? `Ajouter un cycle au niveau ${niveauNom}` : "Créez un nouveau cycle pour l'établissement"}
          </p>
        </div>
      </div>

      {/* Formulaire */}
      <div className="bg-white rounded-lg shadow-sm">
        <CycleForm
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
          Les cycles sont des subdivisions des niveaux scolaires (ex: Maternelle, 1er cycle, 2ème cycle).
          Vous pourrez ensuite ajouter des niveaux de classe à l'intérieur de chaque cycle.
        </p>
      </div>
    </div>
  );
}