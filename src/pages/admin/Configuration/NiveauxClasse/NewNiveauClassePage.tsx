// src/pages/admin/configuration/niveaux-classe/NewNiveauClassePage.tsx
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { v4 as uuidv4 } from 'uuid';
import NiveauClasseForm, { NiveauClasseFormData } from "../../../../components/admin/forms/NiveauClasseForm";

export default function NewNiveauClassePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const cyclePreselectionne = location.state?.cycleId;
  const cycleNom = location.state?.cycleNom;
  const niveauScolaire = location.state?.niveauScolaire;
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pré-remplir si un cycle est passé en paramètre
  const initialData = cyclePreselectionne ? {
    cycleId: cyclePreselectionne,
    cycle: cycleNom || "",
    niveauScolaire: niveauScolaire || "",
    nom: ""
  } : undefined;

  const handleSubmit = async (data: NiveauClasseFormData) => {
    setIsSubmitting(true);
    try {
      // Simulation d'appel API
      const newNiveauClasse = {
        id: uuidv4(),
        nom: data.nom,
        cycleId: data.cycleId,
        cycle: data.cycle,
        niveauScolaire: data.niveauScolaire,
        createdAt: new Date().toISOString()
      };
      
      console.log("Création d'un niveau de classe:", newNiveauClasse);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Rediriger vers la liste
      navigate("/admin/configuration/niveaux-classe");
    } catch (error) {
      console.error("Erreur lors de la création:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin/configuration/niveaux-classe");
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/admin/configuration/niveaux-classe")}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Retour à la liste"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Nouveau niveau de classe</h1>
          <p className="text-sm text-gray-500 mt-1">
            {cycleNom ? `Ajouter un niveau au cycle ${cycleNom}` : "Créez un nouveau niveau de classe"}
          </p>
        </div>
      </div>

      {/* Formulaire */}
      <div className="bg-white rounded-lg shadow-sm">
        <NiveauClasseForm
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
          Les niveaux de classe sont des subdivisions des cycles (ex: 6ème, 5ème, CM1, etc.).
          Vous pourrez ensuite ajouter des classes (avec sections) à l'intérieur de chaque niveau.
        </p>
      </div>
    </div>
  );
}