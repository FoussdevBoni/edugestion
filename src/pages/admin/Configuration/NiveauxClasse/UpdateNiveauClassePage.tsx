import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import NiveauClasseForm, { NiveauClasseFormData } from "../../../../components/admin/forms/NiveauClasseForm";
import { niveauxClasse } from "../../../../data/baseData";
import { niveauClasseService } from "../../../../services/niveauClasseService";
import { alertError } from "../../../../helpers/alertError";

export default function UpdateNiveauClassePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const niveauClasseData = location.state;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [niveauClasse, setNiveauClasse] = useState<NiveauClasseFormData | null>(null);

  useEffect(() => {
    const fetchNiveauClasse = async () => {
      setIsLoading(true);
      try {
        // Simulation d'attente pour le chargement
        await new Promise(resolve => setTimeout(resolve, 300));
        
        if (niveauClasseData) {
          setNiveauClasse({
            id: niveauClasseData.id,
            nom: niveauClasseData.nom,
            cycleId: niveauClasseData.cycleId,
            cycle: niveauClasseData.cycle,
            niveauScolaire: niveauClasseData.niveauScolaire
          });
        } else if (niveauxClasse && niveauxClasse.length > 0) {
          // Fallback sur les données statiques si le state est vide
          const fallback = niveauxClasse[0];
          setNiveauClasse({
            id: fallback.id,
            nom: fallback.nom,
            cycleId: fallback.cycleId,
            cycle: fallback.cycle,
            niveauScolaire: fallback.niveauScolaire
          });
        }
      } catch (error) {
        console.error("Erreur lors du chargement:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNiveauClasse();
  }, [niveauClasseData]);

  // CORRECTION : Accepte maintenant un tableau NiveauClasseFormData[]
  const handleSubmit = async (dataArray: NiveauClasseFormData[]) => {
    const data = dataArray[0]; // On récupère l'élément unique en mode modification

    if (!data || !data.id) {
      alertError();
      return;
    }

    setIsSubmitting(true);
    try {
      // Appel au service de mise à jour
      await niveauClasseService.update(data.id, {
        nom: data.nom,
        cycleId: data.cycleId
      });

      navigate("/admin/configuration/niveaux-classe");
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      alertError();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin/configuration/niveaux-classe");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 size={40} className="animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-500 font-medium">Chargement des informations...</p>
        </div>
      </div>
    );
  }

  if (!niveauClasse) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={handleCancel}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Modifier le niveau de classe</h1>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
          <AlertCircle size={48} className="text-red-400 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-red-700 mb-2">
            Niveau de classe introuvable
          </h2>
          <button
            onClick={handleCancel}
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
          onClick={handleCancel}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Modifier le niveau de classe</h1>
          <p className="text-sm text-gray-500 mt-1">
            {niveauClasse.nom} — {niveauClasse.cycle}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <NiveauClasseForm
          initialData={niveauClasse}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}