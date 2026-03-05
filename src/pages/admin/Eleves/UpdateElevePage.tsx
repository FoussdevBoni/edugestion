import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, AlertCircle } from "lucide-react";
import EleveForm, { EleveFormData } from "../../../components/admin/forms/EleveForm";
import { useEcoleNiveau } from "../../../hooks/filters/useEcoleNiveau";


export default function UpdateElevePage() {
  const navigate = useNavigate();
  const { niveauSelectionne, cycleSelectionne } = useEcoleNiveau();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const  location = useLocation()


  const eleve = location.state



  const handleSubmit = async (data: EleveFormData) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Appel API pour mettre à jour
      // await api.put(`/eleves/${id}`, data);
      
      console.log("Mise à jour de l'élève:", data);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulation
      
      // Rediriger vers la liste des élèves
      navigate("/admin/eleves");
    } catch (err) {
      setError("Une erreur est survenue lors de la mise à jour");
      console.error("Erreur:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin/eleves");
  };


  


  if (error || !eleve) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/admin/eleves")}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Modifier l'élève</h1>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
          <AlertCircle size={48} className="text-red-400 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-red-700 mb-2">
            {error || "Élève introuvable"}
          </h2>
          <p className="text-sm text-red-600 mb-4">
            L'élève que vous cherchez à modifier n'existe pas ou a été supprimé.
          </p>
          <button
            onClick={() => navigate("/admin/eleves")}
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
          onClick={() => navigate("/admin/eleves")}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Retour à la liste"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Modifier l'élève</h1>
          <p className="text-sm text-gray-500 mt-1">
            {eleve.prenom} {eleve.nom} • {eleve.classe} {eleve.section && `Section ${eleve.section}`}
          </p>
        </div>
      </div>

      {/* Message sur les filtres */}
      {(niveauSelectionne || cycleSelectionne) && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-700 flex items-start gap-2">
            <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
            <span>
              Les filtres actuels n'affectent pas la modification. 
              Les données de l'élève sont pré-remplies.
            </span>
          </p>
        </div>
      )}

      {/* Formulaire */}
      <div className="bg-white rounded-lg shadow-sm">
        <EleveForm
          initialData={eleve}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}