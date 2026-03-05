import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, AlertCircle } from "lucide-react";
import EnseignantForm, { EnseignantFormData } from "../../../components/admin/forms/EnseignantForm";


export default function UpdateEnseignantPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const enseignant = location.state;

  const [isSubmitting, setIsSubmitting] = useState(false);


  const handleSubmit = async (data: EnseignantFormData) => {
    setIsSubmitting(true);
    try {
      // Simulation d'appel API
      console.log("Mise à jour de l'enseignant:", data);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Rediriger vers la liste des enseignants
      navigate("/admin/enseignants");
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin/enseignants");
  };

  if (!enseignant) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/admin/enseignants")}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Modifier l'enseignant</h1>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
          <AlertCircle size={48} className="text-red-400 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-red-700 mb-2">
            Enseignant introuvable
          </h2>
          <p className="text-sm text-red-600 mb-4">
            L'enseignant que vous cherchez à modifier n'existe pas.
          </p>
          <button
            onClick={() => navigate("/admin/enseignants")}
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
      {/* En-tête */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/admin/enseignants")}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Retour à la liste"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Modifier l'enseignant</h1>
          <p className="text-sm text-gray-500 mt-1">
            {enseignant.prenom} {enseignant.nom}
          </p>
        </div>
      </div>

      {/* Formulaire */}
      <div className="bg-white rounded-lg shadow-sm">
        <EnseignantForm
          initialData={enseignant}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}