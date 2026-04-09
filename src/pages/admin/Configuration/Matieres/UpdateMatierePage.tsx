// src/pages/admin/configuration/matieres/UpdateMatierePage.tsx
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import MatiereForm, { MatiereFormData } from "../../../../components/admin/forms/MatiereForm";
import { matiereService } from "../../../../services/matiereService";
import { alertError } from "../../../../helpers/alertError";


interface PagesProps {
  config?: boolean
}


export default function UpdateMatierePage({}: PagesProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const matiereData = location.state;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [matiere, setMatiere] = useState<MatiereFormData | null>(null);

  useEffect(() => {
    const fetchMatiere = async () => {
      setIsLoading(true);
      try {
        if (matiereData) {
          setMatiere({
            id: matiereData.id,
            nom: matiereData.nom,
            coefficient: matiereData.coefficient,
            niveauClasseId: matiereData.niveauClasseId,
            niveauClasse: matiereData.niveauClasse
          });
        }
      } catch (error) {
        console.error("Erreur lors du chargement:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMatiere();
  }, [matiereData]);

  // LA CORRECTION EST ICI : data est maintenant MatiereFormData[]
  const handleSubmit = async (dataArray: MatiereFormData[]) => {
    // Comme c'est un update, on sait qu'il n'y a qu'un seul élément dans le tableau
    const data = dataArray[0];

    if (!data || !data.id) {
      alertError();
      return;
    }
    
    setIsSubmitting(true);
    try {
      await matiereService.update(data.id, data);
      navigate(-1);
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      alertError();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  // ... (garder le reste du code de rendu identique)
  
  if (isLoading) return <div>Chargement...</div>; // Simplifié pour l'exemple
  
  if (!matiere) return <div>Matière introuvable</div>;

  return (
    <div className="space-y-6">
      {/* En-tête ... */}
      <div className="bg-white rounded-lg shadow-sm">
        <MatiereForm
          initialData={matiere}
          onSubmit={handleSubmit} // TypeScript sera content maintenant
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}