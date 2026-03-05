// src/pages/admin/configuration/periodes/NewPeriodePage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { v4 as uuidv4 } from 'uuid';
import PeriodeForm, { PeriodeFormData } from "../../../../components/admin/forms/PeriodeForm";

export default function NewPeriodePage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: PeriodeFormData) => {
    setIsSubmitting(true);
    try {
      // Simulation d'appel API
      const newPeriode = {
        id: uuidv4(),
        nom: data.nom,
        niveauScolaireId: data.niveauScolaireId,
        niveauScolaire: data.niveauScolaire,
        createdAt: new Date().toISOString()
      };
      
      console.log("Création d'une période:", newPeriode);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Rediriger vers la liste
      navigate("/admin/configuration/periodes");
    } catch (error) {
      console.error("Erreur lors de la création:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin/configuration/periodes");
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/admin/configuration/periodes")}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Retour à la liste"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Nouvelle période</h1>
          <p className="text-sm text-gray-500 mt-1">
            Créez une nouvelle période pour les évaluations
          </p>
        </div>
      </div>

      {/* Formulaire */}
      <div className="bg-white rounded-lg shadow-sm">
        <PeriodeForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
        />
      </div>

      {/* Aide */}
      <div className="text-sm text-gray-500 bg-gray-50 rounded-lg p-4">
        <p className="font-medium mb-1">📝 Information :</p>
        <p>
          Les périodes sont des subdivisions de l'année scolaire (Trimestres, Semestres).
          Chaque période est associée à un niveau scolaire et peut contenir plusieurs évaluations.
        </p>
      </div>
    </div>
  );
}