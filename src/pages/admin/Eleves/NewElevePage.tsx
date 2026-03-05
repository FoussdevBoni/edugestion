import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useEcoleNiveau } from "../../../hooks/filters/useEcoleNiveau";
import EleveForm, { EleveFormData } from "../../../components/admin/forms/EleveForm";

export default function NewElevePage() {
  const navigate = useNavigate();
  const { niveauSelectionne, cycleSelectionne } = useEcoleNiveau();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: EleveFormData) => {
    setIsSubmitting(true);
    try {
      // Simulation d'appel API
      console.log("Création d'un nouvel élève:", data);
      
      // Ici, tu ferais ton appel API pour créer l'élève
      // await api.post('/eleves', data);
      
      // Simuler un délai
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Rediriger vers la liste des élèves
      navigate("/admin/eleves");
    } catch (error) {
      console.error("Erreur lors de la création:", error);
      // Gérer l'erreur (afficher un message à l'utilisateur)
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin/eleves");
  };

  return (
    <div className="space-y-6">
      {/* En-tête avec bouton de retour */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/admin/eleves")}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Retour à la liste"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Nouvel élève</h1>
          <p className="text-sm text-gray-500 mt-1">
            Remplissez le formulaire pour inscrire un nouvel élève
          </p>
        </div>
      </div>

      {/* Indicateur des filtres actifs (optionnel) */}
      {(niveauSelectionne || cycleSelectionne) && (
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Filtres actifs :</span>{" "}
            {niveauSelectionne && <span className="text-primary">{niveauSelectionne}</span>}
            {niveauSelectionne && cycleSelectionne && " - "}
            {cycleSelectionne && <span className="text-primary">{cycleSelectionne}</span>}
            <span className="ml-2 text-gray-500">
              (Ces valeurs seront pré-remplies dans le formulaire)
            </span>
          </p>
        </div>
      )}

      {/* Formulaire */}
      <div className="bg-white rounded-lg shadow-sm">
        <EleveForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
        />
      </div>

      {/* Message d'aide (optionnel) */}
      <div className="text-sm text-gray-500 bg-gray-50 rounded-lg p-4">
        <p className="font-medium mb-1">📝 Note :</p>
        <p>
          Les champs marqués d'un astérisque (<span className="text-red-500">*</span>) sont obligatoires.
          Le niveau scolaire et le cycle sont automatiquement pré-remplis si vous avez appliqué des filtres.
        </p>
      </div>
    </div>
  );
}