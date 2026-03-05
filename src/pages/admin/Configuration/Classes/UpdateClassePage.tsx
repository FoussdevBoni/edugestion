// src/pages/admin/parametres/scolarite/classes/UpdateClassePage.tsx
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import ClasseForm, { ClasseFormData } from "../../../../components/admin/forms/ClasseForm";
import { classes } from "../../../../data/baseData";

export default function UpdateClassePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const classeData = location.state;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [classe, setClasse] = useState<ClasseFormData| null>(null);

  useEffect(() => {
    const fetchClasse = async () => {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        if (classeData) {
          setClasse({
            id: classeData.id,
            nom: classeData.nom,
            niveauClasseId: classeData.niveauClasseId,
            niveauClasse: classeData.niveauClasse,
            cycle: classeData.cycle,
            niveauScolaire: classeData.niveauScolaire
          });
        } else {
          // Fallback: prendre la première classe pour l'exemple
          setClasse({
            id: classes[0].id,
            nom: classes[0].nom,
            niveauClasseId: classes[0].niveauClasseId,
            niveauClasse: classes[0].niveauClasse,
            cycle: classes[0].cycle,
            niveauScolaire: classes[0].niveauScolaire
          });
        }
      } catch (error) {
        console.error("Erreur lors du chargement:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClasse();
  }, [classeData]);

  const handleSubmit = async (data: ClasseFormData) => {
    setIsSubmitting(true);
    try {
      console.log("Mise à jour de la classe:", data);
      await new Promise(resolve => setTimeout(resolve, 1000));
      navigate("/admin/configuration/classes");
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin/configuration/classes");
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

  if (!classe) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/admin/configuration/classes")}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Modifier la classe</h1>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
          <AlertCircle size={48} className="text-red-400 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-red-700 mb-2">
            Classe introuvable
          </h2>
          <button
            onClick={() => navigate(-1)}
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
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Modifier la classe</h1>
          <p className="text-sm text-gray-500 mt-1">
            {classe.nom} - {classe.niveauClasse}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <ClasseForm
          initialData={classe}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}