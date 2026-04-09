// src/pages/admin/configuration/niveaux-classe/NewNiveauClassePage.tsx
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import NiveauClasseForm, { NiveauClasseFormData } from "../../../../components/admin/forms/NiveauClasseForm";
import { niveauClasseService } from "../../../../services/niveauClasseService";
import { classeService } from "../../../../services/classeService";
import { alertError } from "../../../../helpers/alertError";

export default function NewNiveauClassePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const cyclePreselectionne = location.state?.cycleId;
  const cycleNom = location.state?.cycleNom;
  const niveauScolaire = location.state?.niveauScolaire;

  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialData = cyclePreselectionne ? {
    cycleId: cyclePreselectionne,
    cycle: cycleNom || "",
    niveauScolaire: niveauScolaire || "",
    nom: ""
  } : undefined;

  const handleSubmit = async (dataArray: NiveauClasseFormData[]) => {
    setIsSubmitting(true);
    try {
      for (const data of dataArray) {
        // 1. Créer le Niveau de classe
        const newNiveau = {
          nom: data.nom,
          cycleId: data.cycleId,
        };

        const createdNiveau = await niveauClasseService.create(newNiveau);

        // 2. Créer les classes automatiquement si demandé
        if (data.autoCreateClass) {
          if (data.hasMultipleDivisions && data.divisions && data.divisions.length > 0) {
            // Créer plusieurs classes pour les divisions (A, B, C...)
            for (const division of data.divisions) {
              const classe = {
                nom: `${createdNiveau.nom} ${division}`,
                niveauClasseId: createdNiveau.id,
                effectifF: 0,
                effectifM: 0
              };
              await classeService.create(classe);
            }
          } else {
            // Créer une seule classe avec le même nom
            const classe = {
              nom: createdNiveau.nom,
              niveauClasseId: createdNiveau.id,
              effectifF: 0,
              effectifM: 0
            };
            await classeService.create(classe);
          }
        }
      }

      navigate("/admin/configuration/niveaux-classe");
    } catch (error) {
      console.error("Erreur lors de la création:", error);
      alertError();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin/configuration/niveaux-classe");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/admin/configuration/niveaux-classe")}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
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

      <div className="bg-white rounded-lg shadow-sm">
        <NiveauClasseForm
          initialData={initialData}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
        />
      </div>

      <div className="text-sm text-gray-500 bg-gray-50 rounded-lg p-4">
        <p className="font-medium mb-1">📝 Information :</p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li><strong>Mode Unique</strong> : Crée un seul niveau</li>
          <li><strong>Mode Multiple (6ème, 5ème...)</strong> : Crée plusieurs niveaux différents</li>
          <li><strong>Plusieurs divisions</strong> : Pour un niveau qui a plusieurs classes (A, B, C...)</li>
          <li>Les classes sont automatiquement créées selon vos choix</li>
        </ul>
      </div>
    </div>
  );
}