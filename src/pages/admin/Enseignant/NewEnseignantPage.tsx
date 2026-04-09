import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import EnseignantForm, { EnseignantFormData } from "../../../components/admin/forms/EnseignantForm";
import { enseignantService } from "../../../services/enseignantService";
import { BaseEnseignant } from "../../../utils/types/base";
import { alertServerError } from "../../../helpers/alertError";

export default function NewEnseignantPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: EnseignantFormData) => {
    setIsSubmitting(true);
    try {
      // Simulation d'appel API
      console.log("Création d'un nouvel enseignant:", data);
      const newEnsigant: BaseEnseignant = {
        nom: data.nom,
        prenom: data.prenom,
        email: data.email || "",
        tel: data.tel || "",
        enseignements: data.enseignements
      }
      await enseignantService.create(newEnsigant)

      // Rediriger vers la liste des enseignants
      navigate("/admin/enseignants");
    } catch (error) {
      console.error("Erreur lors de la création:", error);
      alertServerError(error)
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin/enseignants");
  };

  return (
    <div className="space-y-6">
      {/* En-tête avec bouton de retour */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/admin/enseignants")}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Retour à la liste"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Nouvel enseignant</h1>
          <p className="text-sm text-gray-500 mt-1">
            Remplissez le formulaire pour ajouter un nouvel enseignant
          </p>
        </div>
      </div>

      {/* Formulaire */}
      <div className="bg-white rounded-lg shadow-sm">
        <EnseignantForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
        />
      </div>

      {/* Message d'aide */}
      <div className="text-sm text-gray-500 bg-gray-50 rounded-lg p-4">
        <p className="font-medium mb-1">📝 Note :</p>
        <p>
          Les champs marqués d'un astérisque (<span className="text-red-500">*</span>) sont obligatoires.
          Vous pouvez sélectionner plusieurs matières et plusieurs classes.
        </p>
      </div>
    </div>
  );
}