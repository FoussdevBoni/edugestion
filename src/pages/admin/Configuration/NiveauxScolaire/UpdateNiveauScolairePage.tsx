// src/pages/admin/configuration/niveaux/UpdateNiveauScolairePage.tsx
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import NiveauScolaireForm, { NiveauScolaireFormData } from "../../../../components/admin/forms/NiveauScolaireForm";
import { niveauxScolaires } from "../../../../data/baseData";

export default function UpdateNiveauScolairePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const niveauData = location.state;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [niveau, setNiveau] = useState<NiveauScolaireFormData | null>(null);

  useEffect(() => {
    const fetchNiveau = async () => {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        if (niveauData) {
          setNiveau({
            id: niveauData.id,
            nom: niveauData.nom
          });
        } else {
          // Fallback: prendre le premier niveau pour l'exemple
          setNiveau({
            id: niveauxScolaires[0].id,
            nom: niveauxScolaires[0].nom
          });
        }
      } catch (error) {
        console.error("Erreur lors du chargement:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNiveau();
  }, [niveauData]);

  const handleSubmit = async (data: NiveauScolaireFormData) => {
    setIsSubmitting(true);
    try {
      console.log("Mise à jour du niveau scolaire:", data);
      await new Promise(resolve => setTimeout(resolve, 1000));
      navigate("/admin/configuration/niveaux");
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin/configuration/niveaux");
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

  if (!niveau) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/admin/configuration/niveaux")}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Modifier le niveau scolaire</h1>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
          <AlertCircle size={48} className="text-red-400 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-red-700 mb-2">
            Niveau introuvable
          </h2>
          <button
            onClick={() => navigate("/admin/configuration/niveaux")}
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
          onClick={() => navigate("/admin/configuration/niveaux")}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Modifier le niveau scolaire</h1>
          <p className="text-sm text-gray-500 mt-1">
            {niveau.nom}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <NiveauScolaireForm
          initialData={niveau}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}