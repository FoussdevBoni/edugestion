// src/pages/admin/configuration/matieres/UpdateMatierePage.tsx
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import MatiereForm, { MatiereFormData } from "../../../../components/admin/forms/MatiereForm";
import { matieres } from "../../../../data/matieres";


export default function UpdateMatierePage() {
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
        await new Promise(resolve => setTimeout(resolve, 500));
        
        if (matiereData) {
          setMatiere({
            id: matiereData.id,
            nom: matiereData.nom,
            coefficient: matiereData.coefficient,
            niveauClasseId: matiereData.niveauClasseId,
            niveauClasse: matiereData.niveauClasse
          });
        } else {
          // Fallback: prendre la première matière pour l'exemple
          setMatiere({
            id: matieres[0].id,
            nom: matieres[0].nom,
            coefficient: matieres[0].coefficient,
            niveauClasseId: matieres[0].niveauClasseId,
            niveauClasse: matieres[0].niveauClasse
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

  const handleSubmit = async (data: MatiereFormData) => {
    setIsSubmitting(true);
    try {
      console.log("Mise à jour de la matière:", data);
      await new Promise(resolve => setTimeout(resolve, 1000));
      navigate("/admin/configuration/matieres");
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin/configuration/matieres");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 size={40} className="animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-500">Chargement des informations...</p>
        </div>
      </div>
    );
  }

  if (!matiere) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/admin/configuration/matieres")}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Modifier la matière</h1>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
          <AlertCircle size={48} className="text-red-400 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-red-700 mb-2">
            Matière introuvable
          </h2>
          <button
            onClick={() => navigate("/admin/configuration/matieres")}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            Retour à la liste
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/admin/configuration/matieres")}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Modifier la matière</h1>
          <p className="text-sm text-gray-500 mt-1">
            {matiere.nom} - Coef. {matiere.coefficient}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <MatiereForm
          initialData={matiere}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}