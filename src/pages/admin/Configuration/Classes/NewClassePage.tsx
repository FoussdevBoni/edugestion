// src/pages/admin/parametres/scolarite/classes/NewClassePage.tsx
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { v4 as uuidv4 } from 'uuid';
import ClasseForm, { ClasseFormData } from "../../../../components/admin/forms/ClasseForm";

export default function NewClassePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const niveauPreselectionne = location.state?.niveauClasseId;
  const niveauNom = location.state?.niveauClasseNom;
  const cycle = location.state?.cycle;
  const niveauScolaire = location.state?.niveauScolaire;
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pré-remplir si un niveau de classe est passé en paramètre
  const initialData = niveauPreselectionne ? {
    niveauClasseId: niveauPreselectionne,
    niveauClasse: niveauNom || "",
    cycle: cycle || "",
    niveauScolaire: niveauScolaire || "",
    nom: ""
  } : undefined;

  const handleSubmit = async (data: ClasseFormData) => {
    setIsSubmitting(true);
    try {
      // Simulation d'appel API
      const newClasse = {
        id: uuidv4(),
        nom: data.nom,
        niveauClasseId: data.niveauClasseId,
        niveauClasse: data.niveauClasse,
        cycle: data.cycle,
        niveauScolaire: data.niveauScolaire,
        createdAt: new Date().toISOString()
      };
      
      console.log("Création d'une classe:", newClasse);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Rediriger vers la liste
      navigate("/admin/configuration/classes");
    } catch (error) {
      console.error("Erreur lors de la création:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin/configuration/classes");
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
          <h1 className="text-2xl font-bold text-gray-800">Nouvelle classe</h1>
          <p className="text-sm text-gray-500 mt-1">
            {niveauNom ? `Ajouter une classe au niveau ${niveauNom}` : "Créez une nouvelle classe"}
          </p>
        </div>
      </div>

      {/* Formulaire */}
      <div className="bg-white rounded-lg shadow-sm">
        <ClasseForm
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
          Les classes sont les divisions finales (ex: 6ème A, CM1 B, etc.). 
          Chaque classe est associée à un niveau de classe qui détermine son cycle et son niveau scolaire.
        </p>
      </div>
    </div>
  );
}